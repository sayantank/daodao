import { useRealmContext } from "@contexts/RealmContext";
import BasicVoterCard from "./BasicVoterCard";

export default function VoterCard() {
  const { realm } = useRealmContext();

  switch (realm.id) {
    case "basic": {
      return <BasicVoterCard />;
    }
    default: {
      throw new Error("Unsupported realm");
    }
  }
}
