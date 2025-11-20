import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  children: React.ReactNode;
}

const StepWizard: React.FC<StepWizardProps> = ({ currentStep, totalSteps, stepTitles, children }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-adspot-gray -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-red-600 transition-all duration-500 -z-10"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>

          {stepTitles.map((title, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={index} className="flex flex-col items-center bg-adspot-black px-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 
                    ${isActive ? 'border-red-600 bg-black text-red-600' : 
                      isCompleted ? 'border-red-600 bg-red-600 text-white' : 
                      'border-gray-600 bg-black text-gray-600'}`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <span className="text-sm font-bold">{stepNum}</span>}
                </div>
                <span className={`mt-2 text-xs font-medium uppercase tracking-wider ${isActive || isCompleted ? 'text-white' : 'text-gray-600'}`}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-adspot-gray rounded-xl p-6 md:p-10 shadow-2xl border border-neutral-800 min-h-[400px]">
        {children}
      </div>
    </div>
  );
};

export default StepWizard;