import { IRealm } from "./realm";

export interface IInstruction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Form: (props: InstructionFormProps) => JSX.Element;
}

export type InstructionFormProps = {
  realm: IRealm;
  title: string;
  description: string;
};
