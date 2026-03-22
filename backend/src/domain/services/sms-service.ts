export interface ISmsService {
  send(phone: string, message: string): Promise<void>;
}
