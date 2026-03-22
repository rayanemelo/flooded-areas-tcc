interface UserAdminEntityArgs {
  id?: number;
  name: string;
  email: string;
  password: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserAdminEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: UserAdminEntityArgs) {
    this.id = data.id!;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.active = data.active || true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
