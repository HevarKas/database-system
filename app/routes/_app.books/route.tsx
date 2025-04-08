import { useCallback, useState } from 'react';
import {
  Form,
  isRouteErrorResponse,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import Barcode from 'react-barcode';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
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
import { BooksDataType } from '~/shared/types/pages/book';
import { CURRENCY_UNIT } from '~/shared/constants/general';

import { getBooksBySearch } from '~/api/endpoints/book';
import { Input } from '~/components/ui/input';
import { useTheme } from '~/contexts/themeProvider';
import { convertArabicToEnglishNumbers } from '~/lib/general';

export const loader = async ({ request }: { request: Request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    const data = await getBooksBySearch(page, search, request);

    if (data?.data?.length === 0 && data.current_page > 1) {
      return redirect('/books');
    }

    return data || { data: [], current_page: 1, last_page: 1 };
  } catch (error) {
    console.error('Error in loader:', error);
    throw new Response('Failed to load books', { status: 500 });
  }
};

const Books = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const { data, current_page, last_page, per_page }: BooksDataType =
    useLoaderData();

  const barcodeColor = isDarkMode ? '#ffffff' : '#111827';

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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [setSearchParams, timer],
  );

  const downloadBookBarcode = async (id: string) => {
    const response = await fetch(
      `http://178.18.250.240:9050/api/admin/books/${id}/barcode`,
    );

    if (!response.ok) {
      throw new Error('Failed to download barcode');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const isPreviousDisabled = current_page <= 1;
  const isNextDisabled = current_page >= last_page;

  return (
    <section className="flex flex-col gap-4 max-h-[calc(100vh-180px)]">
      <Outlet />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('books.books')}</h1>
        <Form method="get" className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder={t('orders.scanBarcodeOrSearch')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow w-[300px]"
          />
        </Form>
        <Link to={`create-book?${searchParams}`} className="flex items-center">
          <Button>{t('books.createBook')}</Button>
        </Link>
      </div>
      <div className="overflow-auto">
        <Table>
          {data?.length === 0 ? (
            <TableCaption>{t('books.noBooksFound')}</TableCaption>
          ) : (
            <>
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">
                    {t('books.bookDetails.ID')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.barcode')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.name')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.author')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.translator')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.publishYear')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.cost')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.price')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.stock')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.category')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('books.bookDetails.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((book, index) => (
                  <TableRow key={book.id} className="text-center">
                    <TableCell className="text-center">
                      {(current_page - 1) * per_page + index + 1}
                    </TableCell>
                    <TableCell className="flex justify-center text-center">
                      <Barcode
                        value={book.barcode}
                        height={20}
                        width={1.2}
                        fontSize={16}
                        textMargin={0}
                        margin={0}
                        background={isDarkMode ? '#111827' : '#ffffff'}
                        lineColor={barcodeColor}
                      />
                    </TableCell>
                    <TableCell className="text-center">{book.name}</TableCell>
                    <TableCell className="text-center">{book.author}</TableCell>
                    <TableCell className="text-center">
                      {book.translator}
                    </TableCell>
                    <TableCell className="text-center">
                      {book.publish_year}
                    </TableCell>
                    <TableCell className="text-red-500 text-center">
                      {formatNumberWithThousandSeparator(book.cost)}
                      <span className="mx-1">{CURRENCY_UNIT}</span>
                    </TableCell>
                    <TableCell className="text-green-500 text-center">
                      {formatNumberWithThousandSeparator(book.price)}
                      <span className="mx-1">{CURRENCY_UNIT}</span>
                    </TableCell>
                    <TableCell
                      className={classNames('text-center', {
                        'bg-red-200 dark:bg-red-600 hover:bg-red-100 dark:hover:bg-red-500':
                          book.stock <= 1,
                      })}
                    >
                      {book.stock}
                    </TableCell>
                    <TableCell className="text-center">
                      {book.category.name}
                    </TableCell>
                    <TableCell className="flex justify-center gap-1 text-center">
                      <Link to={`${book.id}/delete-book?${searchParams}`}>
                        <Button variant="link" className="hover:text-red-500">
                          <FaTrash />
                        </Button>
                      </Link>
                      <Link to={`${book.id}/update-book?${searchParams}`}>
                        <Button
                          variant="link"
                          className="hover:text-yellow-500"
                        >
                          <FaPencilAlt />
                        </Button>
                      </Link>
                      <Button
                        variant="link"
                        className="hover:text-blue-500"
                        onClick={() => downloadBookBarcode(book.id.toString())}
                      >
                        <FaDownload />
                      </Button>
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
            <PaginationItem value="dddd">
              <PaginationPrevious
                onClick={() =>
                  !isPreviousDisabled && handlePageChange(current_page - 1)
                }
                className={classNames('cursor-pointer hover:bg-transparent ', {
                  'opacity-50 cursor-not-allowed': isPreviousDisabled,
                })}
              />
            </PaginationItem>
            <PaginationItem>
              <div className="flex items-center justify-center">
                <Input
                  type="number"
                  value={current_page}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1 && value <= last_page) {
                      handlePageChange(value);
                    }
                  }}
                  className="w-16 px-2 text-center"
                  min={1}
                  max={last_page}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      handlePageChange(1);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = Number(e.currentTarget.value);
                      if (value >= 1 && value <= last_page) {
                        handlePageChange(value);
                      }
                    }
                  }}
                />

                <span className="mx-2">{t('books.of')}</span>
                <span className="font-bold">{last_page}</span>
              </div>
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

export default Books;

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
