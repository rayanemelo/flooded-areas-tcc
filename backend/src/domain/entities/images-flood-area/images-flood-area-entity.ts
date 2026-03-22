interface CreateImagesFloodAreaEntityArgs {
  id?: number;
  url: string;
  floodAreaId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ImagesFloodAreaEntity {
  id: number;
  url: string;
  floodAreaId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: CreateImagesFloodAreaEntityArgs) {
    this.id = data.id!;
    this.url = data.url;
    this.floodAreaId = data.floodAreaId;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
