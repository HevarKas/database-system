import { useCallback, useState } from 'react';
import {
  Form,
  isRouteErrorResponse,
  Link,
  Outlet,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import ErrorIcon from '~/assets/ErrorIcon';

import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';

import { formatNumberWithThousandSeparator } from '~/lib/utils';
import { CURRENCY_UNIT } from '~/shared/constants/general';

import { Input } from '~/components/ui/input';
import { convertArabicToEnglishNumbers } from '~/lib/general';
import { getOrders } from '~/api/endpoints/orders';
import { TranscationDataType } from '~/shared/types/pages/orders';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select';

export const loader = async ({ request }: { request: Request }) => {
  const searchParams = new URL(request.url).searchParams;

  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'pending';

  try {
    const data = await getOrders(page, status, search, request);

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Response('Unable to load orders. Please try again later.', { status: 500 });
  }
};


const Transaction = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setStatusParams] = useState(searchParams.get('status') || 'pending');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusQuery, setStatusQuery] = useState(searchParams.get('status') || 'pending');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const { data, current_page, last_page, per_page }: TranscationDataType =
    useLoaderData();

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= last_page) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set('page', String(newPage));
          return newParams;
        });
      }
    },
    [last_page, setSearchParams],
  );

  const isPreviousDisabled = current_page <= 1;
  const isNextDisabled = current_page >= last_page;

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = convertArabicToEnglishNumbers(value);

    setSearchQuery(value);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      setSearchParams({ search: value });
    }, 1000);

    setTimer(newTimer);
  }, [setSearchParams, timer]);

  const handleStatusChange = useCallback((value: string) => {
    setStatusParams(value);
    setStatusQuery(value);
    setSearchParams({ status: value });
  }, [setStatusParams, setSearchParams]);

  return (
    <section className="flex flex-col gap-4 max-h-[calc(100vh-180px)]">
      <Outlet />
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{t('transaction.title')}</h1>
        <div className="flex items-center justify-center gap-4">
        <Form method="get" className="flex items-center gap-4 w-[300px] sm:w-[400px] lg:w-[500px]">
          <Input
            type="text"
            placeholder={t('transaction.scanBarcodeOrSearch')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow w-[500px]"
          />
          <div className="w-40">
          <Select
            value={statusQuery}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="flex items-center gap-1">
              <SelectValue className="text-sm text-gray-600 dark:text-gray-400">
                {statusQuery === 'completed'
                  ? t('transaction.completed')
                  : t('transaction.pending')}
              </SelectValue>
              
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="pending">
                  <SelectLabel>{t('transaction.pending')}</SelectLabel>
                </SelectItem>
                <SelectItem value="completed">
                  <SelectLabel>{t('transaction.completed')}</SelectLabel>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
        </Form>
        </div>
      </div>
      <div className="overflow-auto">
        <Table>
          {data?.length === 0 ? (
            <TableCaption>{t('transaction.noData')}</TableCaption>
          ) : (
            <>
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">{t('transaction.no')}</TableHead>
                  <TableHead className="text-center">{t('transaction.customerName')}</TableHead>
                  <TableHead className="text-center">{t('transaction.customerPhone')}</TableHead>
                  <TableHead className="text-center">{t('transaction.status')}</TableHead>
                  <TableHead className="text-center">{t('transaction.total')}</TableHead>
                  <TableHead className="text-center">{t('transaction.paid')}</TableHead>
                  <TableHead className="text-center">{t('transaction.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((transaction, index) => (
                  <TableRow key={transaction.id} className="text-center">
                    <TableCell className="text-center">
                      {(current_page - 1) * per_page + index + 1}
                    </TableCell>
                    <TableCell className="text-center">{transaction.customer_name}</TableCell>
                    <TableCell className="text-center">{transaction.customer_phone_number}</TableCell>
                    <TableCell className="text-center">
                      <span className={classNames('px-2 py-1 rounded-full text-xs font-semibold', {
                        'bg-yellow-500 text-white': transaction.status === 'pending',
                        'bg-green-500 text-white': transaction.status === 'completed',
                      })}>
                        {transaction.status}
                      
                      </span>
                      </TableCell>
                    <TableCell className="text-center text-green-500">
                      {formatNumberWithThousandSeparator(transaction.total)}
                      <span className="mx-1">{CURRENCY_UNIT}</span>
                    </TableCell>
                    <TableCell className={classNames('text-center', {
                      'text-red-500': transaction.paid < transaction.total,
                      'text-green-500': transaction.paid === transaction.total,
                    })}>
                      {formatNumberWithThousandSeparator(transaction.paid)}
                      <span className="mx-1">{CURRENCY_UNIT}</span>
                    </TableCell>
                    <TableCell className="flex justify-center gap-1 text-center">
                      <Link to={`${transaction.id}/delete-transaction?${searchParams}`}>
                        <Button variant="link" className="hover:text-red-500">
                          <FaTrash />
                        </Button>
                      </Link>
                      <Link to={`${transaction.id}/update-transaction?${searchParams}`}>
                        <Button variant="link" className="hover:text-yellow-500">
                          <FaPencilAlt />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </div>

      {data?.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  !isPreviousDisabled && handlePageChange(current_page - 1)
                }
                className={classNames('cursor-pointer hover:bg-transparent', {
                  'opacity-50 cursor-not-allowed': isPreviousDisabled,
                })}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="font-semibold">
                {t('transaction.page')} {current_page}
              </span>
              <span className="mx-2">{t('transaction.of')}</span>
              <span className="font-bold">{last_page}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  !isNextDisabled && handlePageChange(current_page + 1)
                }
                className={classNames('cursor-pointer hover:bg-transparent', {
                  'opacity-50 cursor-not-allowed': isNextDisabled,
                })}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default Transaction;

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-180px)] dark:bg-gray-900 p-6">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 flex-shrink-0 mr-4">
            <ErrorIcon />
          </div>
          <div>
            {isRouteErrorResponse(error) ? (
              <>
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {error.status} {error.statusText}
                </h1>
                <p className="text-gray-800 dark:text-gray-300">{error.data}</p>
              </>
            ) : error instanceof Error ? (
              <>
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Error
                </h1>
                <p className="text-gray-800 dark:text-gray-300">
                  {error.message}
                </p>
              </>
            ) : (
              <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
                Unknown Error
              </h1>
            )}
          </div>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Please try again later or contact support if the issue persists.
        </p>
      </div>
    </div>
  );
}
