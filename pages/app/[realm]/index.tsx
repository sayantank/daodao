import { useRealmContext } from "@contexts/RealmContext";
import { useTokenOwnerRecord } from "@hooks/useTokenOwnerRecord";
import { getRealmLayout } from "@layouts/RealmLayout";
import { useWallet } from "@solana/wallet-adapter-react";
import { ReactNode, useEffect } from "react";

export default function RealmScreen() {
  const wallet = useWallet();
  const { realm } = useRealmContext();
  const { tokenOwnerRecord } = useTokenOwnerRecord(
    realm,
    realm.account.account.communityMint,
    wallet.publicKey
  );

  useEffect(() => {
    console.log("tokenOwnerRecord: ", tokenOwnerRecord);
  }, [tokenOwnerRecord]);

  return (
    <div>
      <div>realm</div>
    </div>
  );
}

RealmScreen.getLayout = (page: ReactNode) => getRealmLayout(page);
