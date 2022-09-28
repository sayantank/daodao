import { useRealmContext } from "@contexts/RealmContext";
import useProposalTimer from "@hooks/useProposalTimer";
import {
  ProgramAccount,
  Proposal,
  ProposalState,
} from "@solana/spl-governance";
import { timeSince } from "@utils/helpers";
import { getStateText } from "@utils/proposal";
import { useMemo } from "react";
import ProposalApprovalQuorum from "./ProposalApprovalQuorum";
import ProposalVoting from "./ProposalVoting";
import StateBadge from "./StateBadge";

type ProposalListItemProps = {
  proposal: ProgramAccount<Proposal>;
};
export default function ProposalListItem({ proposal }: ProposalListItemProps) {
  const { realm } = useRealmContext();

  return (
    <div className="bg-slate-700 rounded-md border border-slate-600 py-2 px-2 lg:px-4 space-y-2">
      <div className="w-full flex items-start justify-between border-b-2 border-slate-600 pb-2">
        <div>
          <h4 className="text-lg text-slate-300 font-medium">
            {proposal.account.name}
          </h4>
          <ProposalVotingDescription proposal={proposal.account} />
        </div>
        <div>
          <StateBadge proposal={proposal.account} />
        </div>
      </div>
      {proposal.account.state === ProposalState.Voting && (
        <div className="flex space-y-2 lg:space-y-0 flex-col lg:flex-row w-full lg:divide-x-2 lg:divide-slate-600">
          <div className="lg:flex-1 lg:py-1 lg:pr-2">
            <ProposalApprovalQuorum proposal={proposal.account} realm={realm} />
          </div>
          <div className="lg:flex-1 lg:py-1 lg:pl-2">
            <ProposalVoting proposal={proposal.account} realm={realm} />
          </div>
        </div>
      )}
      <div className="flex w-full justify-end">
        {proposal.account.isVoteFinalized() ? (
          <p className="text-sm text-slate-400">
            {getStateText(proposal.account.state)}{" "}
            {timeSince(new Date(proposal.account.getStateTimestamp() * 1000))}{" "}
            ago
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ProposalVotingDescription({ proposal }: { proposal: Proposal }) {
  const { realm } = useRealmContext();

  const isVoting = useMemo(
    () => proposal.state === ProposalState.Voting,
    [proposal]
  );

  const timeLeftToVote = useProposalTimer(realm, proposal);

  if (!isVoting) return null;

  return (
    <div className="text-slate-400 text-sm">
      Voting ends in {timeLeftToVote.days} days, {timeLeftToVote.hours} hours,{" "}
      {timeLeftToVote.minutes} minutes
    </div>
  );
}
