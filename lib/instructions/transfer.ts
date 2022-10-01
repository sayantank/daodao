import TransferInstructionForm from "@components/app/instructions/Transfer";
import { IInstruction, InstructionFormProps } from "lib/interfaces/instruction";

export class TransferInstruction implements IInstruction {
  private _form: (props: InstructionFormProps) => JSX.Element;
  constructor() {
    this._form = TransferInstructionForm;
  }

  public get Form(): (props: InstructionFormProps) => JSX.Element {
    return this._form;
  }
}
