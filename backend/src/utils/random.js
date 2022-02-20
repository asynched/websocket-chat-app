import ung from 'unique-names-generator'

/**
 * # getRandomUsername
 *
 * Helper function to get a random username.
 *
 * @returns { string } A random username.
 */
export const getRandomUsername = () => {
  return ung.uniqueNamesGenerator({
    length: 2,
    separator: '-',
    style: 'lowerCase',
    dictionaries: [ung.adjectives, ung.names],
  })
}
