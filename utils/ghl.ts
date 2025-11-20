
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
  updateStep: (id: string, status: 'loading' | 'completed') => void
) => {
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
 * BACKEND IMPLEMENTATION REFERENCE (Node.js)
 * ==================================================================
 * 
 * COPY THIS LOGIC TO YOUR BACKEND SERVER (e.g., Express/Node.js).
 * This code cannot run in the browser due to CORS and Security.
 * 
 * REQUIRED API SCOPES (Private Integration):
 * -----------------------------------------------------------
 * | CODE SCOPE ID      | UI CHECKBOX NAME (In GHL Settings) |
 * |--------------------|------------------------------------|
 * | locations.write    | Locations (Read-Write)             |
 * | snapshots.readonly | Snapshots (Read-Only)              |
 * | contacts.write     | Contacts (Read-Write) [MISSING!]   |
 * | medias.write       | Media Library (Read-Write) [MISSING!]|
 * | objects.write      | Custom Objects (Read-Write) [MISSING!]|
 * -----------------------------------------------------------
 * NOTE: You MUST check the boxes for Contacts, Media, and Custom Objects
 * or the API will fail to save user data.
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
  
  // Headers for V2 API
  private getHeaders() {
    return {
      'Authorization': `Bearer ${GHL_CONFIG.privateToken}`,
      'Version': '2021-07-28',
      'Content-Type': 'application/json'
    };
  }

  // STEP 1: Create the Sub-Account
  // Uses the Snapshot ID to create a pre-configured workspace.
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
  // Note: We must pass the locationId so the file goes to the correct library.
  async uploadLogo(locationId: string, fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      console.log(`Uploading logo to location ${locationId}...`);
      
      const form = new FormData();
      form.append('file', fileBuffer, fileName);
      form.append('hosted', 'true'); 
      form.append('locationId', locationId); // Crucial for V2 API

      const headers = {
        'Authorization': `Bearer ${GHL_CONFIG.privateToken}`,
        'Version': '2021-07-28',
        ...form.getHeaders()
      };

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
          brand_logo_url: logoUrl, // Ensure you create this field in GHL!
          brand_voice: campaign.brand.brandVoice,
          primary_color: campaign.brand.primaryColor,
          
          // Tracking
          retargeting_pixel_id: campaign.retargetingPixelId,
          heatmap_id: campaign.heatmapId,
          
          // Stripe Price ID (Keeping this here for reference)
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
