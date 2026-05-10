import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from './constants';

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PNG, JPG, or WEBP.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}

export function validateApiKey(key: string): boolean {
  // Basic validation - check if it's not empty and has reasonable length
  return key.trim().length > 10;
}
