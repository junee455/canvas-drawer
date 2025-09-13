export function objToClass(
  classObj: { [key: string]: unknown },
  ...append: string[]
) {
  const keys = Object.keys(classObj) as (keyof typeof classObj)[];

  let result = `${append.join(" ")} `;

  keys.forEach((key) => {
    if (classObj[key]) {
      result = `${result} ${key}`;
    }
  });

  return result;
}
