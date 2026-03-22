import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Input } from '@/components/ui/input';
import { FormLabel } from '../form-label/form-label';

type FormInputProps = Omit<React.ComponentProps<typeof Input>, 'onChange'> & {
  label?: string;
  name: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function FormInput({
  className,
  label,
  name,
  disabled,
  type = 'text',
  value,
  required,
  onChange,
  ...props
}: FormInputProps) {
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

      <Input
        {...props}
        id={props.id || name}
        required={required}
        type={type}
        value={value}
        disabled={disabled}
        className={twMerge('w-full bg-background text-primary')}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
