import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from 'app/lib/utils';
import { ButtonProps, buttonVariants } from 'app/components/ui/button';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '~/contexts/LanguageContext';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';
Pagination.propTypes = {
  className: PropTypes.string,
};

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';
PaginationContent.propTypes = {
  className: PropTypes.string,
};

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';
PaginationItem.propTypes = {
  className: PropTypes.string,
};

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  children,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  >
    {children || <span aria-hidden="true">Link</span>}
  </a>
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useTranslation();
  const { rtl } = useLanguage();

  return (
    <PaginationLink
      aria-label={t('books.pervious')}
      size="default"
      className={cn('gap-1 pl-2.5 flex items-center', className)}
      {...props}
    >
      {rtl ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
      <span>{t('books.pervious')}</span>
    </PaginationLink>
  );
};
PaginationPrevious.propTypes = {
  className: PropTypes.string,
};

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useTranslation();
  const { rtl } = useLanguage();

  return (
    <PaginationLink
      aria-label={t('books.next')}
      size="default"
      className={cn('gap-1 pr-2.5 flex items-center', className)}
      {...props}
    >
      <span>{t('books.next')}</span>
      {rtl ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </PaginationLink>
  );
};
PaginationNext.propTypes = {
  className: PropTypes.string,
};

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
PaginationEllipsis.propTypes = {
  className: PropTypes.string,
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
