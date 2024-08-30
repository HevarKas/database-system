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
          <Button>create Book</Button>
        </Link>
      </div>
      <Table>
        {data && data?.length === 0 && (
          <TableCaption>No Books found</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        {data && data?.length !== 0 && (
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </section>
  );
}

export default Books;
