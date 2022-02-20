import path from 'path'
import dotenv from 'dotenv'
import moduleAlias from 'module-alias'

// Configuration for '.env' files
dotenv.config()

// Register module alias for the
// '@' path to be the root of the
// directory structure.
moduleAlias.addAliases({
  '@': path.resolve(__dirname, '..'),
})
