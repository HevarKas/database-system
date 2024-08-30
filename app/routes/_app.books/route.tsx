import { Link, Outlet, useLoaderData } from '@remix-run/react';
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
  const { data }: { data?: Book } = useLoaderData();

  return (
    <section>
      <Outlet />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold my-4">Books</h1>
        <Link to="create-book" className="flex items-center">
          <Button>Create Book</Button>
        </Link>
      </div>
      <Table>
        {data && data.length === 0 && (
          <TableCaption>No Books found</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Translator</TableHead>
            <TableHead>Publish Year</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Category ID</TableHead>
          </TableRow>
        </TableHeader>
        {data && data.length !== 0 && (
          <TableBody>
            {data.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.barcode}</TableCell>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.description}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.translator}</TableCell>
                <TableCell>{book.publish_year}</TableCell>
                <TableCell>{book.cost}</TableCell>
                <TableCell>{book.price}</TableCell>
                <TableCell>{book.stock}</TableCell>
                <TableCell>{book.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </section>
  );
}

export default Books;
