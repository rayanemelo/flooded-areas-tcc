export function cleanNumber(phone: string) {
  return phone.replace(/[()\s-]/g, '');
}
