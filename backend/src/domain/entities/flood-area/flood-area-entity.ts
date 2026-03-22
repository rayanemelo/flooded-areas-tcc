interface CreateFloodAreaEntityArgs {
  id?: number;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  status: string;
  userId: number;
  floodLevelId: number;
  commentsAdmin?: string;
  active?: boolean;
  yesCount?: number;
  noCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FloodAreaEntity {
  id: number;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  status: string;
  userId: number;
  floodLevelId: number;
  commentsAdmin: string | null;
  yesCount: number;
  noCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: CreateFloodAreaEntityArgs) {
    this.id = data.id!;
    this.address = data.address;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.city = data.city;
    this.state = data.state;
    this.status = data.status || 'pending';
    this.userId = data.userId;
    this.floodLevelId = data.floodLevelId;
    this.commentsAdmin = data.commentsAdmin || null;
    this.active = data.active || true;
    this.yesCount = data.yesCount || 0;
    this.noCount = data.noCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
