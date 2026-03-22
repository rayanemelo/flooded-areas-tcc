import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Textarea } from '@/components/ui/textarea';
import { FormLabel } from '../form-label/form-label';

type FormTextareaProps = Omit<
  React.ComponentProps<typeof Textarea>,
  'onChange'
> & {
  label?: string;
  name: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function FormTextarea({
  className,
  label,
  name,
  disabled,
  required,
  value,
  onChange,
  ...props
}: FormTextareaProps) {
  return (
    <div className={twMerge('flex flex-col gap-1 w-full', className)}>
      {label && (
        <FormLabel
          name={name}
          label={label}
          disabled={disabled}
          required={required}
        />
      )}

      <Textarea
        {...props}
        required={required}
        id={props.id || name}
        disabled={disabled}
        className="w-full min-h-25 text-primary"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
