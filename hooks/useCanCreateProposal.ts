import { Governance } from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";
import { IRealm } from "lib/interfaces";
import { useEffect, useState } from "react";
import { useTokenOwnerRecord } from "./useTokenOwnerRecord";

export const useCanCreateProposal = (
  owner?: PublicKey,
  realm?: IRealm,
  governance?: Governance
): boolean => {
  const communityTokenRecord = useTokenOwnerRecord(
    realm,
    realm?.communityMint.address,
    owner
  );
  const councilTokenRecord = useTokenOwnerRecord(
    realm,
    realm?.councilMint?.address,
    owner
  );

  const [canCreateProposal, setCanCreateProposal] = useState(false);

  useEffect(() => {
    if (!governance) {
      setCanCreateProposal(false);
      return;
    }

    const canCommunityCreate =
      communityTokenRecord.data !== undefined &&
      governance.config.minCommunityTokensToCreateProposal.lte(
        communityTokenRecord.data.account.governingTokenDepositAmount
      );

    const canCouncilCreate =
      councilTokenRecord.data !== undefined &&
      governance.config.minCouncilTokensToCreateProposal.lte(
        councilTokenRecord.data.account.governingTokenDepositAmount
      );

    setCanCreateProposal(canCommunityCreate || canCouncilCreate);
  }, [governance, communityTokenRecord.data, councilTokenRecord.data]);

  return canCreateProposal;
};
