interface CreateUserHistoryEntitiesArgs {
  userId: number;
  address: string;
  latitude: string;
  longitude: string;
  status: string; // 'pending', 'approved', 'rejected'
  commentsAdmin?: string;
  createdAt: Date;
}

export class UserHistoryEntities {
  userId: number;
  address: string;
  latitude: string;
  longitude: string;
  status: string;
  commentsAdmin: string | null;
  createdAt: Date;

  constructor(data: CreateUserHistoryEntitiesArgs) {
    this.userId = data.userId;
    this.address = data.address;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.status = data.status;
    this.commentsAdmin = data.commentsAdmin || null;
    this.createdAt = data.createdAt;
  }
}
