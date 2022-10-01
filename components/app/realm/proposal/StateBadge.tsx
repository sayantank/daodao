import SmallBadge from "@components/common/SmallBadge";
import { useRealmContext } from "@contexts/RealmContext";
import { Proposal, ProposalState } from "@solana/spl-governance";
import { getGovernanceForProposal } from "@utils/proposal";
import { useMemo } from "react";

type StateBadgeProps = {
  proposal: Proposal;
};
export default function StateBadge({ proposal }: StateBadgeProps) {
  const { realm } = useRealmContext();

  const governance = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => getGovernanceForProposal(proposal, realm!.governances),
    [realm, proposal]
  );

  const isVotingOver = useMemo(() => {
    return (
      proposal.state === ProposalState.Voting &&
      governance &&
      proposal.getTimeToVoteEnd(governance.account)
    );
  }, [proposal, governance]);

  switch (proposal.state) {
    case ProposalState.Defeated:
      return (
        <SmallBadge style="text-red-400 border border-red-500">
          Defeated
        </SmallBadge>
      );
    case ProposalState.Succeeded:
      return (
        <SmallBadge style="text-green-400 border border-green-500">
          Succeeded
        </SmallBadge>
      );
    case ProposalState.Completed:
      return (
        <SmallBadge style="text-slate-400 border border-slate-500">
          Completed
        </SmallBadge>
      );
    case ProposalState.Executing:
      return (
        <SmallBadge style="text-purple-400 border border-purple-500">
          Executing
        </SmallBadge>
      );
    case ProposalState.Voting:
      return (
        <SmallBadge
          style="text-purple-400 border border-purple-500"
          dot={!isVotingOver ? "text-purple-500" : undefined}
        >
          {!isVotingOver ? "Voting" : "Voting Done"}
        </SmallBadge>
      );
    case ProposalState.SigningOff:
      return (
        <SmallBadge
          style="text-yellow-400 border border-yellow-500"
          dot="text-yellow-500"
        >
          Draft
        </SmallBadge>
      );
    case ProposalState.Draft:
      return (
        <SmallBadge
          style="text-slate-400 border border-slate-500"
          dot="text-slate-500"
        >
          Draft
        </SmallBadge>
      );
    case ProposalState.Cancelled:
      return (
        <SmallBadge style="text-red-400 border border-red-500">
          Cancelled
        </SmallBadge>
      );
    default:
      return null;
  }
}
