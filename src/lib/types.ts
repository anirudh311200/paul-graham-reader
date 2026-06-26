export interface Essay {
  slug: string;
  title: string;
  url: string;
  isNew: boolean;
  firstSeenAt: string | null;
}

export interface EssayContent {
  slug: string;
  title: string;
  date: string | null;
  html: string;
  originalUrl: string;
}

export interface EssayCatalog {
  essays: Essay[];
  picks: Essay[];
  newEssays: Essay[];
  syncedAt: string;
}

export const NEW_THRESHOLD_DAYS = 10;
export const BASELINE_FIRST_SEEN = "2020-01-01T00:00:00.000Z";
