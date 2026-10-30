/** "a, b and c": a list joined the way a sentence would say it. */
export const joinAnd = (items: string[]) => items.join(", ").replace(/, ([^,]*)$/, " and $1");
