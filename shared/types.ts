export interface Abfahrt {
  zug: string;
  ziel: string;
  via: string[];
  /** Geplante Abfahrt als HH:MM */
  plan: string;
  gleis: string;
  /** Neues Gleis, falls der Zug kurzfristig verlegt wurde */
  gleisNeu?: string;
  /** Verspätung in Minuten */
  verspaetung: number;
}

export interface Ankunft {
  zug: string;
  von: string;
  plan: string;
  gleis: string;
  verspaetung: number;
}

export interface Umstiegszeiten {
  /** Bahnsteige: Gleise desselben Bahnsteigs liegen sich gegenüber */
  bahnsteige: string[][];
  minuten: {
    gleichesGleis: number;
    gleicherBahnsteig: number;
    andererBahnsteig: number;
  };
}

export interface AnschlussDaten {
  ankuenfte: Ankunft[];
  umstiegszeiten: Umstiegszeiten;
}

export interface TafelZeile extends Abfahrt {
  /** Erwartete Abfahrt als HH:MM */
  erwartet: string;
}
