export type PushNotificationMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export interface IPushNotificationService {
  send(messages: PushNotificationMessage[]): Promise<void>;
}
