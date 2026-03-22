interface CreateUserDeviceEntityArgs {
  id?: number;
  userId: number;
  pushToken: string;
}

export class UserDeviceEntity {
  id: number;
  userId: number;
  pushToken: string;

  constructor(data: CreateUserDeviceEntityArgs) {
    this.id = data.id!;
    this.userId = data.userId;
    this.pushToken = data.pushToken;
  }
}
