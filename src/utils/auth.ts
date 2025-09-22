// Custom password hashing utility for browser environment

/**
 * Hash a password using Web Crypto API (browser-compatible)
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Use Web Crypto API which is available in browsers
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

/**
 * Verify a password against a hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

/**
 * Generate a secure session token using Web Crypto API
 */
export const generateSessionToken = (): string => {
  // Use crypto.getRandomValues for browser compatibility
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};