import { IPushNotificationService } from '../../../domain/services/push-notification-service';

export const PushNotificationServiceMock: jest.Mocked<IPushNotificationService> =
  {
    send: jest.fn(),
  };
