import { Governance, Proposal } from "@solana/spl-governance";
import { getApprovalQuorum } from "@utils/proposal";
import { arePubkeysEqual } from "@utils/pubkey";
import { ApprovalQuorumInfo } from "@utils/types";
import { IRealm } from "lib/interfaces";
import { useEffect, useMemo, useState } from "react";
import { useMint } from "./useMint";

export const useApprovalQuorum = (
  proposal: Proposal,
  realm: IRealm,
  governance?: Governance
): ApprovalQuorumInfo | null => {
  const isCommunityMint = useMemo(() => {
    return arePubkeysEqual(
      realm.communityMint.address,
      proposal.governingTokenMint
    );
  }, [realm.communityMint.address, proposal.governingTokenMint]);

  const [quorumInfo, setQuorumInfo] = useState<ApprovalQuorumInfo | null>(null);

  const { data: mint, error } = useMint(
    isCommunityMint ? realm.communityMint.address : realm.councilMint?.address
  );

  useEffect(() => {
    if (mint && governance) {
      setQuorumInfo(getApprovalQuorum(proposal, governance, realm, mint));
    } else {
      console.log(mint, governance);
      console.log("haha");
      setQuorumInfo(null);
    }
  }, [mint, realm, proposal, governance]);

  if (error) {
    return null;
  }

  return quorumInfo;
};
