import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

interface Props {
  title: string;
  value?: string | number;
  href?: string;
  loading?: boolean;
  color?: 'green' | 'red' | 'blue';

  onClick?: () => void;
  className?: string;
}

const StatisticCard = ({
  title,
  value,
  href,
  loading,
  color,
  onClick,
  className,
}: Props) => {
  const { t } = useTranslation();
  const loadingLabel = t('common:loading');

  const generateOuterColor = (enableHoverEffect: boolean) => {
    switch (color) {
      case 'green':
        return `border-green-300/10 bg-green-300/5 ${
          enableHoverEffect ? 'hover:bg-green-300/10' : ''
        }`;

      case 'red':
        return `border-red-300/10 bg-red-300/5 ${
          enableHoverEffect ? 'hover:bg-red-300/10' : ''
        }`;

      case 'blue':
        return `border-blue-300/10 bg-blue-300/5 ${
          enableHoverEffect ? 'hover:bg-blue-300/10' : ''
        }`;

      default:
        return `border-zinc-300/10 bg-zinc-300/5 ${
          enableHoverEffect ? 'hover:bg-zinc-300/10' : ''
        }`;
    }
  };

  const generateInnerColor = () => {
    switch (color) {
      case 'green':
        return 'border-green-300/20 bg-green-300/10 text-green-300';

      case 'red':
        return 'border-red-300/20 bg-red-300/10 text-red-300';

      case 'blue':
        return 'border-blue-300/20 bg-blue-300/10 text-blue-300';

      default:
        return 'border-zinc-300/20 bg-zinc-300/10 text-zinc-300';
    }
  };

  const generateTitleColor = () => {
    switch (color) {
      case 'green':
        return 'text-green-300';

      case 'red':
        return 'text-red-300';

      case 'blue':
        return 'text-blue-300';

      default:
        return 'text-zinc-300';
    }
  };

  if (href)
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`rounded border transition duration-300 ${
          onClick || href ? 'hover:-translate-y-1' : 'cursor-default'
        } ${generateOuterColor(!!onClick || !!href)} ${className || ''}`}
      >
        <div
          className={`p-1 text-center text-lg font-semibold ${generateTitleColor()}`}
        >
          {title}
        </div>
        <div
          className={`m-2 mt-0 flex items-center justify-center rounded border p-4 text-2xl font-bold ${generateInnerColor()}`}
        >
          {loading ? loadingLabel : value != null ? value : 'N/A'}
        </div>
      </Link>
    );

  return (
    <button
      onClick={onClick}
      className={`rounded border transition duration-300 ${
        onClick || href ? 'hover:-translate-y-1' : 'cursor-default'
      } ${generateOuterColor(!!onClick || !!href)} ${className || ''}`}
    >
      <div
        className={`p-1 text-center text-lg font-semibold ${generateTitleColor()}`}
      >
        {title}
      </div>
      <div
        className={`m-2 mt-0 flex items-center justify-center rounded border p-4 text-2xl font-bold ${generateInnerColor()}`}
      >
        {loading ? loadingLabel : value != null ? value : 'N/A'}
      </div>
    </button>
  );
};

export default StatisticCard;
