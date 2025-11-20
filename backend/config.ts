
/**
 * SECURE BACKEND CONFIGURATION
 * 
 * This file is intended for the server-side logic (Node.js).
 * It reads credentials from Environment Variables to ensure security.
 * 
 * HOW TO USE:
 * 1. Ensure you have a file named ".env" in your project root.
 * 2. The backend will automatically load these values.
 * 
 * WARNING: Never commit the .env file to public version control (GitHub, etc).
 */

// In a real Node.js environment, you would load dotenv like this:
// import dotenv from 'dotenv'; 
// dotenv.config(); 

export const GHL_CONFIG = {
  // The Private Integration Token found in GHL Agency Settings > Integrations
  privateToken: process.env.GHL_PRIVATE_TOKEN || '',
  
  // Your Agency Company ID found in GHL Agency Settings > Company
  companyId: process.env.GHL_COMPANY_ID || '',
  
  // The Snapshot ID to load into new sub-accounts (AdSpot 2.0 Template)
  snapshotId: process.env.GHL_SNAPSHOT_ID || '',
  
  // (Optional) Specific Location ID if operating on a single sub-account
  locationId: process.env.GHL_LOCATION_ID || '',
};

// Validation Helper
export const validateConfig = () => {
  const missingKeys: string[] = [];
  
  if (!GHL_CONFIG.privateToken) missingKeys.push('GHL_PRIVATE_TOKEN');
  if (!GHL_CONFIG.companyId) missingKeys.push('GHL_COMPANY_ID');
  // Snapshot ID is required for the full automation flow of creating subaccounts
  if (!GHL_CONFIG.snapshotId) missingKeys.push('GHL_SNAPSHOT_ID');

  if (missingKeys.length > 0) {
    console.error(`❌ CRITICAL ERROR: Missing Environment Variables: ${missingKeys.join(', ')}`);
    console.error('Please ensure your .env file is configured correctly.');
    return false;
  }
  
  return true;
};
