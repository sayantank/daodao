import { classNames } from "@utils/classNames";

type SmallDotBadgeProps = {
  bg: string;
  textColor: string;
  dotColor: string;
  children: React.ReactNode;
};
export default function SmallDotBadge({
  bg,
  textColor,
  dotColor,
  children,
}: SmallDotBadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        bg,
        textColor
      )}
    >
      <svg
        className={classNames("mr-1.5 h-2 w-2", dotColor)}
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx={4} cy={4} r={3} />
      </svg>
      {children}
    </span>
  );
}
