import { InstructionFormProps } from "lib/interfaces/instruction";

export default function TransferInstructionForm({
  realm,
}: InstructionFormProps) {
  return <h1>{realm.name}</h1>;
}
