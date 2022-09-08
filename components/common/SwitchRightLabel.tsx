import { Switch } from "@headlessui/react";
import { classNames } from "@utils/classNames";

type SwitchRightLabelProps = {
  children: React.ReactNode;
  enabled: boolean;
  onChange: () => void;
};

const SwitchRightLabel = ({
  children,
  enabled,
  onChange,
}: SwitchRightLabelProps) => {
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={onChange}
        className={classNames(
          enabled ? "bg-green-600" : "bg-slate-600",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        {children}
      </Switch.Label>
    </Switch.Group>
  );
};

export default SwitchRightLabel;
