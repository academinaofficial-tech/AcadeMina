import { FC, ReactNode, HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide';
}

export const Container: FC<ContainerProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const maxWidthClass = {
    default: 'max-w-[1200px]',
    narrow: 'max-w-[800px]',
    wide: 'max-w-[1400px]',
  }[variant];

  return (
    <div className={`mx-auto w-full px-5 md:px-10 ${maxWidthClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  spacing?: 'default' | 'none' | 'large';
}

export const Section: FC<SectionProps> = ({
  children,
  className = '',
  spacing = 'default',
  ...props
}) => {
  const paddingClass = {
    default: 'py-[60px] md:py-[120px]',
    none: 'py-0',
    large: 'py-[100px] md:py-[180px]',
  }[spacing];

  return (
    <section className={`${paddingClass} ${className}`} {...props}>
      {children}
    </section>
  );
};
