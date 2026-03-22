import { ISmsService } from '../../../domain/services/sms-service';

export const SmsServiceMock: jest.Mocked<ISmsService> = {
  send: jest.fn(),
};
