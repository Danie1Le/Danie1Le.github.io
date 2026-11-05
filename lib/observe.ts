type OnEntry = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;

export function observeIntersections(targets: Element[], onEntry: OnEntry, options?: IntersectionObserverInit) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => onEntry(entry, observer)), options);
  targets.forEach((target) => observer.observe(target));
  return () => observer.disconnect();
}
