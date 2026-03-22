import {
  IPushNotificationService,
  PushNotificationMessage,
} from '../../domain/services/push-notification-service';

type ExpoPushPayload = {
  to: string;
  title: string;
  body: string;
  sound: 'default';
  data?: Record<string, unknown>;
};

export class ExpoPushNotificationService implements IPushNotificationService {
  async send(messages: PushNotificationMessage[]): Promise<void> {
    if (messages.length === 0) return;

    const payload: ExpoPushPayload[] = messages.map((message) => ({
      to: message.to,
      title: message.title,
      body: message.body,
      sound: 'default',
      data: message.data,
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to send push notifications with Expo service.');
    }
  }
}
