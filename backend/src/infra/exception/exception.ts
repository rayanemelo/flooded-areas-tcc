export class Exception extends Error {
  public code: number;
  public message: string;

  constructor(code: number, message: string) {
    super(`${code} - ${message}`);
    this.code = code;
    this.message = message;
  }
}
