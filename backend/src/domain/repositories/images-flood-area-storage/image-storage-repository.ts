export interface IImageStorageRepository {
  uploadImageBase64(imageBase64: string): Promise<string>;
}
