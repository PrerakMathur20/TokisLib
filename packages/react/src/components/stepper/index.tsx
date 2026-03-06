import React from 'react';
import { cn } from '../../utils/cn.js';

export type StepStatus = 'completed' | 'active' | 'pending' | 'error';

export interface Step {
  label: string;
  description?: string;
  status?: StepStatus;
}

export interface StepperProps {
  steps: Step[];
  current: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function getStepStatus(step: Step, index: number, current: number): StepStatus {
  if (step.status) return step.status;
  if (index < current) return 'completed';
  if (index === current) return 'active';
  return 'pending';
}

export function Stepper({ steps, current, orientation = 'horizontal', className }: StepperProps): JSX.Element {
  return (
    <ol
      className={cn('tokis-stepper', `tokis-stepper--${orientation}`, className)}
      aria-label="Progress steps"
    >
      {steps.map((step, index) => {
        const status = getStepStatus(step, index, current);
        const isLast = index === steps.length - 1;
        return (
          <li
            key={index}
            className={cn('tokis-stepper__step', `tokis-stepper__step--${status}`)}
            aria-current={status === 'active' ? 'step' : undefined}
          >
            <div className="tokis-stepper__step-inner">
              <div className={cn('tokis-stepper__circle', `tokis-stepper__circle--${status}`)}>
                {status === 'completed' ? <CheckIcon /> : status === 'error' ? <ErrorIcon /> : <span>{index + 1}</span>}
              </div>
              <div className="tokis-stepper__text">
                <div className="tokis-stepper__label">{step.label}</div>
                {step.description && <div className="tokis-stepper__desc">{step.description}</div>}
              </div>
            </div>
            {!isLast && <div className={cn('tokis-stepper__connector', status === 'completed' && 'tokis-stepper__connector--completed')} aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

Stepper.displayName = 'Stepper';
