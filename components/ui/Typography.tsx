import { FC, ReactNode, ElementType } from 'react';

type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'body-lg' | 'body' | 'label';

interface TypographyProps {
  variant?: TypographyVariant;
  component?: ElementType;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<TypographyVariant, string> = {
  hero: 'text-hero',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  'body-lg': 'text-body-lg',
  body: 'text-body',
  label: 'text-label',
};

const defaultComponent: Record<TypographyVariant, ElementType> = {
  hero: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  'body-lg': 'p',
  body: 'p',
  label: 'span',
};

const Typography: FC<TypographyProps> = ({
  variant = 'body',
  component,
  children,
  className = '',
}) => {
  const Component = component || defaultComponent[variant];
  const variantClass = variantStyles[variant];

  return (
    <Component className={`${variantClass} ${className}`}>
      {children}
    </Component>
  );
};

export default Typography;
