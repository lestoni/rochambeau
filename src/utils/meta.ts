// Contains useful stats utilities about the application
import fs from 'fs';
import path from 'path';

import IP from 'ip';

export const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8').toString());

export const ip = IP.address();
