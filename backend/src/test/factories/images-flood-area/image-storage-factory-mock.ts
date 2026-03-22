import { faker } from '@faker-js/faker';

export class ImageStorageMockFactory {
  static createEntity(): string {
    return `data:image/png;base64,${faker.string.alphanumeric(1000)}`;
  }
}
