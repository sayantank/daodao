import { useRealmContext } from "@contexts/RealmContext";
import BasicVoterInfo from "./BasicVoterInfo";

export default function VoterInfo() {
  const { realm } = useRealmContext();

  switch (realm.id) {
    case "basic": {
      return <BasicVoterInfo />;
    }
    default: {
      throw new Error("Unsupported realm");
    }
  }
}
