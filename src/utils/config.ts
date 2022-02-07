// Helper utility to work with configurations
import dotenv from 'dotenv';

function getConfig(envKey: string): string {
    return process.env[envKey];
}

export default {
  get: getConfig,
};
