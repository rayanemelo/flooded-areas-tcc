import { twMerge } from 'tailwind-merge';

import { Label } from '@/components/ui/label';

type FormLabelProps = Omit<React.ComponentProps<typeof Label>, 'children'> & {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
};

export function FormLabel({
  name,
  label,
  disabled,
  required,
  ...props
}: FormLabelProps) {
  return (
    <Label
      {...props}
      htmlFor={name}
      className={twMerge(disabled && 'cursor-not-allowed opacity-50')}
    >
      {label}
      {required && <span className="text-red-500 ">*</span>}
    </Label>
  );
}
