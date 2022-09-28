import {
  Governance,
  ProgramAccount,
  Proposal,
  ProposalState,
} from "@solana/spl-governance";
import { IInstruction } from "lib/interfaces/instruction";
import { TransferInstruction } from "lib/intstructions/transfer";
import { DropdownOption } from "./types";

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
