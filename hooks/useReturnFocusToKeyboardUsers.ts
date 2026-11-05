import { useEffect } from "react";

const focusedElement = () => (document.activeElement instanceof HTMLElement ? document.activeElement : null);

export function useReturnFocusToKeyboardUsers(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const opener = focusedElement();
    const openedByKeyboard = opener?.matches(":focus-visible") ?? false;
    return () => {
      if (openedByKeyboard) opener?.focus();
      else opener?.blur();
    };
  }, [open]);
}
