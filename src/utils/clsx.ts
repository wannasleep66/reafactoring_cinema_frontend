export function clsx(
  args: Array<string | { [key: string]: boolean }> | string
): string {
  if (typeof args === "string") {
    return args;
  }

  return args.reduce(
    (className: string, arg: string | { [key: string]: boolean }) => {
      if (typeof arg === "string") {
        return className ? `${className} ${arg}` : arg;
      } else {
        const keys = Object.keys(arg).filter((key) => arg[key]);
        const filteredClassNames = keys.join(" ");
        return className
          ? `${className} ${filteredClassNames}`
          : filteredClassNames;
      }
    },
    ""
  );
}
