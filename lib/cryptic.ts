import CryptoJS from "crypto-js";

export function encrypt(text: string): string {
  const key = defineEncryptionKey();
  let cipherText = CryptoJS.AES.encrypt(text, key).toString();
  return cipherText;
}

export function decrypt(cipherText: string): string {
  const key = defineEncryptionKey();
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export function defineEncryptionKey() {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  if (!ENCRYPTION_KEY) {
    throw new Error(
      "Please define the ENCRYPTION_KEY environment variable inside .env.local",
    );
  }
  return ENCRYPTION_KEY;
}
