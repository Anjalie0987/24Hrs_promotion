import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

export type StepState = 'idle' | 'active' | 'completed';

export interface Step {
  id: string;
  label: string;
  state: StepState;
}

interface ProgressStepsProps {
  steps: Step[];
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps }) => {
  return (
    <div className="flex flex-col space-y-4 max-w-sm mx-auto">
      {steps.map((step, index) => {
        return (
          <div key={step.id} className="flex items-center space-x-3">
            {step.state === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
            {step.state === 'active' && <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />}
            {step.state === 'idle' && <Circle className="w-6 h-6 text-gray-300" />}
            <span className={`text-lg font-medium ${
              step.state === 'active' ? 'text-blue-600' :
              step.state === 'completed' ? 'text-green-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
