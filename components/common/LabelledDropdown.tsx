import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { classNames } from "@utils/classNames";
import { DropdownOption } from "@utils/types";
import { Fragment } from "react";

type LabelledDropdownProps<T> = {
  label: string;
  value: DropdownOption<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...event: any[]) => void;
  options: DropdownOption<T>[];
};

export default function LabelledDropdown<T>({
  label,
  value,
  onChange,
  options,
}: LabelledDropdownProps<T>) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-slate-400">
            {label}
          </Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full text-slate-300 cursor-default rounded-md border border-slate-600 bg-slate-700 py-2 pl-3 pr-10 text-left shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:slate-500 sm:text-sm">
              <span className="block truncate">{value.label}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 py-1 text-base shadow-lg ring-1 ring-slate-500 ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((o) => (
                  <Listbox.Option
                    key={o.label}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "text-slate-300 bg-slate-600"
                          : "text-slate-400",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={o}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-medium" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {o.label}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-slate-300" : "text-slate-400",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
