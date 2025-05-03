import { useEffect } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { toast } from 'react-toastify';

import Modal from '~/components/modal/modal';

import { tostActionType } from '~/shared/types/toast';

import { getOrderById, returnStock } from '~/api/endpoints/orders';
import { transactionType } from '~/shared/types/pages/orders';

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
  const id = params.id;

  try {
    const data = await getOrderById(id, request);

    return { data };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Response('Unable to load the order. Please try again later.', {
      status: 500,
    });
  }
};

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string; orderItem: string };
}) => {
  const orderId = params.id;

  const formData = await request.formData();
  const orderItemId = formData.get('orderItemId') as string;

  const stock = Number(formData.get('stock'));

  if (!stock || stock <= 0) {
    return {
      type: 'error',
      toast: 'Please enter a valid quantity to return.',
    };
  }

  try {
    await returnStock(orderId, orderItemId, stock, request);

    return {
      type: 'success',
      toast: 'Book returned successfully!',
    };
  } catch (err) {
    console.error('Return stock error:', err);
    return {
      type: 'error',
      toast: 'Failed to return the book. Please try again.',
    };
  }
};

function ReturnBookTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<tostActionType>();
  const loaderData = useLoaderData<{ data: transactionType }>();

  const handleClose = () => {
    navigate(`/transaction?${searchParams}`);
  };

  useEffect(() => {
    if (actionData) {
      if (actionData.type === 'success') {
        toast.success(actionData.toast);
        navigate(`/transaction?${searchParams}`);
      } else {
        toast.error(actionData.toast);
      }
    }
  }, [actionData, navigate, searchParams]);

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      header="Return Book"
      variant="danger"
    >
      <div className="flex flex-col gap-6">
        {loaderData.data.books.map((book) => (
          <Form
            key={book.id}
            method="post"
            action="."
            className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 flex flex-col gap-3"
          >
            <input type="hidden" name="orderItemId" value={book.id} />
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {book.name}
              </h3>
              <span className="text-sm text-gray-500">
                Original Quantity: <strong>{book.quantity}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor={`stock-${book.id}`}
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Quantity to return:
              </label>
              <input
                type="number"
                name="stock"
                id={`stock-${book.id}`}
                min={0}
                max={book.quantity}
                defaultValue={0}
                className="w-20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-center text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="self-start mt-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg transition-all"
            >
              Return Book
            </button>
          </Form>
        ))}
      </div>
    </Modal>
  );
}

export default ReturnBookTransaction;
