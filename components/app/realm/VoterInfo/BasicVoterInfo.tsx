import TokenOwnerRecordActionModal from "@components/modals/TokenOwnerRecordActionModal";
import { useRealmContext } from "@contexts/RealmContext";
import { useState } from "react";
import BasicVoterCard from "../VoterCard/BasicVoterCard";

export default function BasicVoterInfo() {
  const { realm } = useRealmContext();

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <BasicVoterCard
          showEmpty
          label={"Community Votes"}
          onDeposit={() => setModalOpen(true)}
          onWithdraw={() => setModalOpen(true)}
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
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
