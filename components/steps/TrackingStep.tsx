import React, { useState } from 'react';
import {
  Copy,
  Check,
  Code,
  Info,
  MousePointer2,
  Target,
  Activity,
  Eye,
  HelpCircle,
  PlayCircle,
} from 'lucide-react';

interface TrackingStepProps {
  pixelId: string;
  heatmapId: string;
}

// Helper Tooltip Component
const Tooltip: React.FC<{ content: string }> = ({ content }) => (
  <div className="group relative inline-block ml-2 align-middle z-50">
    <HelpCircle
      size={15}
      className="text-gray-500 hover:text-red-500 cursor-help transition-colors"
    />
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl shadow-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
      <p className="text-xs text-gray-300 text-center leading-relaxed">{content}</p>
      {/* Arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900"></div>
    </div>
  </div>
);

const TrackingStep: React.FC<TrackingStepProps> = ({ pixelId, heatmapId }) => {
  const [activeTab, setActiveTab] = useState<'pixel' | 'heatmap'>('pixel');
  const [copied, setCopied] = useState(false);

  const generatePixelCode = (id: string) => {
    return `<!-- AdSpot Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.adspot.co/events.js');
  adspot('init', '${id}');
  adspot('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://connect.adspot.co/tr?id=${id}&ev=PageView&noscript=1"
/></noscript>
<!-- End AdSpot Pixel Code -->`;
  };

  const generateHeatmapCode = (id: string) => {
    return `<!-- AdSpot Heatmap & Session Recording -->
<script>
  (function(h,e,a,t,m,p) {
    m=e.createElement(a);m.async=!0;m.src=t;
    p=e.getElementsByTagName(a)[0];p.parentNode.insertBefore(m,p);
  })(window,document,'script','https://cdn.adspot.co/heatmap.js');
  
  adspotHeatmap('init', '${id}');
  adspotHeatmap('config', {
    record_sessions: true,
    click_maps: true,
    scroll_maps: true
  });
</script>
<!-- End AdSpot Heatmap Code -->`;
  };

  const code = activeTab === 'pixel' ? generatePixelCode(pixelId) : generateHeatmapCode(heatmapId);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Tracking & Intelligence</h2>
          <p className="text-gray-400">
            Install your snippets to capture audience data and user behavior.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-neutral-900 p-1 rounded-lg inline-flex border border-neutral-800">
          <button
            onClick={() => setActiveTab('pixel')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all
              ${activeTab === 'pixel' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}
            `}
          >
            <Target size={16} /> Retargeting Pixel
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all
              ${activeTab === 'heatmap' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}
            `}
          >
            <Activity size={16} /> Heatmap & Sessions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Code Box - Removed overflow-hidden from parent to allow tooltip popout */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl relative">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950 rounded-t-xl">
              <div className="flex items-center gap-2 relative z-10">
                <Code size={16} className="text-red-500" />
                <span className="text-sm font-medium text-gray-300">
                  {activeTab === 'pixel'
                    ? 'Pixel Installation Script'
                    : 'Heatmap Installation Script'}
                </span>
                <Tooltip
                  content={
                    activeTab === 'pixel'
                      ? 'This JavaScript snippet fires when a page loads, connecting the visitor to your AdSpot dashboard for retargeting.'
                      : 'This script initializes the recorder with &apos;record_sessions: true&apos;, enabling full playback of user journeys along with click and scroll heatmaps.'
                  }
                />
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-neutral-800 text-xs font-medium text-gray-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Code
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto rounded-b-xl">
              <pre className="text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap">
                {code}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-5 flex gap-4">
            <Info className="text-blue-400 shrink-0 mt-1" size={20} />
            <div className="space-y-2">
              <div className="flex items-center">
                <h4 className="text-blue-100 font-medium">Installation Instructions</h4>
                <Tooltip content="The <head> section contains metadata. Placing scripts here ensures they load before the page content appears, capturing 100% of the session." />
              </div>

              <p className="text-sm text-blue-200/70 leading-relaxed">
                Copy the code above and paste it into the{' '}
                <code className="bg-blue-900/30 px-1.5 py-0.5 rounded text-blue-100 text-xs">
                  &lt;head&gt;
                </code>{' '}
                section of every page on your website.
                {activeTab === 'pixel'
                  ? ' This enables audience building for retargeting campaigns immediately.'
                  : ' This starts recording user sessions, click maps, and scroll depth data immediately.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar/Info */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <h4 className="font-bold text-white">
                {activeTab === 'pixel' ? 'Why use the Pixel?' : 'Why use Heatmaps?'}
              </h4>
              <Tooltip
                content={
                  activeTab === 'pixel'
                    ? 'Without a pixel, you can&apos;t track who visited your site or if your ads resulted in sales.'
                    : 'Heatmaps take the guesswork out of design by showing you what users actually look at.'
                }
              />
            </div>

            {activeTab === 'pixel' ? (
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-900/20 flex items-center justify-center shrink-0">
                    <span className="text-red-500 text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium block mb-1">Retarget Visitors</span>
                    Show ads to people who visited but didn&apos;t buy.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-900/20 flex items-center justify-center shrink-0">
                    <span className="text-red-500 text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium block mb-1">Track Conversions</span>
                    See exactly which ads drive sales.
                  </p>
                </li>
              </ul>
            ) : (
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-900/20 flex items-center justify-center shrink-0">
                    <PlayCircle size={14} className="text-red-500" />
                  </div>
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium block mb-1">Session Recording</span>
                    Watch real video playbacks of user visits.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-900/20 flex items-center justify-center shrink-0">
                    <MousePointer2 size={14} className="text-red-500" />
                  </div>
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium block mb-1">Click Maps</span>
                    See exactly where users are clicking.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-900/20 flex items-center justify-center shrink-0">
                    <Eye size={14} className="text-red-500" />
                  </div>
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium block mb-1">Scroll Depth</span>
                    Discover how far down the page users read.
                  </p>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingStep;
