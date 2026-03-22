import { ISmsService } from '../../domain/services/sms-service';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = require('twilio')(accountSid, authToken);

export class SmsServiceTwilio implements ISmsService {
  async send(phone: string, message: string): Promise<void> {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: `+55${phone}`,
    });
  }
}
