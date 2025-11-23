import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { CampaignData } from '../../types';

interface ContentStepProps {
  data: CampaignData;
  onChange: (field: string, value: string) => void;
}

const ContentStep: React.FC<ContentStepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Ad Creative</h2>
          <p className="text-gray-400">
            Craft your message. Need help? You can request AI assistance after subscription.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Headline</label>
            <input
              type="text"
              value={data.headline}
              onChange={(e) => onChange('headline', e.target.value)}
              placeholder="Catchy title for your ad"
              maxLength={50}
              className="w-full bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">{data.headline.length}/50</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Body Text</label>
            <textarea
              value={data.bodyText}
              onChange={(e) => onChange('bodyText', e.target.value)}
              placeholder="Explain your offer and value proposition..."
              maxLength={150}
              className="w-full h-32 bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">{data.bodyText.length}/150</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Call to Action (CTA)
              </label>
              <select
                value={data.callToAction}
                onChange={(e) => onChange('callToAction', e.target.value)}
                className="w-full bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all appearance-none"
              >
                <option>Learn More</option>
                <option>Shop Now</option>
                <option>Sign Up</option>
                <option>Get Offer</option>
                <option>Contact Us</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <LinkIcon size={14} /> Destination URL
              </label>
              <input
                type="url"
                value={data.destinationUrl}
                onChange={(e) => onChange('destinationUrl', e.target.value)}
                placeholder="https://your-site.com"
                className="w-full bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <label className="block text-sm font-medium text-gray-300 mb-3">Preview</label>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              {/* Mock Ad Image */}
              <div className="h-40 bg-gray-200 flex items-center justify-center relative">
                {data.brand.logoUrl ? (
                  <img src={data.brand.logoUrl} alt="Brand" className="h-16 object-contain" />
                ) : (
                  <span className="text-gray-400 font-bold text-2xl opacity-20">AD IMAGE</span>
                )}
                <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-500 border border-gray-300">
                  Ad
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {data.brand.logoUrl && (
                    <img src={data.brand.logoUrl} className="w-6 h-6 rounded-full object-cover" />
                  )}
                  <span className="text-xs font-bold text-gray-800">
                    {data.brand.companyName || 'Your Company'}
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                  {data.headline || 'Your Headline Here'}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {data.bodyText ||
                    'Your ad body text will appear here. Describe your product or service to entice customers.'}
                </p>

                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-500 truncate flex-1 mr-2">
                    {data.destinationUrl || 'yoursite.com'}
                  </span>
                  <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    {data.callToAction}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-center text-gray-500">
              Preview based on standard feed placement
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStep;
