/**
 * # toString
 *
 * Turns an object passed as an argument to string.
 *
 * @template A Type of the object passed.
 * @param { A } source Source object.
 * @returns { string } String version of the passed object.
 */
export const toString = (source) => JSON.stringify(source)
