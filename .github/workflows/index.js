import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import FormData from 'form-data';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Configuration
const GHL_CONFIG = {
  accessToken: process.env.GHL_ACCESS_TOKEN,
  apiKey: process.env.GHL_API_KEY,
  companyId: process.env.GHL_COMPANY_ID,
  snapshotTierMini: process.env.SNAPSHOT_TIER_MINI,
  snapshotTierScale: process.env.SNAPSHOT_TIER_SCALE,
  snapshotTierMax: process.env.SNAPSHOT_TIER_MAX,
};

// Helper to get headers
const getHeaders = () => {
  if (GHL_CONFIG.accessToken) {
    return {
      Authorization: `Bearer ${GHL_CONFIG.accessToken}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
    };
  }
  if (GHL_CONFIG.apiKey) {
    return {
      Authorization: `Bearer ${GHL_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    };
  }
  console.error('❌ ERROR: No GHL Auth Token found in environment variables');
  throw new Error('Missing Auth Token');
};

// --- GHL API FUNCTIONS ---

const createSubAccount = async (userData, tier) => {
  console.log(`Creating Subaccount for ${userData.email}...`);

  let snapshotId = GHL_CONFIG.snapshotTierMini;
  if (tier === 'scale') snapshotId = GHL_CONFIG.snapshotTierScale;
  if (tier === 'max') snapshotId = GHL_CONFIG.snapshotTierMax;

  if (!snapshotId) {
    console.error(`❌ MISSING SNAPSHOT ID for tier: ${tier}`);
    throw new Error(`Missing Snapshot ID for ${tier}`);
  }

  const payload = {
    companyId: GHL_CONFIG.companyId,
    name: userData.companyName || `AdSpot Client - ${userData.email}`,
    email: userData.email,
    phone: userData.phone,
    address: '123 AdSpot Way',
    city: 'Digital City',
    state: 'CA',
    country: 'US',
    timezone: 'US/Pacific',
    snapshotId: snapshotId,
  };

  const response = await fetch('https://services.leadconnectorhq.com/locations/', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const txt = await response.text();
    console.error(`❌ GHL Create Subaccount Failed: ${txt}`);
    throw new Error(`Subaccount Failed: ${txt}`);
  }

  const data = await response.json();
  return data.id || data.location?.id;
};

const uploadLogo = async (locationId, base64String) => {
  try {
    console.log(`Uploading logo to ${locationId}...`);

    // Remove header if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const form = new FormData();
    form.append('file', buffer, 'logo.png');
    form.append('hosted', 'true');
    form.append('locationId', locationId);

    const headers = { ...getHeaders(), ...form.getHeaders() };
    delete headers['Content-Type'];

    const response = await fetch('https://services.leadconnectorhq.com/medias/upload-file', {
      method: 'POST',
      headers: headers,
      body: form,
    });

    if (!response.ok) throw new Error('Upload Failed');
    const data = await response.json();
    return data.fileUrl || data.url;
  } catch (e) {
    console.error('⚠️ Logo upload failed (non-critical):', e.message);
    return '';
  }
};

const createContact = async (locationId, userData, campaignData) => {
  console.log(`Creating Contact in ${locationId}...`);

  let balance = 10000;
  if (campaignData.subscriptionTier === 'scale') balance = 25000;
  if (campaignData.subscriptionTier === 'max') balance = 100000;

  const payload = {
    locationId,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    tags: ['adspot-onboarding', 'owner'],
    source: 'AdSpot Wizard',
    customFields: [
      { key: 'subscription_tier', value: campaignData.subscriptionTier },
      { key: 'billing_cycle', value: campaignData.billingCycle },
      { key: 'impressions_balance', value: balance },
    ],
  };

  const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data.contact?.id || data.id;
};

const createCampaignObject = async (locationId, contactId, campaign, logoUrl) => {
  console.log(`Creating Campaign Object...`);

  const payload = {
    locationId,
    objectKey: 'campaign',
    properties: {
      campaign_name: campaign.campaignName,
      campaign_goal: campaign.campaignGoal,
      business_type: campaign.businessType,
      experience_level: campaign.experienceLevel,
      headline: campaign.headline,
      body_text: campaign.bodyText,
      cta: campaign.callToAction,
      destination_url: campaign.destinationUrl,
      brand_logo_url: logoUrl,
      brand_voice: campaign.brand.brandVoice,
      primary_color: campaign.brand.primaryColor,
      retargeting_pixel_id: campaign.retargetingPixelId,
      heatmap_id: campaign.heatmapId,
      stripe_price_id: campaign.stripePriceId,
    },
    associations: {
      contacts: [contactId],
    },
  };

  await fetch('https://services.leadconnectorhq.com/objects/records', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
};

// --- ROUTES ---

app.post('/api/onboard', async (req, res) => {
  try {
    console.log('🚀 Received Onboarding Request');
    const { campaignData, userData } = req.body;

    if (!campaignData || !userData) {
      throw new Error('Missing campaign or user data');
    }

    // 1. Create Subaccount
    const locationId = await createSubAccount(userData, campaignData.subscriptionTier);
    console.log(`✅ Subaccount Created: ${locationId}`);

    // 2. Upload Logo
    let logoUrl = '';
    if (campaignData.brand?.logoUrl) {
      logoUrl = await uploadLogo(locationId, campaignData.brand.logoUrl);
    }

    // 3. Create Contact
    const contactId = await createContact(locationId, userData, campaignData);
    console.log(`✅ Contact Created: ${contactId}`);

    // 4. Create Campaign
    await createCampaignObject(locationId, contactId, campaignData, logoUrl);
    console.log(`✅ Campaign Object Created`);

    res.json({ success: true, locationId });
  } catch (error) {
    console.error('❌ Backend Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('AdSpot Backend is running v3 (Native Fetch)');
});

app.listen(PORT, () => {
  console.log(`✅ AdSpot Backend running on port ${PORT}`);
  console.log(`Environment Check:`);
  console.log(`- GHL_ACCESS_TOKEN: ${GHL_CONFIG.accessToken ? 'OK' : 'MISSING'}`);
  console.log(`- SNAPSHOT_MINI: ${GHL_CONFIG.snapshotTierMini ? 'OK' : 'MISSING'}`);
});
