export default function checkObjectDifference(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return true;
    }

    for (let key of keys1) {
        if (!obj2.hasOwnProperty(key)) {
            return true;
        }

        if (obj1[key] !== obj2[key]) {
            return true;
        }
    }

    return false;
}
