import { RealmMeta } from "@lib";
import Image from "next/image";

type RealmGridCardProps = {
  realm: RealmMeta;
};
const RealmGridCard = ({ realm }: RealmGridCardProps) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-slate-700 transition-all">
      <div className="h-10 w-10 rounded-full overflow-hidden">
        <Image
          src={realm.ogImage}
          width={1}
          height={1}
          layout="responsive"
          alt={realm.name}
        />
      </div>
      <div className="block text-slate-200">{realm.name}</div>
    </div>
  );
};

export default RealmGridCard;
