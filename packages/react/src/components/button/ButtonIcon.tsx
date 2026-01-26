import React from 'react';

export interface ButtonIconProps {
  children?: React.ReactNode;
  /** Optional accessible label when icon is standalone */
  'aria-label'?: string;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({ children, 'aria-label': ariaLabel }) => {
  return (
    <span className="button-icon" aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel}>
      {children}
    </span>
  );
};
ButtonIcon.displayName = 'ButtonIcon';

