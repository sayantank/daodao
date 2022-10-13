import { IRealm } from "./realm";

export interface IInstruction {
  readonly id: InstructionID;
  readonly label: string;
  readonly description: string;

  readonly Form: (props: InstructionFormProps) => JSX.Element | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly getSerializedInstruction: (...args: any[]) => string | null;

  serializedInstruction: string | null;
}

export type InstructionFormProps = {
  realm: IRealm;
  realmInstruction: IInstruction;
};

export type InstructionID = "transfer";
