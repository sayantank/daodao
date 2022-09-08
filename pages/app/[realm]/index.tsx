import { useRealmContext } from "@contexts/RealmContext";
import { useAtaBalance } from "@hooks/useAtaBalance";
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
  const { balance: communityBalance } = useAtaBalance(
    wallet.publicKey,
    realm.account.account.communityMint
  );

  useEffect(() => {
    console.log("realm: ", realm);
  }, [realm]);

  useEffect(() => {
    console.log("tokenOwnerRecord: ", tokenOwnerRecord);
  }, [tokenOwnerRecord]);

  return (
    <div>
      <div className="text-white">{communityBalance?.uiAmount || 0}</div>
    </div>
  );
}

RealmScreen.getLayout = (page: ReactNode) => getRealmLayout(page);
