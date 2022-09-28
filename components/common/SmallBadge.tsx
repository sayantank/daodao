import { classNames } from "@utils/classNames";
import { BadgeProps } from "@utils/types";

export default function SmallBadge({ style, dot, children }: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        style || ""
      )}
    >
      {dot ? (
        <svg
          className={classNames("mr-1.5 h-2 w-2", dot || "")}
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx={4} cy={4} r={3} />
        </svg>
      ) : null}
      {children}
    </span>
  );
}
