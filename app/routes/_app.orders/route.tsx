import { Form, isRouteErrorResponse, useActionData, useLoaderData, useRouteError, useSearchParams } from '@remix-run/react';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useCallback, useEffect, useState } from 'react';
import { getBooksBySearch } from '~/api/endpoints/book';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '~/components/ui/pagination';
import { useTranslation } from 'react-i18next';
import ErrorIcon from '~/assets/ErrorIcon';
import { postOrder } from '~/api/endpoints/orders';
import { tostActionType } from '~/shared/types/toast';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '~/components/modal/ConfirmationModal';
import classNames from 'classnames';
import { Book, PaginationData } from '~/shared/types/pages/orders';

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const page = url.searchParams.get('page') || '1';

  if (!search) {
    return { books: { data: [], per_page: 0, total: 0, current_page: 1, last_page: 1 } };
  }

  try {
    const data = await getBooksBySearch(page, search, request);
    return { books: data };
  } catch (error) {
    throw new Response('Unable to load books. Please try again later.', { status: 500 });
  }
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const total = formData.get('total');
  const paid = formData.get('paid');

  if ((total as string).trim() === "" || (paid as string).trim() === "" || total === "0" || paid === "0" || isNaN(Number(total)) || isNaN(Number(paid))) {
    return {
      type: 'error',
      toast: 'Failed to order.',
    };
  }

  const formDataToSend = new FormData();
  formDataToSend.append('customer_phone_number', formData.get('customer_phone_number') as string);
  formDataToSend.append('customer_name', formData.get('customer_name') as string);
  formDataToSend.append('total', total as string);
  formDataToSend.append('paid', paid as string);
 
  try {
    await postOrder(request, formDataToSend);
    return {
      type: 'success',
      toast: 'Order created successfully!',
    };
  } catch (error) {
    return {
      type: 'error',
      toast: 'Failed to order.',
    };
  }
}

function Orders() {
  const { books } = useLoaderData<{ books: PaginationData }>();
  const actionData = useActionData<tostActionType>();
  const { data: booksList, current_page, last_page } = books;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [prices, setPrices] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<Book[]>([]);
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    const value = e.target.value;
    setSearchQuery(value);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      setSearchParams({ search: value });
    }, 1000);

    setTimer(newTimer);
  }, [setSearchParams, timer]);

  const handlePriceChange = (bookId: number, newPrice: string) => {
    const numericPrice = newPrice.replace(/\D/g, '');
    if (numericPrice) {
      setPrices((prev) => ({
        ...prev,
        [bookId]: Number(numericPrice),
      }));
    }
  };

  const handleAddToCart = (book: Book) => {
    const updatedPrice = prices[book.id] !== undefined ? prices[book.id] : book.price;

    if (!cart.some(item => item.id === book.id)) {
      const updatedBook = { ...book, price: updatedPrice, quantity: 1 };
      setCart((prevCart) => [...prevCart, updatedBook]);
    }
  };

  const handleQuantityChange = (bookId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    const updatedCart = cart.map(item => {
      if (item.id === bookId) {
        if (newQuantity <= item.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (bookId: number) => {
    const updatedCart = cart.filter(item => item.id !== bookId);
    setCart(updatedCart);
  };

  const totalCost = cart.reduce((total, item) => total + item.quantity * item.cost, 0);
  const totalPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);

  useEffect(() => {
    if (actionData) {
      if (actionData.type === 'success') {
        toast.success(actionData.toast);
    
        closeModal()
        setSearchParams({});
        setCart([]);
      } else {
        toast.error(actionData.toast);
      }
    }
  }, [actionData, handleSearchChange, setSearchParams]);

  return (
    <section>
      <div className="flex justify-between items-first gap-4">
        <div className="flex-grow flex flex-col space-y-6">
          <Form method="get" className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder={t('orders.scanBarcodeOrSearch')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-grow"
            />
          </Form>

          <div className="overflow-auto flex-grow h-[calc(100vh-300px)]">
          <Table>
            {booksList?.length === 0 ? (
              <TableCaption>
                {t('orders.noBooksFound')}
              </TableCaption>
            ) : (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      {t('orders.title')}
                    </TableHead>
                    <TableHead className="text-center">
                      {t('orders.author')}
                    </TableHead>
                    <TableHead className="text-center">
                      {t('orders.price')}
                    </TableHead>
                    <TableHead className="text-center">
                      {t('orders.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {booksList?.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="text-center">{book.name}</TableCell>
                      <TableCell className="text-center">{book.author}</TableCell>
                      <TableCell className="flex items-center justify-center">
                        <Input
                          type="text"
                          value={prices[book.id] !== undefined ? prices[book.id] : book.price}
                          onInput={(e) => handlePriceChange(book.id, (e.target as HTMLInputElement).value)}
                          className="w-16"
                        />
                        <span className="ml-2">دينار</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button onClick={() => handleAddToCart(book)} className="p-2 text-sm">
                          <FaPlus />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </div>


          {booksList?.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => !isPreviousDisabled && handlePageChange(current_page - 1)}
                    className={classNames('cursor-pointer hover:bg-transparent', {
                      'opacity-50 cursor-not-allowed': isPreviousDisabled,
                    })}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="font-semibold">
                    {t('books.page')} {current_page}
                  </span>
                  <span className="mx-2">{t('books.of')}</span>
                  <span className="font-bold">{last_page}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => !isNextDisabled && handlePageChange(current_page + 1)}
                    className={classNames('cursor-pointer hover:bg-transparent', {
                      'opacity-50 cursor-not-allowed': isNextDisabled,
                    })}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        <div className="flex flex-col justify-between w-[600px] flex-shrink-0 h-screen max-h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 p-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Cart</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">
                    {t('orders.book')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('orders.quantity')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('orders.price')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('orders.total')}
                  </TableHead>
                  <TableHead className="text-center">
                    {t('orders.actions')}
                  </TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{item.name}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 text-sm mx-2"
                      >
                        <FaMinus />
                      </Button>
                      {item.quantity}
                      <Button
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 text-sm mx-2"
                      >
                        <FaPlus />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">{item.price} دينار</TableCell>
                    <TableCell className="text-center">{item.quantity * item.price} دينار</TableCell>
                    <TableCell className="text-center">
                      <Button onClick={() => handleRemoveFromCart(item.id)} className="p-2 text-sm">
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>

          <div className="flex justify-between mt-6">
            <div>
              <div>{t('orders.totalPrice')}: {totalPrice} دينار</div>
            </div>
            <div className="text-right">
              <Button onClick={openModal} className="w-full">
                {t('orders.confirmOrder')}
              </Button>
            </div>
          </div>
        </div>


      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={closeModal}
        totalCost={totalCost}
        totalPrice={totalPrice}
      />
    </section>
  );
}

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


export default Orders;
