import ButtonLeftIcon from "@components/common/ButtonLeftIcon";
import { useRealmContext } from "@contexts/RealmContext";
import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/outline";
import { useAtaBalance } from "@hooks/useAtaBalance";
import { useTokenOwnerRecord } from "@hooks/useTokenOwnerRecord";
import { BN_ZERO } from "@solana/spl-governance";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { tokenAtomicsToPrettyDecimal } from "@utils/token";
import BN from "bn.js";

type BasicVoterCardProps = {
  label: string;
  onDeposit: React.MouseEventHandler<HTMLButtonElement>;
  onWithdraw: React.MouseEventHandler<HTMLButtonElement>;
  mint?: PublicKey | null;
  showEmpty?: boolean;
};
export default function BasicVoterCard({
  label,
  mint,
  showEmpty,
  onDeposit,
  onWithdraw,
}: BasicVoterCardProps) {
  const wallet = useWallet();
  const { realm } = useRealmContext();

  const { data: tokenOwnerRecord, isLoading: tokenOwnerRecordLoading } =
    useTokenOwnerRecord(realm, mint, wallet.publicKey);

  const { data: balance, isLoading: balanceLoading } = useAtaBalance(
    wallet.publicKey,
    mint
  );

  const isLoading = tokenOwnerRecordLoading || balanceLoading;

  if (!mint || !realm || !wallet.connected) return null;

  if (!showEmpty && !balance?.uiAmount && !tokenOwnerRecord) return null;

  if (isLoading) {
    return (
      <div className="w-full animate-pulse h-40 bg-slate-800 rounded-lg" />
    );
  }

  return (
    <div className="bg-slate-800 p-3 rounded-lg space-y-2 divide-y divide-slate-700">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-slate-300">{label}</h3>
          <p className="text-sm text-slate-400">
            Balance:{" "}
            {balance
              ? tokenAtomicsToPrettyDecimal(
                  new BN(balance.amount),
                  balance.decimals
                )
              : 0}
          </p>
        </div>
        <p className="text-3xl sm:text-4xl font-semibold text-slate-200">
          {tokenOwnerRecord
            ? tokenAtomicsToPrettyDecimal(
                tokenOwnerRecord.account.governingTokenDepositAmount,
                realm.communityMint.decimals
              )
            : 0}
          <span className="text-sm font-medium ml-1">votes</span>
        </p>
      </div>

      <div className="flex space-x-2 pt-4 ">
        <ButtonLeftIcon
          icon={<ArrowSmallDownIcon className="-ml-1 mr-2 h-5 w-5" />}
          className="justify-center flex-1"
          type="primary"
          onClick={onDeposit}
          disabled={!balance?.uiAmount}
        >
          Deposit
        </ButtonLeftIcon>
        <ButtonLeftIcon
          icon={<ArrowSmallUpIcon className="-ml-1 mr-2 h-5 w-5" />}
          className="justify-center flex-1"
          type="primary"
          onClick={onWithdraw}
          disabled={
            !tokenOwnerRecord?.account.governingTokenDepositAmount.gt(BN_ZERO)
          }
        >
          Withdraw
        </ButtonLeftIcon>
      </div>
    </div>
  );
}
