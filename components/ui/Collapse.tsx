import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLElement> & { open: boolean; as?: "div" | "li"; children: ReactNode };

const INERT_AS_REACT_18_EXPECTS = { inert: "" } as unknown as HTMLAttributes<HTMLDivElement>;

export default function Collapse({ open, as: Tag = "div", className = "", children, ...rest }: Props) {
  const rows = open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0";
  return (
    <Tag className={`grid transition-[grid-template-rows,opacity] ${rows} ${className}`} {...rest}>
      <div className="overflow-hidden" {...(!open && INERT_AS_REACT_18_EXPECTS)}>{children}</div>
    </Tag>
  );
}
