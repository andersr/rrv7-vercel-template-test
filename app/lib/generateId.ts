import { customAlphabet } from "nanoid";
const shortNanoId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

export function generateId() {
  return shortNanoId();
}
