import Image from "next/image";
import { useRealmContext } from "@contexts/RealmContext";
import { prettifyPubkey } from "@utils/pubkey";
import { LinkType, getExplorerLink } from "@utils/url";
import { useSolana } from "@contexts/SolanaContext";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import SmallBadge from "@components/common/SmallBadge";

const stats = [
  { label: "lorem ipsum", value: 12 },
  { label: "lorem ipsum", value: 4 },
  { label: "lorem ipsum", value: 2 },
];

export default function RealmHeader() {
  const { cluster } = useSolana();
  const { realm } = useRealmContext();

  if (!realm) return null;

  return (
    <div className="overflow-hidden rounded-lg bg-slate-800 shadow">
      <div className="bg-slate-800 p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              {realm.imageUrl && (
                <div className="mx-auto h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={realm.imageUrl}
                    height={1}
                    width={1}
                    layout="responsive"
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-xl font-semibold text-slate-200 sm:text-2xl">
                {realm.name}
              </p>
              <div className="flex items-center space-x-2 justify-center sm:justify-start sm:pt-1">
                <SmallBadge
                  dot="text-slate-200"
                  style="bg-slate-700 text-slate-200"
                >
                  V{realm.programVersion}
                </SmallBadge>
                <div className="flex items-center space-x-1">
                  <p className="text-sm text-slate-400">
                    Community Token:{" "}
                    {realm.communityMint.symbol
                      ? realm.communityMint.symbol
                      : prettifyPubkey(realm.communityMint.address)}
                  </p>
                  <a
                    href={getExplorerLink(
                      LinkType.Address,
                      realm.communityMint.address.toBase58(),
                      cluster
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center sm:mt-0">
            <a
              href="#"
              className="flex items-center justify-center rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-400 shadow-sm hover:bg-slate-600 transition-all"
            >
              CTA
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-slate-600 border-t border-slate-600 bg-slate-700 sm:grid-cols-3 sm:divide-y-0 sm:divide-x ">
        {stats.map((stat) => (
          <div
            key={stat.label + "-" + stat.value}
            className="px-6 py-5 text-center text-sm font-medium"
          >
            <span className="text-slate-400">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
