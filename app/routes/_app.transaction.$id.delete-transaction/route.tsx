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

import Modal from '~/components/modal/modal';
import { useLanguage } from '~/contexts/LanguageContext';

import { tostActionType } from '~/shared/types/toast';

import { deleteOrder, getOrderById } from '~/api/endpoints/orders';
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

    throw new Response('Unable to load the order. Please try again later.', { status: 500 });
  }
};


export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
  const id = params.id;

  try {
    await deleteOrder(id, request);

    return {
      type: 'success',
      toast: 'order deleted successfully!',
    };
  } catch {
    return {
      type: 'error',
      toast: 'Failed to delete order.',
    };
  }
};

function DeleteTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<tostActionType>();
  const loaderData = useLoaderData<{ data: transactionType }>();
  const deleteOrderFormRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();
  const { rtl } = useLanguage();

  const handleClose = () => {
    navigate(`/transaction?${searchParams}`);
  };

  const handleSubmit = () => {
    if (deleteOrderFormRef.current) {
        deleteOrderFormRef.current.requestSubmit();
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
      header={t('transaction.deleteTransaction')}
      onSubmit={handleSubmit}
      submitLabel={t('transaction.delete')}
      variant="danger"
    >
      <Form
        method="post"
        className="flex flex-col gap-4"
        ref={deleteOrderFormRef}
      >
        <p>
          {t('transaction.doyouwanttodeletethisTransaction')}
          <span className="px-1 font-semibold">{loaderData.data.customer_name}</span>
          {rtl ? '؟' : '?'}
        </p>
      </Form>
    </Modal>
  );
}

export default DeleteTransaction;
