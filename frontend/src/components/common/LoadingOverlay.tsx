import React from 'react';
import { ProgressSteps, Step } from './ProgressSteps';

interface LoadingOverlayProps {
  isVisible: boolean;
  steps: Step[];
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, steps }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
        <h3 className="text-2xl font-bold text-center mb-8 text-[#111111]">Hang tight!</h3>
        <ProgressSteps steps={steps} />
      </div>
    </div>
  );
};
