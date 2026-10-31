import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLElement> & { open: boolean; as?: "div" | "li"; children: ReactNode };

// React 18 only renders `inert` given a string, but the (experimental) React types want a boolean.
const INERT = { inert: "" } as unknown as HTMLAttributes<HTMLDivElement>;

/**
 * Content that folds open and shut (height and opacity, via grid rows). Pass the speed in `className`, e.g.
 * "duration-700 ease-expo". Shut, its content is inert: out of the tab order and hidden from screen readers.
 */
export default function Collapse({ open, as: Tag = "div", className = "", children, ...rest }: Props) {
  return (
    <Tag
      className={`grid transition-[grid-template-rows,opacity] ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} ${className}`}
      {...rest}
    >
      <div className="overflow-hidden" {...(!open && INERT)}>{children}</div>
    </Tag>
  );
}
