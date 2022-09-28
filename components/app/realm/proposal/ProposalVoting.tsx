import { BN_ZERO, Proposal } from "@solana/spl-governance";
import { arePubkeysEqual } from "@utils/pubkey";
import { tokenAtomicsToPrettyDecimal } from "@utils/token";
import BN from "bn.js";
import { IRealm } from "lib/interfaces";
import { useEffect, useState } from "react";

type ProposalVotingProps = {
  proposal: Proposal;
  realm: IRealm;
};
export default function ProposalVoting({
  proposal,
  realm,
}: ProposalVotingProps) {
  const isCommunityVote = arePubkeysEqual(
    realm.communityMint.address,
    proposal.governingTokenMint
  );

  const [yesPercentage, setYesPercentage] = useState(0);
  const [noPercentage, setNoPercentage] = useState(0);

  useEffect(() => {
    const totalVotes = proposal
      .getYesVoteCount()
      .add(proposal.getNoVoteCount());

    if (totalVotes.gt(BN_ZERO)) {
      const yes = proposal
        .getYesVoteCount()
        .mul(new BN(100))
        .div(totalVotes)
        .toNumber();
      setYesPercentage(yes);

      setNoPercentage(100 - yes);
    }
  }, [proposal]);

  return (
    <div className="w-full space-y-1">
      <div className="flex w-full items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Yes Votes</p>
          <div className="flex space-x-1 items-baseline">
            <p className="text-lg font-semibold text-slate-300 -mt-0.5">
              {tokenAtomicsToPrettyDecimal(
                proposal.getYesVoteCount(),
                isCommunityVote
                  ? realm.communityMint.decimals
                  : realm.councilMint
                  ? realm.councilMint?.decimals
                  : 0
              )}
            </p>
            <p className="text-sm text-slate-400">{yesPercentage}%</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">No Votes</p>
          <div className="flex space-x-1 items-baseline">
            <p className="text-lg font-semibold text-slate-300 -mt-0.5">
              {tokenAtomicsToPrettyDecimal(
                proposal.getNoVoteCount(),
                isCommunityVote
                  ? realm.communityMint.decimals
                  : realm.councilMint
                  ? realm.councilMint?.decimals
                  : 0
              )}
            </p>
            <p className="text-sm text-slate-400">{noPercentage}%</p>
          </div>
        </div>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden">
        <div className={`w-[${yesPercentage}%] h-full bg-emerald-400`} />
        <div className={`w-[${noPercentage}%] h-full bg-rose-400`} />
      </div>
    </div>
  );
}
