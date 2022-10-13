import ButtonLeftIcon from "@components/common/ButtonLeftIcon";
import LabelledDropdown from "@components/common/LabelledDropdown";
import { useRealmContext } from "@contexts/RealmContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getAppLayout } from "@layouts/AppLayout";
import { useWallet } from "@solana/wallet-adapter-react";
import { classNames } from "@utils/classNames";
import { getInstructions } from "@utils/proposal";
import { DropdownOption } from "@utils/types";
import { IInstruction, InstructionFormProps } from "lib/interfaces/instruction";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

type CreateProposalFormProps = {
  title: string;
  description: string;
  instructions: DropdownOption<IInstruction>[];
};

export default function CreateProposal() {
  const router = useRouter();

  const wallet = useWallet();
  const { realm, isLoading, error } = useRealmContext();

  // const canCreateProposal = useCanCreateProposal(wallet.publicKey, realm);

  const { register, handleSubmit, control, watch } =
    useForm<CreateProposalFormProps>();
  const { fields, append } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "instructions", // unique name for your Field Array
    rules: {
      validate: (ix) =>
        ix.length > 0 &&
        instructions.every((i) => i.value.serializedInstruction !== null),
    },
  });
  const instructions = watch("instructions");

  const onSubmit: SubmitHandler<CreateProposalFormProps> = (data) => {
    console.log(data);
  };

  const realmInstructions = useMemo(() => getInstructions(), []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!realm) return null;

  return (
    <div className="space-y-6">
      <div className="">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-slate-400"
        >
          Go back
        </button>
        <h1 className="text-2xl font-semibold text-slate-300">
          Create Proposal for {realm.name}
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-slate-800 px-4 py-5 shadow sm:rounded-lg rounded-md sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-slate-300">
                Proposal Details
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                General information such as the title and description for the
                proposal to be created.
              </p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-400">
                    Title
                  </label>
                  <input
                    type="text"
                    className="mt-1 text-slate-300 shadow-sm block w-full flex-1 border border-slate-600 bg-slate-700 w focus:border-slate-500 focus:ring-slate-500 px-3 py-2 rounded-md sm:text-sm"
                    placeholder="www.example.com"
                    {...register("title", { required: true })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    rows={3}
                    className="block w-full text-slate-300 px-3 py-2 rounded-md border border-slate-600 bg-slate-700 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    placeholder="you@example.com"
                    {...register("description")}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your proposals.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 px-4 py-5 shadow sm:rounded-lg rounded-md sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-slate-300">
                Proposal Transaction
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                List of instructions to be executed on approval of the proposal.
              </p>
            </div>
            <div className="mt-5 space-y-4 md:col-span-2 md:mt-0 divide-y divide-slate-700">
              {fields.map((field, index) => (
                <div key={`${index}-${field.id}`}>
                  <div
                    className={classNames(
                      "grid grid-cols-3 gap-6",
                      index !== 0 ? "pt-2" : ""
                    )}
                  >
                    <div className="col-span-3 sm:col-span-2">
                      <Controller
                        control={control}
                        name={`instructions.${index}`}
                        rules={{ required: true }}
                        defaultValue={realmInstructions[0]}
                        render={({ field: { value, onChange } }) => (
                          <LabelledDropdown
                            value={value}
                            onChange={onChange}
                            label="Instruction"
                            options={realmInstructions}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <InstructionFormWrapper
                    Form={instructions[index].value.Form}
                    props={{
                      realm,
                      realmInstruction: instructions[index].value,
                    }}
                  />
                </div>
              ))}
              <div className="pt-3 flex justify-end">
                <div className="max-w-sm">
                  <ButtonLeftIcon
                    icon={<PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />}
                    className="justify-center flex-1"
                    type="primary"
                    onClick={() => append(realmInstructions[0])}
                  >
                    Add Instruction
                  </ButtonLeftIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end pb-4">
          <button
            type="submit"
            className="disabled:opacity-40 inline-flex items-center rounded-md border border-transparent bg-blue-500 px-3 py-2 text-sm font-medium leading-4 text-slate-100 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Proposal
          </button>
        </div>
      </form>
    </div>
  );
}

function InstructionFormWrapper({
  Form,
  props,
}: {
  Form: (props: InstructionFormProps) => JSX.Element | null;
  props: InstructionFormProps;
}) {
  return (
    <div>
      <Form {...props} />
    </div>
  );
}

CreateProposal.getLayout = (page: ReactNode) => getAppLayout(page);
