import { classNames } from "@utils/classNames";
import React from "react";

type ButtonTypes = "primary";

type ButtonLeftIconProps = {
  icon: JSX.Element;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: ButtonTypes;
};

export default function ButtonLeftIcon({
  icon,
  children,
  className,
  type,
}: ButtonLeftIconProps) {
  return (
    <button
      type="button"
      className={classNames(
        className || "",
        "inline-flex items-center rounded-md border shadow-sm border-transparent px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all",
        getButtonStyle(type)
      )}
    >
      {icon}
      {children}
    </button>
  );
}

const getButtonStyle = (type?: ButtonTypes) => {
  switch (type) {
    case "primary":
      return "bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500";
    default:
      return "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500";
  }
};
