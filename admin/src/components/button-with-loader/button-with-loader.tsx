import { Loader } from '../loader/loader';
import { Button } from '../ui/button';

type LoaderProps = React.ComponentProps<'button'> & {
  text: string;
  isLoading: boolean;
};

export function ButtonWithLoader({ isLoading, text, ...props }: LoaderProps) {
  return (
    <Button className="w-24" {...props}>
      {isLoading ? <Loader /> : text}
    </Button>
  );
}
