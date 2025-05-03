import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useCallback, useEffect, useState } from 'react';
import { getBooksBySearch } from '~/api/endpoints/book';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import { useTranslation } from 'react-i18next';
import ErrorIcon from '~/assets/ErrorIcon';
import { postOrder } from '~/api/endpoints/orders';
import { tostActionType } from '~/shared/types/toast';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '~/components/modal/ConfirmationModal';
import classNames from 'classnames';
import { Book, PaginationData } from '~/shared/types/pages/orders';
import {
  convertArabicToEnglishNumbers,
  filterNumericInput,
} from '~/lib/general';
import { Checkbox } from '~/components/ui/checkbox';

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const page = url.searchParams.get('page') || '1';
  const stock = url.searchParams.get('stock') || null;

  if (!search) {
    return {
      books: { data: [], per_page: 0, total: 0, current_page: 1, last_page: 1 },
    };
  }

  try {
    const data = await getBooksBySearch(page, search, stock, request);
    return { books: data };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Response('Unable to load books. Please try again later.', {
      status: 500,
    });
  }
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const entries: Array<{ key: string; value: string }> = [];
  for (const [key, value] of formData.entries()) {
    entries.push({ key, value: value.toString() });
  }

  const paidValue = entries.find((item) => item.key === 'paid')?.value;
  const customerName = entries.find(
    (item) => item.key === 'customer_name',
  )?.value;
  const customerPhoneNumber = entries.find(
    (item) => item.key === 'customer_phone_number',
  )?.value;

  if (!paidValue || isNaN(Number(paidValue))) {
    return { type: 'error', toast: 'Failed to order. Invalid payment amount.' };
  }

  if (!customerName || !customerPhoneNumber) {
    return {
      type: 'error',
      toast: 'Failed to order. Missing customer details.',
    };
  }

  const books = entries.filter((item) => item.key.startsWith('books'));
  const booksData = books.reduce(
    (
      acc: { [key: number]: { id: string; price: string; quantity: string } },
      item,
    ) => {
      const [, index, key] = item.key.match(/^books\[(\d+)\]\[(\w+)\]$/) || [];
      if (index && key) {
        const numericIndex = parseInt(index, 10);
        if (!acc[numericIndex])
          acc[numericIndex] = { id: '', price: '', quantity: '' };
        acc[numericIndex][key as 'id' | 'price' | 'quantity'] = item.value;
      }
      return acc;
    },
    {} as { [key: number]: { id: string; price: string; quantity: string } },
  );

  const formDataToSend = new FormData();
  formDataToSend.append('customer_name', customerName);
  formDataToSend.append('customer_phone_number', customerPhoneNumber);
  formDataToSend.append('paid', paidValue);

  Object.entries(booksData).forEach(([index, book]) => {
    formDataToSend.append(`books[${index}][id]`, book.id);
    formDataToSend.append(`books[${index}][price]`, book.price);
    formDataToSend.append(`books[${index}][quantity]`, book.quantity);
  });

  try {
    await postOrder(request, formDataToSend);
    return { type: 'success', toast: 'Order created successfully!' };
  } catch (error) {
    return { type: 'error', toast: 'Failed to order.' };
  }
};

