import type { AnchorHTMLAttributes } from "react";

/** A link that opens in a new tab, without giving that page a handle on this one. */
export default function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
