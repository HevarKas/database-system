import { Form, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { getBookById } from '~/api/endpoints/book';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
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
};

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
  const id = params.id;
  const book = await getBookById(id, request);

  return { book };
};

function Orders() {
  const loaderData = useLoaderData<{ book: Book }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [cart, setCart] = useState<Book[]>([]);

  const handleAddToCart = (book: Book) => {
    setCart([...cart, book]);
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(cart.filter((book) => book.id !== id));
  };

  const handleProceed = () => {
    console.log('Proceed to Checkout');
  };

  return (
    <section className="flex p-6 space-x-6">
      {/* Search and Results Section */}
      <div className="flex-grow flex flex-col space-y-6">
        <Form method="get" className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search for books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </Form>

        <div className="overflow-x-auto flex-grow">
          <Table>
            {searchResults.length === 0 ? (
              <TableCaption>No books found</TableCaption>
            ) : (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.name}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        {formatNumberWithThousandSeparator(book.price)} دینار
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleAddToCart(book)}>
                          Add to Cart
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </div>
      </div>

      {/* Cart Component */}
      <div className="flex flex-col justify-between w-96 flex-shrink-0 h-screen max-h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 p-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          <Table>
            {cart.length === 0 ? (
              <TableCaption>No items in cart</TableCaption>
            ) : (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.name}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        {formatNumberWithThousandSeparator(book.price)} دینار
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleRemoveFromCart(book.id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleProceed}>Proceed to Checkout</Button>
        </div>
      </div>
    </section>
  );
}

export default Orders;
