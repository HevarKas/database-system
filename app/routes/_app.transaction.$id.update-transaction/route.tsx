import { useEffect, useRef } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Modal from '~/components/modal/modal';

import { getOrderById, updateOrder } from '~/api/endpoints/orders';
import { transactionType } from '~/shared/types/pages/orders';
import { tostActionType } from '~/shared/types/toast';

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
    console.error('Error fetching order data:', error);
    throw new Response('Unable to load order data. Please try again later.', {
      status: 500,
    });
  }
};

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
  const formData = await request.formData();
  const id = params.id;

  const formDataToSend = new FormData();
  formDataToSend.append('paid', formData.get('paid') as string);
  formDataToSend.append('total', formData.get('total') as string);
  formDataToSend.append('_method', 'PATCH');

  try {
    await updateOrder(request, formDataToSend, id);

    return {
      type: 'success',
      toast: 'Transaction updated successfully!',
    };
  } catch {
    return {
      type: 'error',
      toast: 'Failed to update transaction.',
    };
  }
};

function UpdateTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<tostActionType>();
  const loaderData = useLoaderData<{ data: transactionType }>();
  const { t } = useTranslation();
  const updateTransactionFormRef = useRef<HTMLFormElement>(null);

  const handleClose = () => {
    navigate(`/transaction?${searchParams}`);
  };

  const handleSubmit = () => {
    if (updateTransactionFormRef.current) {
      updateTransactionFormRef.current.requestSubmit();
    }
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
      header={t('transaction.updateTransaction')}
      onSubmit={handleSubmit}
      submitLabel={t('transaction.update')}
      variant="warning"
    >
      <Form
        method="post"
        className="space-y-6 p-2"
        ref={updateTransactionFormRef}
        encType="multipart/form-data"
      >
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="paid"
            className="text-lg font-semibold dark:text-white"
          >
            {t('transaction.paid')}
          </Label>
          <Input
            type="number"
            defaultValue={loaderData?.data.paid}
            name="paid"
            id="paid"
            required
            className="p-3 border rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="total"
            className="text-lg font-semibold dark:text-white"
          >
            {t('transaction.total')}
          </Label>
          <Input
            type="number"
            defaultValue={loaderData?.data.total}
            name="total"
            id="total"
            required
            className="p-3 border rounded-md"
          />
        </div>
      </Form>
    </Modal>
  );
}

export default UpdateTransaction;
