interface CreateUserAlertPreferenceEntityArgs {
  id?: number;
  userId: number;
  state: string;
  city: string;
}

export class UserAlertPreferenceEntity {
  id: number;
  userId: number;
  state: string;
  city: string;

  constructor(data: CreateUserAlertPreferenceEntityArgs) {
    this.id = data.id!;
    this.userId = data.userId;
    this.state = data.state;
    this.city = data.city;
  }
}
