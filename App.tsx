import React, { useState } from 'react';
import Header from './components/Header';
import StepWizard from './components/StepWizard';
import Sidebar from './components/Sidebar';
import ExperienceStep from './components/steps/ExperienceStep';
import GoalsStep from './components/steps/GoalsStep';
import BrandStep from './components/steps/BrandStep';
import ContentStep from './components/steps/ContentStep';
import TrackingStep from './components/steps/TrackingStep';
import SubscriptionTier from './components/SubscriptionTier';
import ProcessingOverlay from './components/ProcessingOverlay';
import SuccessView from './components/SuccessView'; // Import Success View
import { CampaignData, initialCampaignData, BrandProfile } from './types';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { runAutomationSimulation, initialAutomationSteps, AutomationStep } from './utils/ghl';

// Configuration for Stripe Price IDs
const STRIPE_PLANS = {
  mini: {
    monthly: 'price_mini_monthly_id', // Replace with actual Stripe Price ID
    annual: 'price_mini_annual_id',
  },
  scale: {
    monthly: 'price_scale_monthly_id',
    annual: 'price_scale_annual_id',
  },
  max: {
    monthly: 'price_max_monthly_id',
    annual: 'price_max_annual_id',
  },
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>(initialCampaignData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New State for Success View
  const [automationSteps, setAutomationSteps] = useState<AutomationStep[]>(initialAutomationSteps);
  const [showOverlay, setShowOverlay] = useState(false);

  // Subscription state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedTier, setSelectedTier] = useState<'mini' | 'scale' | 'max' | null>(null);

  const steps = [
    'Experience',
    'Goals',
    'Brand Identity', // New Step
    'Ad Creative', // Was Content
    'Tracking', // New Tracking Step
    'Subscription',
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateField = (field: string, value: unknown) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }));
  };

  const updateBrandField = (field: keyof BrandProfile, value: unknown) => {
    setCampaignData((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value,
      },
    }));
  };

  const handlePayment = async () => {
    if (!selectedTier) return;

    setIsSubmitting(true);
    setShowOverlay(true);

    // Determine the stripe ID based on selection
    const stripePriceId = STRIPE_PLANS[selectedTier][billingCycle];

    // Ensure tier, billing cycle and stripe ID are saved
    const finalData = {
      ...campaignData,
      subscriptionTier: selectedTier,
      billingCycle: billingCycle,
      stripePriceId: stripePriceId,
    };

    // Helper to update step status in UI
    const updateStepStatus = (id: string, status: 'loading' | 'completed') => {
      setAutomationSteps((prev) =>
        prev.map((step) => (step.id === id ? { ...step, status } : step)),
      );
    };

    try {
      // 1. Run the Visual Simulation (UX)
      // We run this to show the user progress while the backend works
      const simulationPromise = runAutomationSimulation(finalData, updateStepStatus);

      // 2. Run the REAL Backend Process
      // We assume user data is mock for now, but in real app this comes from auth/form
      const userData = {
        email: 'demo.user@example.com',
        firstName: 'Demo',
        lastName: 'User',
        companyName: finalData.brand.companyName || 'New Agency Client',
        phone: '+15550000000',
      };

      const backendPromise = fetch('http://localhost:3001/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignData: finalData, userData }),
      });

      // Wait for both visuals and reality to finish
      await Promise.all([simulationPromise, backendPromise]);

      // Success handling
      setTimeout(() => {
        setIsSubmitting(false);
        setShowOverlay(false);
        setIsSuccess(true); // Switch to Success View
      }, 1000);
    } catch (error) {
      console.error('Automation failed', error);
      setIsSubmitting(false);
      setShowOverlay(false);
      alert('An error occurred during setup. Check backend console.');
    }
  };

  const handleDashboardRedirect = () => {
    // Redirect to the production dashboard URL
    window.location.href = 'https://app.adspot.co';
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Header now controls the Sidebar */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <main className="pb-24">
        {isSuccess ? (
          <SuccessView onGoToDashboard={handleDashboardRedirect} />
        ) : (
          <StepWizard currentStep={currentStep} totalSteps={steps.length} stepTitles={steps}>
            {currentStep === 1 && (
              <ExperienceStep
                selectedLevel={campaignData.experienceLevel}
                onSelect={(level) => {
                  updateField('experienceLevel', level);
                  handleNext();
                }}
              />
            )}

            {currentStep === 2 && (
              <GoalsStep
                campaignName={campaignData.campaignName}
                campaignGoal={campaignData.campaignGoal}
                businessType={campaignData.businessType}
                onChange={updateField}
              />
            )}

            {currentStep === 3 && (
              <BrandStep data={campaignData.brand} updateData={updateBrandField} />
            )}

            {currentStep === 4 && <ContentStep data={campaignData} onChange={updateField} />}

            {currentStep === 5 && (
              <TrackingStep
                pixelId={campaignData.retargetingPixelId}
                heatmapId={campaignData.heatmapId}
              />
            )}

            {currentStep === 6 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-white mb-4">Select Your Plan</h2>
                  <p className="text-gray-400 mb-8">
                    Choose the package that fits your growth goals.
                  </p>

                  {/* Billing Toggle */}
                  <div className="inline-flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setBillingCycle('monthly')}
                    >
                      Monthly
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'annual' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setBillingCycle('annual')}
                    >
                      Annual (Save ~20%)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SubscriptionTier
                    title="Mini Max Plan"
                    monthlyPrice={300}
                    annualPrice={2999}
                    impressions={10000}
                    features={[
                      '75 Contacts',
                      '1 User',
                      'Web Chat & FB Messenger',
                      'Reputation Management',
                      'Text To Pay',
                      'Launchpad & Social Planner',
                      'Calendar & CRM',
                      'Opportunities',
                      'All Reporting',
                      'QR Codes',
                    ]}
                    billingCycle={billingCycle}
                    onSelect={() => setSelectedTier('mini')}
                    isSelected={selectedTier === 'mini'}
                  />
                  <SubscriptionTier
                    title="Scale + Grow Plan"
                    monthlyPrice={625}
                    annualPrice={6999}
                    impressions={25000}
                    features={[
                      'Everything in Mini, plus:',
                      'Unlimited Contacts',
                      '2 Users',
                      'Google/Meta AD Management',
                      'Email Marketing & Workflows',
                      '2 Way Text & Email Conversation',
                      'GMB Messaging & Call Tracking',
                      'Missed Call Text Back',
                      'Documents & Contracts',
                      'Tons of Marketing Templates',
                    ]}
                    isPopular
                    billingCycle={billingCycle}
                    onSelect={() => setSelectedTier('scale')}
                    isSelected={selectedTier === 'scale'}
                  />
                  <SubscriptionTier
                    title="Maximum Exposure"
                    monthlyPrice={2299}
                    annualPrice={19999}
                    impressions={100000}
                    features={[
                      'Everything in Scale, plus:',
                      'AI Agent Studio',
                      'Funnels & Websites',
                      'Memberships & Communities',
                      'Blogs & Affiliate Manager',
                      'Forms & Surveys',
                      'Trigger Links',
                      'SMS & Email Templates',
                      'GoKollab & Quizzes',
                    ]}
                    billingCycle={billingCycle}
                    onSelect={() => setSelectedTier('max')}
                    isSelected={selectedTier === 'max'}
                  />
                </div>
              </div>
            )}
          </StepWizard>
        )}
      </main>

      {/* Footer Navigation - Hide if Success View is active */}
      {!isSuccess && (
        <div className="fixed bottom-0 left-0 w-full bg-adspot-black border-t border-neutral-800 p-4 z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${
                  currentStep === 1
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-neutral-900'
                }`}
            >
              <ArrowLeft size={18} /> Back
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={handlePayment}
                disabled={!selectedTier || isSubmitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all shadow-lg
                  ${
                    !selectedTier || isSubmitting
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 hover:scale-105 shadow-red-900/30'
                  }`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Proceed to Payment'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-all hover:scale-105"
              >
                Next Step <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <ProcessingOverlay isOpen={showOverlay} steps={automationSteps} />
    </div>
  );
};

export default App;
