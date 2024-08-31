import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { getBooks } from '~/api/endpoints/book';
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
import { useCallback, useEffect } from 'react';
import { formatNumberWithThousandSeparator } from '~/lib/utils';

export type Book = {
  id: number;
  cover: string | null;
  barcode: string;
  name: string;
  description: string;
  category: string;
  author: string;
  translator: string;
  publish_year: number;
  cost: number;
  price: number;
  stock: number;
}[];

export const loader = async ({ request }: { request: Request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get('page') || '1';

  const data = await getBooks(page, request);

  return data;
};

function Books() {
  const loaderData: {
    current_page: number;
    data: Book;
    last_page: number;
    per_page: number;
    total: number;
  } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= loaderData.last_page) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', String(newPage));
        setSearchParams(newSearchParams);
      }
    },
    [loaderData.last_page, searchParams, setSearchParams],
  );

  useEffect(() => {
    if (loaderData.data.length === 0 && loaderData.current_page > 1) {
      navigate('/books?page=1', { replace: true });
    }
  }, [loaderData.data, loaderData.current_page, navigate]);

  return (
    <section className="flex flex-col gap-4">
      <Outlet />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Books</h1>
        <Link to={`create-book?${searchParams}`} className="flex items-center">
          <Button>Create Book</Button>
        </Link>
      </div>
      <div className="overflow-auto max-h-[500px]">
        <Table>
          {loaderData.data.length === 0 ? (
            <TableCaption>No Books found</TableCaption>
          ) : (
            <>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
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
                {loaderData.data.map((book, index) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      {(loaderData.current_page - 1) * loaderData.per_page +
                        index +
                        1}
                    </TableCell>
                    <TableCell>{book.barcode}</TableCell>
                    <TableCell>{book.name}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.translator}</TableCell>
                    <TableCell>{book.publish_year}</TableCell>
                    <TableCell className="text-red-500">
                      {formatNumberWithThousandSeparator(book.cost)} دینار
                    </TableCell>
                    <TableCell className="text-green-500">
                      {formatNumberWithThousandSeparator(book.price)} دینار
                    </TableCell>
                    <TableCell>{book.stock}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell className="flex gap-1">
                      <Link to={`${book.id}/delete-book?${searchParams}`}>
                        <Button variant="ghost" className="hover:bg-red-300">
                          <FaTrash />
                        </Button>
                      </Link>
                      <Link to={`${book.id}/update-book?${searchParams}`}>
                        <Button variant="ghost" className="hover:bg-yellow-300">
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
      {loaderData.data.length !== 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(loaderData.current_page - 1)}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="font-semibold">
                Page {loaderData.current_page}
              </span>
              <span className="mx-2">of</span>
              <span className="font-bold">{loaderData.last_page}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(loaderData.current_page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}

export default Books;
