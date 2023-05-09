export type CreateVideoInputModel = {
  title: string;
  author: string;
  availableResolutions: string[];
};

export type UpdateVideoInputModel = {
  title: string;
  author: string;
  availableResolutions: string[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: string;
};

export type VideoViewOutputModel = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: string[];
};
