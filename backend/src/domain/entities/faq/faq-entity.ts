interface CreateFaqEntityArgs {
  id?: number;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FaqEntity {
  id: number;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: CreateFaqEntityArgs) {
    this.id = data.id!;
    this.question = data.question;
    this.answer = data.answer;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
