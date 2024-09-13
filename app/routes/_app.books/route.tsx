import { useCallback } from 'react';
import {
  isRouteErrorResponse,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import classNames from 'classnames';
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
import { BooksDataType } from '~/shared/types/pages/book';
import { CURRENCY_UNIT } from '~/shared/constants/general';

import { getBooks } from '~/api/endpoints/book';

export const loader = async ({ request }: { request: Request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get('page') || '1';
  const data = await getBooks(page, request);

  if (data?.data?.length === 0 && data.current_page > 1) {
    return redirect('/books');
  }

  return data;
};

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, current_page, last_page, per_page }: BooksDataType =
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

  return (
    <section className="flex flex-col gap-4 max-h-[calc(100vh-180px)]">
      <Outlet />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Books</h1>
        <Link to={`create-book?${searchParams}`} className="flex items-center">
          <Button>Create Book</Button>
        </Link>
      </div>
      <div className="overflow-auto">
        <Table>
          {data?.length === 0 ? (
            <TableCaption>No Books found</TableCaption>
          ) : (
            <>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cover</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Translator</TableHead>
                  <TableHead>Publish Year</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((book, index) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      {(current_page - 1) * per_page + index + 1}
                    </TableCell>
                    <TableCell>
                      <img
                        src={book.cover}
                        alt={book.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell>{book.barcode}</TableCell>
                    <TableCell>{book.name}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.translator}</TableCell>
                    <TableCell>{book.publish_year}</TableCell>
                    <TableCell className="text-red-500">
                      {formatNumberWithThousandSeparator(book.cost)}
                      <span className="ml-1">{CURRENCY_UNIT}</span>
                    </TableCell>
                    <TableCell className="text-green-500">
                      {formatNumberWithThousandSeparator(book.price)}
                      <span className="ml-1">{CURRENCY_UNIT}</span>
                    </TableCell>
                    <TableCell>{book.stock}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell className="flex gap-1">
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
                className={classNames('cursor-pointer hover:bg-transparent ', {
                  'opacity-50 cursor-not-allowed': isPreviousDisabled,
                })}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="font-semibold">Page {current_page}</span>
              <span className="mx-2">of</span>
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
