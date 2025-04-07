import clsx from 'clsx';
import { type RadioProps, Radio as AriaRadio } from 'react-aria-components';

interface Props extends RadioProps {}

export default function Radio({ className, ...props }: Props) {
  return <AriaRadio {...props} className={clsx('c-radio', className)} />;
}
