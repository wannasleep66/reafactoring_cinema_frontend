export function clsx(
  args: Array<string | { [key: string]: boolean }> | string
) {
  if (typeof args === "string") {
    return args;
  }

  return args.reduce((className, arg) => {
    if (typeof arg === "string") {
      return className ? `${className} ${arg}` : arg;
    } else {
      const keys = Object.keys(arg).filter((key) => arg[key]);
      const filteredClassNames = keys.join(" ");
      return className
        ? `${className} ${filteredClassNames}`
        : filteredClassNames;
    }
  }, "");
}
