import { CampaignData } from '../types';

export interface AutomationStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
}

export const initialAutomationSteps: AutomationStep[] = [
  { id: 'payment', label: 'Processing Secure Payment', status: 'pending' },
  { id: 'subaccount', label: 'Creating AdSpot 2.0 Workspace', status: 'pending' },
  { id: 'assets', label: 'Uploading Brand Assets & Logo', status: 'pending' },
  { id: 'contact', label: 'Syncing User Profile', status: 'pending' },
  { id: 'campaign', label: 'Configuring Campaign Data & Pixels', status: 'pending' },
  { id: 'finalize', label: 'Activating Account & Sending Welcome Email', status: 'pending' },
];

/**
 * ==================================================================
 * FRONTEND SIMULATION (Client-Side Only)
 * ==================================================================
 * This runs in the browser to demonstrate the UX.
 */
export const runAutomationSimulation = async (
  campaignData: CampaignData,
  updateStep: (id: string, status: 'loading' | 'completed') => void,
) => {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // 1. Payment
  updateStep('payment', 'loading');
  await delay(1500);
  updateStep('payment', 'completed');

  // 2. Create Subaccount
  updateStep('subaccount', 'loading');
  await delay(2500); // Simulating GHL Snapshot copy time
  updateStep('subaccount', 'completed');

  // 3. Upload Assets
  if (campaignData.brand.logoUrl) {
    updateStep('assets', 'loading');
    await delay(2000); // Simulating Media API upload
    updateStep('assets', 'completed');
  } else {
    updateStep('assets', 'completed');
  }

  // 4. Create Contact
  updateStep('contact', 'loading');
  await delay(1000);
  updateStep('contact', 'completed');

  // 5. Custom Object (Campaign)
  updateStep('campaign', 'loading');
  await delay(1500);
  updateStep('campaign', 'completed');

  // 6. Finalize
  updateStep('finalize', 'loading');
  await delay(1000);
  updateStep('finalize', 'completed');
};

/**
 * ==================================================================
 * 🔐 FINAL STEP: GENERATE ACCESS TOKEN
 * ==================================================================
 *
 * You have the Client ID, Client Secret, and Auth Code.
 *
 * --- WINDOWS POWERSHELL COMMAND (Use this one!) ---
 * curl.exe -X POST "https://services.leadconnectorhq.com/oauth/token" -H "Content-Type: application/x-www-form-urlencoded" -d "client_id=69217749b497429cefe810f7-mib56whj" -d "client_secret=fe647298-c78a-468f-bc06-c0495d363b55" -d "grant_type=authorization_code" -d "code=PASTE_NEW_CODE_HERE"
 *
 * --- MAC / LINUX COMMAND ---
 * curl -X POST https://services.leadconnectorhq.com/oauth/token \
 *   -H "Content-Type: application/x-www-form-urlencoded" \
 *   -d "client_id=69217749b497429cefe810f7-mib56whj" \
 *   -d "client_secret=fe647298-c78a-468f-bc06-c0495d363b55" \
 *   -d "grant_type=authorization_code" \
 *   -d "code=PASTE_NEW_CODE_HERE"
 *
 * Then paste the "access_token" into your .env file.
 */