function Orders() {
  const { books } = useLoaderData<{ books: PaginationData }>();
  const actionData = useActionData<tostActionType>();
  const { data: booksList, current_page, last_page } = books;
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';
  const isLoading = navigation.state === 'loading';

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [prices, setPrices] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<Book[]>([]);
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaidLater, setIsPaidLater] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [paidLaterValue, setPaidLaterValue] = useState('0');

  const totalPrice = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );
  const paidPrice = isPaidLater ? Number(paidLaterValue) : totalPrice;

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

  const handlePriceChange = (bookId: number, newPrice: string) => {
    const filteredValue = filterNumericInput(newPrice);
    const englishValue = convertArabicToEnglishNumbers(filteredValue);

    if (englishValue !== '') {
      setPrices((prev) => ({
        ...prev,
        [bookId]: parseInt(englishValue, 10),
      }));
    }
  };

  const handlePaidLaterChange = (newPrice: string) => {
    const filteredValue = filterNumericInput(newPrice);
    const englishValue = convertArabicToEnglishNumbers(filteredValue);

    if (englishValue !== '') {
      setPaidLaterValue(englishValue);
    } else {
      setPaidLaterValue('0');
    }
  };

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    const filteredValue = filterNumericInput(newPhoneNumber);
    const englishValue = convertArabicToEnglishNumbers(filteredValue);

    if (englishValue !== '') {
      setCustomerPhoneNumber(englishValue);
    } else {
      setCustomerPhoneNumber('');
    }
  };

  const handleAddToCart = (book: Book) => {
    const updatedPrice =
      prices[book.id] !== undefined ? prices[book.id] : book.price;

    if (!cart.some((item) => item.id === book.id)) {
      const updatedBook = { ...book, price: updatedPrice, quantity: 1 };
      setCart((prevCart) => [...prevCart, updatedBook]);
      setSearchParams({});
      setSearchQuery('');
    }
  };

  const handleQuantityChange = (bookId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    const updatedCart = cart.map((item) => {
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
    const updatedCart = cart.filter((item) => item.id !== bookId);
    setCart(updatedCart);
  };

  useEffect(() => {
    if (actionData) {
      if (actionData.type === 'success') {
        toast.success(actionData.toast);

        closeModal();
        setSearchParams({});
        setCart([]);
        setPrices({});
        setCustomerName('');
        setCustomerPhoneNumber('');
        setPaidLaterValue('0');
        setIsPaidLater(false);
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
                <TableCaption>{t('orders.noBooksFound')}</TableCaption>
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
                        {t('orders.stock')}
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
                        <TableCell className="text-center">
                          {book.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {book.author}
                        </TableCell>
                        <TableCell className="text-center">
                          {book.stock}
                        </TableCell>
                        <TableCell className="flex items-center justify-center">
                          <Input
                            type="text"
                            value={
                              prices[book.id] !== undefined
                                ? prices[book.id]
                                : book.price
                            }
                            onInput={(e) =>
                              handlePriceChange(
                                book.id,
                                (e.target as HTMLInputElement).value,
                              )
                            }
                            className="w-16"
                          />
                          <span className="ml-2">دينار</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            onClick={() => handleAddToCart(book)}
                            className="p-2 text-sm"
                            disabled={book.stock <= 0}
                          >
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
                    onClick={() =>
                      !isPreviousDisabled && handlePageChange(current_page - 1)
                    }
                    className={classNames(
                      'cursor-pointer hover:bg-transparent',
                      {
                        'opacity-50 cursor-not-allowed': isPreviousDisabled,
                      },
                    )}
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
                    onClick={() =>
                      !isNextDisabled && handlePageChange(current_page + 1)
                    }
                    className={classNames(
                      'cursor-pointer hover:bg-transparent',
                      {
                        'opacity-50 cursor-not-allowed': isNextDisabled,
                      },
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        <div className="flex flex-col justify-between w-[600px] flex-shrink-0 h-screen max-h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 p-6">
          <div className="overflow-auto flex-grow h-[calc(100vh-300px)]">
            <h2 className="text-xl font-semibold mb-4">{t('orders.cart')}</h2>
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
                    <TableCell className="text-center min-w-[200px]">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="p-1 text-sm mx-2"
                      >
                        <FaMinus />
                      </Button>
                      {item.quantity}
                      <Button
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="p-1 text-sm mx-2"
                      >
                        <FaPlus />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.price} دينار
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity * item.price} دينار
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="p-2 text-sm"
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-start mt-6">
            <div className="flex flex-col space-y-4 w-full">
              <div>
                {t('orders.totalPrice')}:
                <span
                  className={classNames(
                    'font-semibold mx-2 text-lg text-green-600',
                    { 'line-through': isPaidLater },
                  )}
                >
                  {totalPrice} دينار
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={isPaidLater}
                  onCheckedChange={() => setIsPaidLater(!isPaidLater)}
                />
                <span>{t('orders.paidLater')}</span>
              </div>

              {isPaidLater && (
                <div className="flex flex-wrap gap-4">
                  <Input
                    type="text"
                    placeholder={t('orders.enterCustomerName')}
                    name="customer_name"
                    value={customerName}
                    onInput={(e) => setCustomerName(e.currentTarget.value)}
                    className="w-1/3 sm:w-auto"
                  />
                  <Input
                    type="text"
                    placeholder={t('orders.enterCustomerPhoneNumber')}
                    name="customer_phone_number"
                    value={customerPhoneNumber.toString()}
                    onInput={(e) =>
                      handlePhoneNumberChange(e.currentTarget.value)
                    }
                    className="w-1/3 sm:w-auto"
                  />
                  <Input
                    type="text"
                    placeholder={t('orders.enterPaidPrice')}
                    name="paid"
                    value={paidLaterValue.toString()}
                    onInput={(e) =>
                      handlePaidLaterChange(e.currentTarget.value)
                    }
                    className="w-1/3 sm:w-auto"
                    disabled={!isPaidLater}
                  />
                </div>
              )}
            </div>

            <div className="text-right w-full sm:w-auto">
              <Button onClick={openModal} className="w-full sm:w-auto">
                {t('orders.confirmOrder')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={closeModal}
        customerName={customerName && isPaidLater ? customerName : 'نەزانراو'}
        customerPhoneNumber={
          customerPhoneNumber && isPaidLater ? customerPhoneNumber : '0'
        }
        paidPrice={paidPrice}
        books={cart}
        disabled={isSubmitting || isLoading}
      />
    </section>
  );
}

export default Orders;

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
