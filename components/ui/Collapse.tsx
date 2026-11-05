import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";

type Props = HTMLAttributes<HTMLElement> & { open: boolean; as?: "div" | "li"; children: ReactNode };

type DivOrLiRef = Ref<HTMLDivElement & HTMLLIElement>;

const INERT_AS_REACT_18_EXPECTS = { inert: "" } as unknown as HTMLAttributes<HTMLDivElement>;

const Collapse = forwardRef<HTMLElement, Props>(function Collapse(
  { open, as: Tag = "div", className = "", children, ...rest },
  ref,
) {
  const rows = open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0";
  return (
    <Tag ref={ref as DivOrLiRef} className={`grid transition-[grid-template-rows,opacity] ${rows} ${className}`} {...rest}>
      <div className="overflow-hidden" {...(!open && INERT_AS_REACT_18_EXPECTS)}>{children}</div>
    </Tag>
  );
});

export default Collapse;