/*
// ------------------------------------------------------------------
// START OF BACKEND REFERENCE CODE
// ------------------------------------------------------------------

import { GHL_CONFIG } from '../backend/config';
import FormData from 'form-data'; // npm install form-data
import fetch from 'node-fetch';   // npm install node-fetch

// Types for the User Input passed from frontend
interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
}

class GHLService {
  private baseUrl = 'https://services.leadconnectorhq.com';
  
  // OAUTH HEADER
  private getHeaders() {
    // 1. Prefer OAuth Token if available (Marketplace App)
    if (GHL_CONFIG.accessToken) {
      return {
        'Authorization': `Bearer ${GHL_CONFIG.accessToken}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      };
    }
    
    // 2. Fallback to Legacy API Key if available (God Mode)
    if (GHL_CONFIG.apiKey) {
      return {
        'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      };
    }

    console.error("❌ CRITICAL: No Auth Token found in .env");
    throw new Error("Authentication Failed: Missing GHL_ACCESS_TOKEN or GHL_API_KEY");
  }

  // STEP 1: Create the Sub-Account
  async createSubAccount(userData: UserData, tier: 'mini' | 'scale' | 'max'): Promise<string> {
    try {
      console.log(`Creating Subaccount for ${userData.email}...`);
      
      // Select snapshot based on Tier
      let snapshotId = GHL_CONFIG.snapshotTierMini;
      if (tier === 'scale') snapshotId = GHL_CONFIG.snapshotTierScale;
      if (tier === 'max') snapshotId = GHL_CONFIG.snapshotTierMax;

      const payload = {
        companyId: GHL_CONFIG.companyId,
        name: userData.companyName || `AdSpot Client - ${userData.email}`,
        email: userData.email,
        phone: userData.phone,
        address: userData.address || '123 AdSpot Way',
        city: userData.city || 'Digital City',
        state: userData.state || 'CA',
        country: 'US',
        timezone: 'US/Pacific',
        snapshotId: snapshotId // Loads the Tier-Specific Template
      };

      const response = await fetch(`${this.baseUrl}/locations/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL Subaccount Creation Failed: ${response.status} - ${errorText}`);
      }

      const data: any = await response.json();
      const locationId = data.id || data.location?.id;
      
      if (!locationId) throw new Error("No Location ID returned from GHL");
      
      return locationId;
    } catch (error) {
      console.error('GHL createSubAccount Error:', error);
      throw error;
    }
  }

  // STEP 2: Upload Logo to the NEW Sub-Account
  async uploadLogo(locationId: string, fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      console.log(`Uploading logo to location ${locationId}...`);
      
      const form = new FormData();
      form.append('file', fileBuffer, fileName);
      form.append('hosted', 'true'); 
      form.append('locationId', locationId); // Crucial for V2 API

      const headers = {
        ...this.getHeaders(),
        ...form.getHeaders()
      };
      delete headers['Content-Type']; // Let form-data set the multipart boundary

      const response = await fetch(`${this.baseUrl}/medias/upload-file`, {
        method: 'POST',
        headers: headers,
        body: form
      });

      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`GHL Logo Upload Failed: ${response.status} - ${errorText}`);
      }

      const data: any = await response.json();
      return data.fileUrl || data.url;
    } catch (error) {
      console.error('GHL uploadLogo Error:', error);
      return ''; 
    }
  }

  // STEP 3: Create Contact in the NEW Sub-Account
  async createContact(locationId: string, userData: UserData, campaignData: CampaignData): Promise<string> {
    try {
      // Calculate Impressions Balance based on Tier
      let impressionsBalance = 10000; // Default Mini
      if (campaignData.subscriptionTier === 'scale') impressionsBalance = 25000;
      if (campaignData.subscriptionTier === 'max') impressionsBalance = 100000;

      const payload = {
        locationId: locationId, // Ensures contact is created in the correct subaccount
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        tags: ['adspot-onboarding', 'owner', 'subscription-active'],
        source: 'AdSpot Wizard',
        customFields: [
            { key: 'subscription_tier', value: campaignData.subscriptionTier },
            { key: 'billing_cycle', value: campaignData.billingCycle },
            { key: 'impressions_balance', value: impressionsBalance }
        ]
      };

      const response = await fetch(`${this.baseUrl}/contacts/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`GHL Contact Creation Failed: ${response.status} - ${errorText}`);
      }

      const data: any = await response.json();
      return data.contact?.id || data.id;
    } catch (error) {
      console.error('GHL createContact Error:', error);
      throw error;
    }
  }

  // STEP 4: Create Campaign Custom Object Record
  async createCampaignObject(locationId: string, contactId: string, campaign: CampaignData, logoUrl: string) {
    try {
      const payload = {
        locationId: locationId,
        objectKey: 'campaign', 
        properties: {
          campaign_name: campaign.campaignName,
          campaign_goal: campaign.campaignGoal,
          business_type: campaign.businessType,
          experience_level: campaign.experienceLevel,
          
          // Creative
          headline: campaign.headline,
          body_text: campaign.bodyText,
          cta: campaign.callToAction,
          destination_url: campaign.destinationUrl,
          
          // Brand
          brand_logo_url: logoUrl, // Valid because we created this field
          brand_voice: campaign.brand.brandVoice,
          primary_color: campaign.brand.primaryColor,
          
          // Tracking
          retargeting_pixel_id: campaign.retargetingPixelId,
          heatmap_id: campaign.heatmapId,
          
          // Stripe Price ID
          stripe_price_id: campaign.stripePriceId
        },
        associations: {
          contacts: [contactId]
        }
      };

      const response = await fetch(`${this.baseUrl}/objects/records`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
         const errorText = await response.text();
         console.error(`GHL Custom Object Failed: ${response.status} - ${errorText}`);
         return null;
      }

      return await response.json();
    } catch (error) {
      console.error('GHL createCampaignObject Error:', error);
      throw error;
    }
  }

  // MAIN EXECUTOR FUNCTION
  async executeOnboardingWorkflow(userData: UserData, campaignData: CampaignData, logoFile?: { buffer: Buffer, name: string }) {
    console.log("🚀 Starting AdSpot Automation Workflow...");
    
    // 1. Create Subaccount
    const tier = campaignData.subscriptionTier || 'mini';
    const locationId = await this.createSubAccount(userData, tier);
    console.log(`✅ Subaccount Created: ${locationId}`);

    // 2. Upload Logo (if provided)
    let logoUrl = "";
    if (logoFile) {
      logoUrl = await this.uploadLogo(locationId, logoFile.buffer, logoFile.name);
      console.log(`✅ Logo Uploaded: ${logoUrl}`);
    }

    // 3. Create Contact (Now includes Tier/Balance data)
    const contactId = await this.createContact(locationId, userData, campaignData);
    console.log(`✅ Contact Created: ${contactId}`);

    // 4. Create Campaign Record
    await this.createCampaignObject(locationId, contactId, campaignData, logoUrl);
    console.log(`✅ Campaign Data Synced`);

    return { success: true, locationId, contactId };
  }
}
*/
