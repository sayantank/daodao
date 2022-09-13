import ButtonLeftIcon from "@components/common/ButtonLeftIcon";
import { useRealmContext } from "@contexts/RealmContext";
import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/outline";
import { useTokenOwnerRecord } from "@hooks/useTokenOwnerRecord";
import { useWallet } from "@solana/wallet-adapter-react";
import { tokenAtomicsToPrettyDecimal } from "@utils/token";

export default function BasicVoterCard() {
  const wallet = useWallet();
  const { realm } = useRealmContext();

  const { data: communityTokenOwnerRecord } = useTokenOwnerRecord(
    realm,
    realm.communityMint.address,
    wallet.publicKey
  );

  const { data: councilTokenOwnerRecord } = useTokenOwnerRecord(
    realm,
    realm.councilMint?.address,
    wallet.publicKey
  );

  return (
    <div className="bg-slate-800 p-3 rounded-lg space-y-2 divide-y divide-slate-700">
      <div>
        <h3 className="text-slate-300">Community Votes</h3>
        <p className="text-3xl sm:text-4xl font-semibold text-slate-200">
          {communityTokenOwnerRecord
            ? tokenAtomicsToPrettyDecimal(
                communityTokenOwnerRecord.account.governingTokenDepositAmount,
                realm.communityMint.decimals
              )
            : 0}
          <span className="text-sm font-medium ml-1">votes</span>
        </p>
      </div>
      {realm.councilMint ? (
        <div className="pt-2">
          <h3 className="text-slate-300">Council Votes</h3>
          <p className="text-3xl sm:text-4xl font-semibold text-slate-200">
            {councilTokenOwnerRecord
              ? tokenAtomicsToPrettyDecimal(
                  councilTokenOwnerRecord.account.governingTokenDepositAmount,
                  realm.communityMint.decimals
                )
              : 0}
            <span className="text-sm font-medium ml-1">votes</span>
          </p>
        </div>
      ) : null}
      <div className="flex space-x-2 pt-4 ">
        <ButtonLeftIcon
          icon={<ArrowSmallDownIcon className="-ml-1 mr-2 h-5 w-5" />}
          className="justify-center flex-1"
          type="primary"
        >
          Deposit
        </ButtonLeftIcon>
        <ButtonLeftIcon
          icon={<ArrowSmallUpIcon className="-ml-1 mr-2 h-5 w-5" />}
          className="justify-center flex-1"
          type="primary"
        >
          Withdraw
        </ButtonLeftIcon>
      </div>
    </div>
  );
}
