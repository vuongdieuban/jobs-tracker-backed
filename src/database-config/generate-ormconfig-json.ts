// This script is run in package json, run it before manually run CLI migration
// This script will generate an ormconfig.json file for us to run typeorm CLI for migration

import fs = require('fs');
import { typeormConfigOptions } from './typeorm-config-options';

fs.writeFileSync('ormconfig.json', JSON.stringify(typeormConfigOptions, null, 2));
