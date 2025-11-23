import React from 'react';
import { BrandProfile } from '../../types';
import { Upload, Type, Palette, Globe, Briefcase } from 'lucide-react';

interface BrandStepProps {
  data: BrandProfile;
  updateData: (field: keyof BrandProfile, value: unknown) => void;
}

const BrandStep: React.FC<BrandStepProps> = ({ data, updateData }) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to Base64 for server upload
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result contains the Base64 string (data:image/png;base64,...)
        updateData('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Brand Identity</h2>
        <p className="text-gray-400">
          Upload your assets to personalize your campaign and sync with your AdSpot profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Core Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Briefcase size={16} /> Company Name
            </label>
            <input
              type="text"
              className="w-full bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Acme Corp"
              value={data.companyName}
              onChange={(e) => updateData('companyName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Globe size={16} /> Website URL
            </label>
            <input
              type="url"
              className="w-full bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
              placeholder="https://..."
              value={data.websiteUrl}
              onChange={(e) => updateData('websiteUrl', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Type size={16} /> Brand Voice & Tone
            </label>
            <textarea
              className="w-full h-32 bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe your brand voice (e.g. Professional, Witty, Urgent, Friendly). This helps us tailor your future ad copy."
              value={data.brandVoice}
              onChange={(e) => updateData('brandVoice', e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Visual Assets */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Upload size={16} /> Brand Logo
            </label>
            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all ${data.logoUrl ? 'border-red-600 bg-red-900/10' : 'border-gray-700 hover:border-gray-500 bg-adspot-darkGray'}`}
              >
                {data.logoUrl ? (
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <img
                      src={data.logoUrl}
                      alt="Brand Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      <span className="text-white text-sm font-medium">Click to replace</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 text-gray-400 group-hover:text-white transition-colors">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Palette size={16} /> Primary Color
              </label>
              <div className="flex items-center gap-2 bg-adspot-darkGray p-2 rounded-lg border border-gray-700">
                <input
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) => updateData('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                />
                <span className="text-sm text-gray-400 font-mono">{data.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-2 bg-adspot-darkGray p-2 rounded-lg border border-gray-700">
                <input
                  type="color"
                  value={data.secondaryColor}
                  onChange={(e) => updateData('secondaryColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                />
                <span className="text-sm text-gray-400 font-mono">{data.secondaryColor}</span>
              </div>
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Type size={16} /> Font Preference
            </label>
            <select
              className="w-full bg-adspot-darkGray border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all appearance-none"
              value={data.fontFamily}
              onChange={(e) => updateData('fontFamily', e.target.value)}
            >
              <option value="Inter">Inter (Modern Sans)</option>
              <option value="Roboto">Roboto (Neutral)</option>
              <option value="Playfair Display">Playfair Display (Serif/Elegant)</option>
              <option value="Montserrat">Montserrat (Bold)</option>
              <option value="Open Sans">Open Sans (Friendly)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStep;
