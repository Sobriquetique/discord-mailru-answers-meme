import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path'

const __filename = fileURLToPath(import.meta.url);
export const __projectRoot = path.resolve(dirname(__filename), '..');