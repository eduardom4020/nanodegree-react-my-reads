export const ObjectsEquality = (obj1, obj2) => (
    JSON.stringify(obj1, Object.keys(obj1).sort()) === JSON.stringify(obj2, Object.keys(obj2).sort())
)

export const ArrayOfObjectsEquality = (obj1, obj2) => (
    obj1.map(obj => JSON.stringify(obj, Object.keys(obj).sort())).join(' ') === obj2.map(obj => JSON.stringify(obj, Object.keys(obj).sort())).join(' ')
)