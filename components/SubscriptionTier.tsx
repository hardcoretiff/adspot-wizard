import React from 'react';
import { Check } from 'lucide-react';

interface SubscriptionTierProps {
  title: string;
  monthlyPrice: number;
  annualPrice: number;
  impressions: number;
  features: string[];
  isPopular?: boolean;
  billingCycle: 'monthly' | 'annual';
  onSelect: () => void;
  isSelected: boolean;
}

const SubscriptionTier: React.FC<SubscriptionTierProps> = ({
  title,
  monthlyPrice,
  annualPrice,
  impressions,
  features,
  isPopular,
  billingCycle,
  onSelect,
  isSelected,
}) => {
  const price = billingCycle === 'monthly' ? monthlyPrice : annualPrice;

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 flex flex-col
        ${
          isSelected
            ? 'bg-zinc-900 border-red-600 transform scale-[1.02] shadow-2xl shadow-red-900/20'
            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'
        }
      `}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">${price.toLocaleString()}</span>
          <span className="text-sm text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
        <div className="mt-2 text-sm font-medium text-red-400">
          {impressions.toLocaleString()} Impressions
        </div>
      </div>

      <div className="space-y-3 flex-1 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-300 leading-tight">{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`w-full py-2 rounded-lg font-bold text-sm transition-colors
          ${
            isSelected
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
          }`}
      >
        {isSelected ? 'Selected' : 'Select Plan'}
      </button>
    </div>
  );
};

export default SubscriptionTier;
