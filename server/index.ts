import { existsSync } from 'node:fs';
import { createApp } from './app.ts';
import { konfigurationAus } from './konfiguration.ts';

const ENV_DATEI = new URL('../.env', import.meta.url);
if (existsSync(ENV_DATEI)) process.loadEnvFile(ENV_DATEI);

const PORT = Number(process.env.PORT ?? 3001);

createApp(konfigurationAus(process.env)).listen(PORT, () => console.log(`API läuft auf http://localhost:${PORT}`));
