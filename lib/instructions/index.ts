import { IInstruction } from "lib/interfaces/instruction";
import { TransferSOLInstruction } from "./transferSOL";

export const RealmInstructions: IInstruction[] = [new TransferSOLInstruction()];
