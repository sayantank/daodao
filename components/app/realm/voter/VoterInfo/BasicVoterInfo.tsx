import TokenOwnerRecordActionModal from "@components/modals/TokenOwnerRecordActionModal";
import { useRealmContext } from "@contexts/RealmContext";
import { MintMeta } from "@lib";
import { TokenOwnerRecordAction } from "@utils/types";
import { useState } from "react";
import BasicVoterCard from "../VoterCard/BasicVoterCard";

export default function BasicVoterInfo() {
  const { realm } = useRealmContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMint, setActionMint] = useState<MintMeta | undefined>(undefined);
  const [actionType, setActionType] = useState<TokenOwnerRecordAction | null>(
    null
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActionMint(undefined);
    setActionType(null);
  };

  const handleOpenModal = (mint: MintMeta, action: TokenOwnerRecordAction) => {
    setIsModalOpen(true);
    setActionMint(mint);
    setActionType(action);
  };

  if (!realm) return null;

  return (
    <>
      <div className="space-y-4">
        <BasicVoterCard
          showEmpty
          label={"Community Votes"}
          onDeposit={() =>
            handleOpenModal(realm.communityMint, TokenOwnerRecordAction.Deposit)
          }
          onWithdraw={() =>
            handleOpenModal(
              realm.communityMint,
              TokenOwnerRecordAction.Withdraw
            )
          }
          mint={realm.communityMint.address}
        />
        {/* <BasicVoterCard
        onDeposit={handleCommunityDeposit}
        onWithdraw={handleCommunityDeposit}
        label={"Council Votes"}
        mint={realm.councilMint?.address}
      /> */}
      </div>
      <TokenOwnerRecordActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        action={actionType}
        mint={actionMint}
      />
    </>
  );
}
