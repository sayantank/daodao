import { classNames } from "@utils/classNames";
import React from "react";

type ButtonTypes = "primary";

type ButtonLeftIconProps = {
  icon: JSX.Element;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: ButtonTypes;
  disabled?: boolean;
};

export default function ButtonLeftIcon({
  icon,
  children,
  className,
  type,
  disabled,
  onClick,
}: ButtonLeftIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        className || "",
        "inline-flex items-center rounded-md border shadow-sm border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-40",
        getButtonStyle(type)
      )}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
}

const getButtonStyle = (type?: ButtonTypes) => {
  switch (type) {
    case "primary":
      return "bg-slate-600 text-white hover:bg-slate-700 disabled:hover:bg-slate-600 focus:ring-slate-500";
    default:
      return "bg-indigo-600 text-white hover:bg-indigo-700 disabled:hover:bg-indigo-600 focus:ring-indigo-500";
  }
};
