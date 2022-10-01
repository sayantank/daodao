import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { RealmWalletType } from "@lib";
import { PublicKey } from "@solana/web3.js";
import { classNames } from "@utils/classNames";
import { isPubkey, prettifyPubkey } from "@utils/pubkey";
import { SOL_DECIMALS, tokenAtomicsToPrettyDecimal } from "@utils/token";

type WalletAccordionProps = {
  wallet: RealmWalletType;
  name: string | PublicKey;
};

export default function WalletAccordion({
  wallet,
  name,
}: WalletAccordionProps) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              open ? "bg-slate-600" : "bg-slate-700",
              "flex w-full justify-between rounded-lg  px-4 py-2 text-left  hover:bg-slate-600 focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-7"
            )}
          >
            <span className="font-medium text-slate-300">
              {isPubkey(name) ? prettifyPubkey(new PublicKey(name)) : name}
            </span>
            <ChevronUpIcon
              className={`${
                open ? "rotate-180 transform" : ""
              } h-5 w-5 text-slate-500`}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="px-3 py-2 text-sm text-gray-500 bg-slate-700 rounded-md">
              <div className="space-y-1">
                <h3 className="text-sm text-slate-400">Tokens</h3>
                <div className="space-y-1">
                  <div className="w-full bg-slate-600 rounded-md p-2 flex justify-between">
                    <div className="text-slate-300">SOL</div>
                    <div className="text-slate-300">
                      {tokenAtomicsToPrettyDecimal(
                        wallet.nativeTreasury.lamports,
                        SOL_DECIMALS
                      )}
                    </div>
                  </div>
                  {wallet.assets.tokenAccountAssets.map((a) => (
                    <div
                      key={a.address.toBase58()}
                      className="w-full bg-slate-600 rounded-md p-2 flex justify-between"
                    >
                      <div className="text-slate-300">
                        {prettifyPubkey(a.mint.address)}
                      </div>
                      <div className="text-slate-300">
                        {tokenAtomicsToPrettyDecimal(
                          a.balance,
                          a.mint.decimals
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
