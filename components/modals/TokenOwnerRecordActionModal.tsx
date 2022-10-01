/* eslint-disable @typescript-eslint/no-non-null-assertion */
import TokenInput from "@components/common/TokenInput";
import { useRealmContext } from "@contexts/RealmContext";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAtaBalance } from "@hooks/useAtaBalance";
import { useTokenOwnerRecord } from "@hooks/useTokenOwnerRecord";
import { MintMeta } from "@lib";
import { BN_ZERO } from "@solana/spl-governance";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { arePubkeysEqual } from "@utils/pubkey";
import { sendWalletTransaction } from "@utils/transaction";
import { TokenOwnerRecordAction } from "@utils/types";
import BN from "bn.js";
import { Fragment, MouseEventHandler } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type TokenOwnerActionFormProps = {
  amount: BN;
};

type TokenOwnerRecordActionModalProps = {
  isOpen: boolean;
  onClose: () => unknown;
  action: TokenOwnerRecordAction | null;
  mint?: MintMeta;
};
export default function TokenOwnerRecordActionModal({
  isOpen,
  onClose,
  action,
  mint,
}: TokenOwnerRecordActionModalProps) {
  const { realm } = useRealmContext();

  const { connection } = useConnection();
  const wallet = useWallet();

  const isCommunityMint =
    mint && arePubkeysEqual(mint.address, realm!.communityMint.address);

  const {
    data: balance,
    isLoading: balanceLoading,
    mutate: balanceMutate,
  } = useAtaBalance(wallet.publicKey, mint?.address);

  const { mutate: tokenOwnerMutate } = useTokenOwnerRecord(
    realm,
    mint?.address,
    wallet.publicKey
  );

  const { handleSubmit, control, setValue } =
    useForm<TokenOwnerActionFormProps>({ defaultValues: { amount: 0 } });

  const onDeposit: SubmitHandler<TokenOwnerActionFormProps> = async (data) => {
    if (!wallet.publicKey) throw new Error("Wallet not connected");

    try {
      const { preInstructions, instructions, postInstructions } =
        await realm!.getDepositCommunityTokenInstructions(
          connection,
          data.amount,
          wallet.publicKey
        );

      const tx = new Transaction().add(
        ...preInstructions,
        ...instructions,
        ...postInstructions
      );

      const txSig = await sendWalletTransaction(connection, tx, wallet);
      await connection.confirmTransaction(txSig);

      await Promise.all([balanceMutate(), tokenOwnerMutate()]);

      onClose();

      console.log(txSig);
    } catch (e) {
      // TODO: Toast error
      console.error(e);
    }
  };

  const onWithdraw: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    console.log("withdrawing");
  };

  if (!action || !mint) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between"
                >
                  <p className="text-lg font-medium leading-6 text-slate-300">
                    {action === TokenOwnerRecordAction.Deposit
                      ? "Deposit"
                      : "Withdraw"}{" "}
                    {isCommunityMint ? "Community" : "Council"} Tokens
                  </p>
                  <button onClick={onClose}>
                    <XMarkIcon className="w-6 h-6 text-slate-400 hover:animate-pulse" />
                  </button>
                </Dialog.Title>
                <div>
                  {action === TokenOwnerRecordAction.Deposit ? (
                    <form onSubmit={handleSubmit(onDeposit)}>
                      <div className="mt-2">
                        <Controller
                          control={control}
                          name="amount"
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TokenInput
                              value={value}
                              onChange={onChange}
                              balance={balance}
                              mint={mint}
                              onMax={() =>
                                setValue(
                                  "amount",
                                  balance ? new BN(balance.amount) : BN_ZERO
                                )
                              }
                            />
                          )}
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          type="submit"
                          disabled={balanceLoading || !wallet.publicKey}
                          className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                        >
                          {action === TokenOwnerRecordAction.Deposit
                            ? "Deposit"
                            : "Withdraw"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <p className="text-sm text-slate-400 mt-2">
                        Are you sure you want to withdraw your votes?
                      </p>
                      <div className="mt-4 flex space-x-2">
                        <button
                          type="button"
                          onClick={onWithdraw}
                          className="inline-flex justify-center rounded-md border border-transparent bg-slate-600 px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                        >
                          Withdraw
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
