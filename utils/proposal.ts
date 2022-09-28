import {
  Governance,
  MintMaxVoteWeightSource,
  MintMaxVoteWeightSourceType,
  ProgramAccount,
  Proposal,
  ProposalState,
  VoteThresholdType,
} from "@solana/spl-governance";
import { Mint } from "@solana/spl-token";
import BN from "bn.js";
import { IRealm } from "lib/interfaces";
import { IInstruction } from "lib/interfaces/instruction";
import { TransferInstruction } from "lib/intstructions/transfer";
import { arePubkeysEqual } from "./pubkey";
import { ApprovalQuorumInfo, DropdownOption } from "./types";

export const InitialFilters = {
  Cancelled: false,
  Completed: true,
  Defeated: true,
  Draft: false,
  Executable: true,
  ExecutingWithErrors: true,
  SigningOff: true,
  Voting: true,
};

export type Filters = typeof InitialFilters;

export const getGovernanceForProposal = (
  proposal: Proposal,
  governances: ProgramAccount<Governance>[]
) => {
  return governances.find(
    (g) => g.pubkey.toBase58() === proposal.governance.toBase58()
  );
};

export const getApprovalQuorum = (
  proposal: Proposal,
  governance: Governance,
  realm: IRealm,
  governingMint: Mint
): ApprovalQuorumInfo => {
  const isCommunityMint = arePubkeysEqual(
    realm.communityMint.address,
    governingMint.address
  );

  const maxVoterWeight = isCommunityMint
    ? realm.account.account.config.communityMintMaxVoteWeightSource
    : MintMaxVoteWeightSource.FULL_SUPPLY_FRACTION;

  const votingThreshold = isCommunityMint
    ? governance.config.communityVoteThreshold
    : governance.config.councilVoteThreshold;

  if (
    votingThreshold.type !== VoteThresholdType.YesVotePercentage ||
    !votingThreshold.value
  )
    throw new Error("Voting threshold not supported");

  const yesVotes = proposal.getYesVoteCount();

  let maxVotes: BN;
  switch (maxVoterWeight.type) {
    case MintMaxVoteWeightSourceType.SupplyFraction: {
      const governingMintSupply = new BN(governingMint.supply.toString());
      maxVotes = governingMintSupply
        .mul(maxVoterWeight.value)
        .div(MintMaxVoteWeightSource.FULL_SUPPLY_FRACTION.value);
      break;
    }
    case MintMaxVoteWeightSourceType.Absolute: {
      maxVotes = maxVoterWeight.value;
      break;
    }
    default: {
      throw new Error("Invalid ");
    }
  }

  const quorum = maxVotes.muln(votingThreshold.value).divn(100);
  const percentage = yesVotes.muln(100).div(maxVotes);

  return {
    quorum,
    yesVotes,
    maxVotes,
    tokenDecimals: governingMint.decimals,
    percentage: percentage.toNumber(),
    quorumPercentage: votingThreshold.value,
  };
};

export const getStateText = (state: ProposalState) => {
  switch (state) {
    case ProposalState.Draft:
      return "Draft";
    case ProposalState.SigningOff:
      return "Signing Off";
    case ProposalState.Voting:
      return "Voting";
    case ProposalState.Executing:
      return "Executing";
    case ProposalState.Completed:
      return "Completed";
    case ProposalState.Cancelled:
      return "Cancelled";
    case ProposalState.Defeated:
      return "Defeated";
    case ProposalState.ExecutingWithErrors:
      return "Executing With Errors";
    case ProposalState.Succeeded:
      return "Succeeded";
    default:
      return "";
  }
};

export const compareProposals = (
  p1: Proposal,
  p2: Proposal,
  governances: {
    [governance: string]: ProgramAccount<Governance>;
  }
) => {
  const p1Rank = p1.getStateSortRank();
  const p2Rank = p2.getStateSortRank();

  if (p1Rank > p2Rank) {
    return 1;
  } else if (p1Rank < p2Rank) {
    return -1;
  }

  if (p1.state === ProposalState.Voting && p2.state === ProposalState.Voting) {
    const p1VotingRank = getVotingStateRank(p1, governances);
    const p2VotingRank = getVotingStateRank(p2, governances);

    if (p1VotingRank > p2VotingRank) {
      return 1;
    } else if (p1VotingRank < p2VotingRank) {
      return -1;
    }

    // Show the proposals in voting state expiring earlier at the top
    return p2.getStateTimestamp() - p1.getStateTimestamp();
  }

  return p1.getStateTimestamp() - p2.getStateTimestamp();
};

export const filterProposals = (
  proposals: ProgramAccount<Proposal>[],
  filters: Filters
) => {
  return proposals.filter((proposal) => {
    if (
      !filters.Cancelled &&
      proposal.account.state === ProposalState.Cancelled
    ) {
      return false;
    }

    if (!filters.Completed) {
      if (proposal.account.state === ProposalState.Completed) {
        return false;
      }

      if (
        proposal.account.state === ProposalState.Succeeded &&
        !hasInstructions(proposal.account)
      ) {
        return false;
      }
    }

    if (
      !filters.Defeated &&
      proposal.account.state === ProposalState.Defeated
    ) {
      return false;
    }

    if (!filters.Draft && proposal.account.state === ProposalState.Draft) {
      return false;
    }

    if (!filters.Executable) {
      if (proposal.account.state === ProposalState.Executing) {
        return false;
      }

      if (
        proposal.account.state === ProposalState.Succeeded &&
        hasInstructions(proposal.account)
      ) {
        return false;
      }
    }

    if (
      !filters.ExecutingWithErrors &&
      proposal.account.state === ProposalState.ExecutingWithErrors
    ) {
      return false;
    }

    if (
      !filters.SigningOff &&
      proposal.account.state === ProposalState.SigningOff
    ) {
      return false;
    }

    if (!filters.Voting && proposal.account.state === ProposalState.Voting) {
      return false;
    }

    return true;
  });
};

export function getInstructions(): DropdownOption<IInstruction>[] {
  return [
    {
      label: "Transfer",
      value: new TransferInstruction(),
    },
  ];
}

function getVotingStateRank(
  proposal: Proposal,
  governances: {
    [governance: string]: ProgramAccount<Governance>;
  }
) {
  // Show proposals in Voting state before proposals in Finalizing state
  const governance = governances[proposal.governance.toBase58()].account;
  return proposal.hasVoteTimeEnded(governance) ? 0 : 1;
}

const hasInstructions = (proposal: Proposal) => {
  if (proposal.instructionsCount) {
    return true;
  }

  if (proposal.options) {
    for (const option of proposal.options) {
      if (option.instructionsCount) {
        return true;
      }
    }
  }

  return false;
};
