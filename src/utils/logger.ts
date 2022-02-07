// Utility for logger interface
import winston from 'winston';

import config from '../utils/config';
import { pkg } from '../utils/meta';

const { combine, timestamp, label, printf, colorize } = winston.format;

const appFormat = printf(({ level, message, label, timestamp }): string => {
  return `[${label}] ${timestamp} - ${level}: ${message}`;
});

const logger: winston.Logger = winston.createLogger({
  level: config.get('LOG_LEVEL'),
  format: combine(
    label({ label: pkg.name }),
    timestamp(),
    colorize(),
    appFormat,
  ),
  transports: [
    new winston.transports.Console()
  ],
});


export default logger;
