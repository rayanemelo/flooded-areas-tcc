interface CreateCodeEntityArgs {
  id?: number;
  code: string;
  userId: number;
  dateExp?: Date;
  attemptsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CodeEntity {
  id: number;
  code: string;
  dateExp: Date;
  userId: number;
  attemptsCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: CreateCodeEntityArgs) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);

    this.id = data.id!;
    this.code = data.code;
    this.dateExp = now;
    this.userId = data.userId;
    this.attemptsCount = data.attemptsCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
