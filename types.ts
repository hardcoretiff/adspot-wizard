
export enum ExperienceLevel {
  NONE = 'none',
  SOME = 'some',
  EXPERT = 'expert'
}

export interface BrandProfile {
  companyName: string;
  websiteUrl: string;
  brandVoice: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl: string | null; // Mocking file upload as string URL or base64
  brandGuidelinesUrl?: string | null; // New: URL for uploaded brand guidelines doc
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface CampaignData {
  // Step 1
  experienceLevel: ExperienceLevel;
  
  // Step 2
  campaignName: string;
  campaignGoal: string;
  businessType: string;
  
  // Step 3 (New)
  brand: BrandProfile;
  
  // Step 4
  headline: string;
  bodyText: string;
  callToAction: string;
  destinationUrl: string;

  // Step 5 - Tracking
  retargetingPixelId: string;
  heatmapId: string;
  
  // Step 6 - Plan
  subscriptionTier: 'mini' | 'scale' | 'max' | null;
  billingCycle: 'monthly' | 'annual';
  stripePriceId?: string; // New: Stores the ID of the selected stripe price
}

export const initialCampaignData: CampaignData = {
  experienceLevel: ExperienceLevel.NONE,
  campaignName: '',
  campaignGoal: '',
  businessType: '',
  brand: {
    companyName: '',
    websiteUrl: '',
    brandVoice: '',
    primaryColor: '#FF0000',
    secondaryColor: '#000000',
    fontFamily: 'Inter',
    logoUrl: null,
    brandGuidelinesUrl: null,
    socialLinks: {}
  },
  headline: '',
  bodyText: '',
  callToAction: 'Learn More',
  destinationUrl: '',
  retargetingPixelId: 'ADS-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  heatmapId: 'HM-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  subscriptionTier: null,
  billingCycle: 'monthly'
};
