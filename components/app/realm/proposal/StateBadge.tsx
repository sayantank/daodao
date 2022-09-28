import SmallBadge from "@components/common/SmallBadge";
import { Proposal, ProposalState } from "@solana/spl-governance";

type StateBadgeProps = {
  proposal: Proposal;
};
export default function StateBadge({ proposal }: StateBadgeProps) {
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
          dot="text-purple-500"
        >
          Voting
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
