export function getFieldValue<T>(
  propertyName: string,
  obj: T
): Array<string> | string | undefined {
  // @todo: remove this ts-expect-error
  // @ts-expect-error
  let result = propertyName.split(".").reduce((acc, currentValue) => {
    if (Array.isArray(acc)) {
      return acc.flatMap((item) => (item ? item[currentValue] : []));
    }
    return acc ? acc[currentValue as keyof typeof obj] : undefined;
  }, obj);

  return result;
}