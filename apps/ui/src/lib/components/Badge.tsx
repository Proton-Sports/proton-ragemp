import logoImage from '../assets/images/logo.png';

export type Variant = 'dark' | 'teal' | 'red' | 'blue';

interface Props {
  variant?: Variant;
  title: string;
  logo: boolean;
}

export default function Badge({ variant, title, logo }: Props) {
  const variantName = () => {
    switch (variant) {
      default:
      case 'dark':
        return 'bg-gray-950 text-gray-800';
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'teal':
        return 'bg-teal-100 text-teal-800';
    }
  };
  return (
    <span
      className={`mx-1 inline-flex items-center gap-x-1.5 py-1 px-3 rounded-md text-xs font-semibold ${variantName()}`}
    >
      {!logo && title}
      {logo && <img className="h-4" src={logoImage}></img>}
    </span>
  );
}
