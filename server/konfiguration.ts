export interface Konfiguration {
  bahnhofName: string;
  fahrplanToken?: string;
}

export function konfigurationAus(env: NodeJS.ProcessEnv): Konfiguration {
  const bahnhofName = env.BAHNHOF_NAME?.trim();
  if (!bahnhofName) throw new Error('BAHNHOF_NAME fehlt, bitte in der .env setzen (siehe .env.example)');
  return { bahnhofName, fahrplanToken: env.FAHRPLAN_TOKEN?.trim() || undefined };
}
