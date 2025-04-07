import { motion } from 'framer-motion';
import Badge, { type Variant } from '../../lib/components/Badge';

interface Props {
  author: string;
  message: string;
  region: 'Global' | 'Race';
  isSystem: boolean;
}

export default function ChatMessage(props: Props) {
  const regionVariant = (): Variant => {
    switch (props.region) {
      default:
      case 'Global':
        return 'blue';
      case 'Race':
        return 'teal';
    }
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: { translateX: '0%' },
        hidden: { translateX: '-100%' },
      }}
      transition={{ duration: 0.4, ease: 'circInOut' }}
      className="my-1 flex items-start"
    >
      <Badge title={props.region} variant={regionVariant()} logo={false} />
      {props.isSystem && <Badge title="Proton" variant="dark" logo={true} />}

      <p className="mx-1">{props.author}: </p>
      <p>{props.message}</p>
    </motion.div>
  );
}
