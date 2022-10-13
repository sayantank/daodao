import TransferSOLInstructionForm from "@components/app/instructions/TransferSOL";
import { serializeInstructionToBase64 } from "@solana/spl-governance";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import { IInstruction } from "lib/interfaces/instruction";
import { NativeTreasury } from "lib/types";

export class TransferSOLInstruction implements IInstruction {
  readonly Form = TransferSOLInstructionForm;
  readonly id = "transfer";
  readonly label = "Transfer SOL";
  readonly description = "Transfer a token from one account to another";

  serializedInstruction: string | null = null;

  getSerializedInstruction(
    recipient: PublicKey | null,
    sender: NativeTreasury,
    amount: BN
  ): string | null {
    if (!recipient) return null;

    return serializeInstructionToBase64(
      SystemProgram.transfer({
        fromPubkey: sender.address,
        toPubkey: recipient,
        lamports: BigInt(amount.toString()),
      })
    );
  }
}
