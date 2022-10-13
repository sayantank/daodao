import LabelledDropdown from "@components/common/LabelledDropdown";
import PubkeyInput from "@components/common/PubkeyInput";
import TokenInput from "@components/common/TokenInput";
import { NativeTreasury } from "@lib";
import { BN_ZERO } from "@solana/spl-governance";
import { PublicKey } from "@solana/web3.js";
import { prettifyPubkey } from "@utils/pubkey";
import { SOL_MINT_META } from "@utils/token";
import { DropdownOption } from "@utils/types";
import { IRealm } from "lib/interfaces";
import { IInstruction } from "lib/interfaces/instruction";
import { useEffect, useMemo, useState } from "react";

export default function TransferSOLInstructionForm({
  realm,
  realmInstruction,
}: {
  realm: IRealm;
  realmInstruction: IInstruction;
}) {
  const nativeTreasuries: DropdownOption<NativeTreasury>[] = useMemo(() => {
    return realm?.nativeTreasuries.map((nt) => ({
      label: prettifyPubkey(nt.address),
      value: nt,
    }));
  }, [realm]);

  const [recipient, setRecipient] = useState<PublicKey | null>(null);
  const [sender, setSender] = useState<DropdownOption<NativeTreasury>>(
    nativeTreasuries[0]
  );
  const [amount, setAmount] = useState(BN_ZERO);

  useEffect(() => {
    realmInstruction.serializedInstruction =
      realmInstruction.getSerializedInstruction(
        recipient,
        sender.value,
        amount
      );
  }, [recipient, sender, amount, realmInstruction]);

  if (!realm) return null;

  return (
    <div className="mt-2 space-y-3">
      <div>
        <LabelledDropdown
          label="Sender"
          options={nativeTreasuries}
          value={sender}
          onChange={(e) => setSender(e)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          Recipient
        </label>
        <PubkeyInput value={recipient} onChange={(e) => setRecipient(e)} />
      </div>
      <div>
        <TokenInput
          mint={SOL_MINT_META}
          value={amount}
          onChange={(e) => setAmount(e)}
          balance={sender.value.lamports}
          onMax={() => setAmount(sender.value.lamports)}
        />
      </div>
    </div>
  );
}
