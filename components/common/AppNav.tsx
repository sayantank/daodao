import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { WalletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "@utils/classNames";
import { Wallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import Image from "next/image";
import { CLUSTERS, useSolana } from "@contexts/SolanaContext";
import SwitchRightLabel from "./SwitchRightLabel";
import { isDevnet } from "@utils/url";

const AppNav = () => {
  const { cluster, setCluster } = useSolana();
  const { wallets, select, connected, disconnect, publicKey } = useWallet();

  const [connectableWallets, setConnectableWallets] =
    useState<Wallet[]>(wallets);

  const handleDevnetToggle = () => {
    if (isDevnet(cluster)) setCluster(CLUSTERS[0]);
    else setCluster(CLUSTERS[2]);
  };

  useEffect(() => {
    setConnectableWallets(
      wallets.filter(
        (w) =>
          w.readyState === WalletReadyState.Installed ||
          w.readyState === WalletReadyState.Loadable
      )
    );
  }, [wallets]);

  return (
    <Disclosure
      as="nav"
      className="flex-shrink-0 bg-slate-900 border-b border-slate-700"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Logo section */}
              <div className="flex items-center px-2 lg:px-0 xl:w-64">
                <div className="flex-shrink-0">
                  <h1 className="text-lg font-bold text-white">DAO.DAO</h1>
                </div>
              </div>

              {/* Search section */}
              {/* <div className="flex flex-1 justify-center lg:justify-end">
                <div className="w-full px-2 lg:px-6">
                  <label htmlFor="search" className="sr-only">
                    Search projects
                  </label>
                  <div className="relative text-slate-200 focus-within:text-gray-400">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full rounded-md border border-transparent bg-slate-400 bg-opacity-25 py-2 pl-10 pr-3 leading-5 text-slate-100 placeholder-slate-200 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                      placeholder="Search projects"
                      type="search"
                    />
                  </div>
                </div>
              </div> */}
              <div className="flex lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-slate-800 p-2 text-slate-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-600">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <WalletIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              {/* Links section */}
              <div className="hidden lg:block lg:w-80">
                <div className="flex items-center justify-end">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-4 flex-shrink-0">
                    <div>
                      <Menu.Button className="flex px-3 py-2 rounded-lg bg-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-700">
                        <span className="sr-only">Wallet Button</span>
                        <p className="font-semibold">
                          {!connected
                            ? "Connect"
                            : `${publicKey?.toBase58().slice(0, 6)}...`}
                        </p>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-slate-700 rounded-md bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div>
                          {!connected &&
                            connectableWallets.map((w) => (
                              <Menu.Item key={w.adapter.name}>
                                {({ active }) => (
                                  <button
                                    onClick={() => select(w.adapter.name)}
                                    className={classNames(
                                      active
                                        ? "bg-slate-700 text-slate-300"
                                        : "text-slate-400",
                                      "group flex items-center space-x-2  px-4 py-2 text-sm w-full"
                                    )}
                                  >
                                    <div className="h-6 w-6 rounded-full">
                                      <Image
                                        unoptimized
                                        src={w.adapter.icon}
                                        width={1}
                                        height={1}
                                        layout="responsive"
                                        alt={w.adapter.name}
                                      />
                                    </div>
                                    <p>{w.adapter.name}</p>
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          {connected && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => disconnect()}
                                  className={classNames(
                                    active
                                      ? "bg-slate-700 text-slate-300"
                                      : "text-slate-400",
                                    "group flex items-center space-x-2  px-4 py-2 text-sm w-full"
                                  )}
                                >
                                  Disconnect
                                </button>
                              )}
                            </Menu.Item>
                          )}
                        </div>
                        <div>
                          <div className="px-4 py-2">
                            <SwitchRightLabel
                              enabled={isDevnet(cluster)}
                              onChange={handleDevnetToggle}
                            >
                              <span className="text-sm text-slate-400">
                                Devnet
                              </span>
                            </SwitchRightLabel>
                          </div>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          {/* TODO: Change to Menu (Dropdown) and add Devnet toggle*/}
          <Disclosure.Panel className="lg:hidden">
            {connected ? (
              <div className="px-3 pt-2 pb-3 border-b border-slate-800 text-white">
                <p className="text-sm font-light">Connected to</p>
                <p className="font-semibold">
                  {publicKey?.toBase58().slice(0, 12)}...
                </p>
              </div>
            ) : null}
            <div className=" pt-4 pb-3">
              <div className="space-y-1 px-2">
                {!connected ? (
                  connectableWallets.map((w) => (
                    <Disclosure.Button
                      key={w.adapter.name}
                      onClick={() => select(w.adapter.name)}
                      className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-600 hover:text-slate-100"
                    >
                      <div className="h-6 w-6 rounded-full">
                        <Image
                          unoptimized
                          src={w.adapter.icon}
                          width={1}
                          height={1}
                          layout="responsive"
                          alt={w.adapter.name}
                        />
                      </div>
                      <p>{w.adapter.name}</p>
                    </Disclosure.Button>
                  ))
                ) : (
                  <Disclosure.Button
                    onClick={() => disconnect()}
                    className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-600 hover:text-slate-100"
                  >
                    Disconnect
                  </Disclosure.Button>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AppNav;
