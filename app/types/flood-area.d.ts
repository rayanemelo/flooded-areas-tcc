export type Status = 'pending' | 'completed' | 'rejected';

export type FloodArea = {
  id: number;
  active: boolean;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  commentsAdmin?: string;
  status: Status;
  images?: FloodAreaImage[];
  floodLevelId: number;
  noCount: number;
  yesCount: number;
  userId: number;
  updatedAt: string;
};

export type FloodAreaForm = {
  image: string;
  address: string;
  longitude: number | string;
  latitude: number | string;
  status: string; //'pending' | 'completed' | 'rejected';
  floodLevelId: number;
  userLocation: {
    latitude: number | string;
    longitude: number | string;
  };
};

export type FloodAreaImage = {
  id: number;
  floodAreaId: number;
  url: string;
  createdAt: string;
  updatedAt: string;
};

export type FloodAreaUpdate = {
  id: number;
  yesCount: number;
  noCount: number;
};
