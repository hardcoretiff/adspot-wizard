import React from 'react';
import { ExperienceLevel } from '../../types';
import { GraduationCap, Lightbulb, Rocket } from 'lucide-react';

interface ExperienceStepProps {
  selectedLevel: ExperienceLevel;
  onSelect: (level: ExperienceLevel) => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ selectedLevel, onSelect }) => {
  const options = [
    {
      id: ExperienceLevel.NONE,
      title: 'No',
      description: "I'm new to advertising. Guide me step-by-step.",
      icon: <Lightbulb size={32} />,
    },
    {
      id: ExperienceLevel.SOME,
      title: 'Not Sure',
      description: "I've dabbled a bit. I might need some tips.",
      icon: <GraduationCap size={32} />,
    },
    {
      id: ExperienceLevel.EXPERT,
      title: 'Yes',
      description: "I'm a pro. Skip the tutorials and let me build.",
      icon: <Rocket size={32} />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Have you created an ad campaign before?</h2>
        <p className="text-gray-400">We'll tailor the experience to your knowledge level.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`flex flex-col items-center p-8 rounded-xl border-2 transition-all duration-300 text-center group hover:scale-105
              ${selectedLevel === option.id 
                ? 'border-red-600 bg-gradient-to-b from-red-900/20 to-transparent shadow-lg shadow-red-900/20' 
                : 'border-gray-800 bg-adspot-darkGray hover:border-gray-600'
              }`}
          >
            <div className={`mb-6 p-4 rounded-full ${selectedLevel === option.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 group-hover:text-white group-hover:bg-gray-700'}`}>
              {option.icon}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${selectedLevel === option.id ? 'text-white' : 'text-gray-200'}`}>
              {option.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExperienceStep;