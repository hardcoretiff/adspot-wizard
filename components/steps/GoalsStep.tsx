import React from 'react';
import { Target, Store } from 'lucide-react';

interface GoalsStepProps {
  campaignName: string;
  campaignGoal: string;
  businessType: string;
  onChange: (field: string, value: string) => void;
}

const GoalsStep: React.FC<GoalsStepProps> = ({
  campaignName,
  campaignGoal,
  businessType,
  onChange,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Campaign Basics</h2>
        <p className="text-gray-400">Tell us about your business and what you want to achieve.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => onChange('campaignName', e.target.value)}
            placeholder="e.g. Summer Sale 2024"
            className="w-full bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Store size={16} /> Business Type
          </label>
          <select
            value={businessType}
            onChange={(e) => onChange('businessType', e.target.value)}
            className="w-full bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all appearance-none"
          >
            <option value="" disabled>
              Select your industry
            </option>
            <option value="ecommerce">E-Commerce / Retail</option>
            <option value="services">Professional Services</option>
            <option value="saas">SaaS / Software</option>
            <option value="local">Local Business (Restaurant, Gym, etc.)</option>
            <option value="realestate">Real Estate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Target size={16} /> Campaign Goal
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Traffic', 'Sales', 'Leads', 'Brand Awareness'].map((goal) => (
              <button
                key={goal}
                onClick={() => onChange('campaignGoal', goal)}
                className={`p-4 rounded-lg border text-left transition-all
                  ${
                    campaignGoal === goal
                      ? 'border-red-600 bg-red-900/20 text-white'
                      : 'border-gray-700 bg-adspot-darkGray text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsStep;
