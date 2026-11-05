export const joinAnd = (items: string[]) => items.join(", ").replace(/, ([^,]*)$/, " and $1");
