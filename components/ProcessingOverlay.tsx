import React from 'react';
import { Check, Loader2, Server, Shield, User, Rocket, Database, CreditCard } from 'lucide-react';
import { AutomationStep } from '../utils/ghl';

interface ProcessingOverlayProps {
  isOpen: boolean;
  steps: AutomationStep[];
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ isOpen, steps }) => {
  if (!isOpen) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case 'payment':
        return <CreditCard size={18} />;
      case 'subaccount':
        return <Server size={18} />;
      case 'assets':
        return <Shield size={18} />;
      case 'contact':
        return <User size={18} />;
      case 'campaign':
        return <Database size={18} />;
      case 'finalize':
        return <Rocket size={18} />;
      default:
        return <Check size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-adspot-darkGray border border-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl shadow-black relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-75"></div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Setting Up AdSpot 2.0</h3>
          <p className="text-gray-400 text-sm">Please wait while we configure your workspace...</p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => {
            const isLoading = step.status === 'loading';
            const isLoading = step.status === 'loading';
            const isCompleted = step.status === 'completed';

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-500
                  ${
                    isCompleted
                      ? 'bg-green-900/10 border-green-900/30'
                      : isLoading
                        ? 'bg-red-900/10 border-red-900/30'
                        : 'bg-transparent border-transparent opacity-50'
                  }
                `}
              >
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                  ${isCompleted ? 'bg-green-500 text-black' : isLoading ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500'}
                `}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={3} />
                  ) : isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    getIcon(step.id)
                  )}
                </div>

                <span
                  className={`font-medium text-sm transition-colors ${isCompleted ? 'text-green-100' : isLoading ? 'text-white' : 'text-gray-500'}`}
                >
                  {step.label}
                </span>

                {isCompleted && (
                  <span className="ml-auto text-xs font-bold text-green-500 animate-in zoom-in duration-300">
                    DONE
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 font-mono">
            Secure connection established with GoHighLevel API
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
