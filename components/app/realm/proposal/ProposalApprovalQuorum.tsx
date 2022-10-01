import SmallBadge from "@components/common/SmallBadge";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useApprovalQuorum } from "@hooks/useApprovalQuorum";
import { Proposal } from "@solana/spl-governance";
import { getGovernanceForProposal } from "@utils/proposal";
import { tokenAtomicsToPrettyDecimal } from "@utils/token";
import { IRealm } from "lib/interfaces";
import { useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";

const APPROVAL_QUORUM_TOOLTIP_MSG =
  "The percentage of tokens that must vote YES to a proposal for it to be considered successful.";

type ProposalApprovalQuorumProps = {
  proposal: Proposal;
  realm: IRealm;
};
export default function ProposalApprovalQuorum({
  proposal,
  realm,
}: ProposalApprovalQuorumProps) {
  const governance = useMemo(() => {
    return getGovernanceForProposal(proposal, realm.governances);
  }, [proposal, realm.governances]);

  const approvalQuorum = useApprovalQuorum(
    proposal,
    realm,
    governance?.account
  );

  const [tooltip, setTooltip] = useState(true);

  // TODO: Add loading state
  if (!approvalQuorum) return null;

  return (
    <>
      <div className="w-full space-y-1">
        <div>
          <div className="flex items-center space-x-1">
            <p className="text-sm text-slate-400">Approval Quorum</p>
            <QuestionMarkCircleIcon
              data-tip={APPROVAL_QUORUM_TOOLTIP_MSG}
              onMouseEnter={() => setTooltip(true)}
              onMouseLeave={() => {
                setTooltip(false);
                setTimeout(() => setTooltip(true), 500);
              }}
              className="text-slate-400 h-5 w-5"
            />
          </div>
          <div className="flex w-full items-center justify-between -mt-0.5">
            <div className="flex space-x-1 items-baseline">
              <p className="text-lg font-semibold text-slate-300">
                {approvalQuorum.currentQuorumPercentage}%
              </p>
            </div>
            <div>
              {approvalQuorum.yesVotes.lt(approvalQuorum.quorum) ? (
                <p className="text-sm text-slate-400 space-x-1">
                  <span className="text-lg font-semibold text-slate-300">
                    {tokenAtomicsToPrettyDecimal(
                      approvalQuorum.quorum.sub(approvalQuorum.yesVotes),
                      approvalQuorum.tokenDecimals
                    )}
                  </span>
                  <span>yes votes remaining</span>
                </p>
              ) : (
                <SmallBadge
                  dot="text-cyan-400"
                  style="text-cyan-400 font-semibold mb-1"
                >
                  Quorum Reached
                </SmallBadge>
              )}
            </div>
          </div>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden bg-slate-600">
          <div
            className={`w-[${approvalQuorum.currentQuorumPercentage}%] h-full bg-cyan-400`}
          />
        </div>
      </div>
      {tooltip && <ReactTooltip />}
    </>
  );
}
