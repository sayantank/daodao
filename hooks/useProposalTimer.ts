import { Proposal, ProposalState } from "@solana/spl-governance";
import { getGovernanceForProposal } from "@utils/proposal";
import { ZERO_TIME_DELTA, msToTime } from "@utils/time";
import { IRealm } from "lib/interfaces";
import { useEffect, useMemo, useState } from "react";

export default function useProposalTimer(
  realm: IRealm,
  proposal: Proposal,
  intervalSecs = 60
) {
  const [timeLeftToVote, setTimeLeftToVote] = useState(ZERO_TIME_DELTA);

  const governance = useMemo(
    () => getGovernanceForProposal(proposal, realm.governances),
    [realm.governances, proposal]
  );

  useEffect(() => {
    let it: NodeJS.Timer | null;

    if (governance && proposal.state === ProposalState.Voting) {
      it = setInterval(() => {
        setTimeLeftToVote(
          msToTime(proposal.getTimeToVoteEnd(governance.account) * 1000)
        );
      }, 1000 * intervalSecs);

      setTimeLeftToVote(
        msToTime(proposal.getTimeToVoteEnd(governance.account) * 1000)
      );
    } else {
      it = null;
      setTimeLeftToVote(ZERO_TIME_DELTA);
    }

    return () => {
      if (it) clearInterval(it);
    };
  }, [proposal, governance, intervalSecs]);

  return timeLeftToVote;
}
