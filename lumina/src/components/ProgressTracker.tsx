'use client';

import { CheckCircle, Circle } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep: number;
}

export default function ProgressTracker({ steps, currentStep }: ProgressTrackerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            {/* Step Circle */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-2
              ${index < currentStep 
                ? 'bg-primary text-primary-foreground' 
                : index === currentStep 
                ? 'bg-primary/20 text-primary border-2 border-primary' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </div>
            
            {/* Step Title */}
            <span className={`
              text-sm font-medium text-center
              ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}
            `}>
              {step.title}
            </span>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                absolute top-5 left-1/2 w-full h-0.5 -z-10
                ${index < currentStep ? 'bg-primary' : 'bg-muted'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
