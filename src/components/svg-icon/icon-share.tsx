import { Share2 } from 'lucide-react';

type TProps = React.SVGProps<SVGSVGElement>;

export default function IconShare(props: TProps) {
  return <Share2 size={25} strokeWidth={1.5} {...props} />;
}