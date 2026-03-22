interface CreateNotificationEntityArgs {
  id?: number;
  userId?: number | null;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NotificationEntity {
  id: number;
  userId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: CreateNotificationEntityArgs) {
    this.id = data.id!;
    this.userId = data.userId ?? null;
    this.content = data.content;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
