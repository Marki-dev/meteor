type MyObject = Record<string, any>;

export default function checkObjectDifference(
  obj1: MyObject,
  obj2: MyObject,
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return true;
  }

  for (const key of keys1) {
    // eslint-disable-next-line no-prototype-builtins
    if (!obj2.hasOwnProperty(key)) {
      return true;
    }

    if (obj1[key] !== obj2[key]) {
      return true;
    }
  }

  return false;
}
