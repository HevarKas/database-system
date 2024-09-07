import { useEffect, useRef } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import { toast } from 'react-toastify';

import Modal from '~/components/modal/modal';

import { tostActionType } from '~/shared/types/toast';
import { LoaderDataType } from '~/shared/types/pages/category';

import { deleteCategory, getCategoryById } from '~/api/endpoints/category';

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
  const id = params.id;
  const data = await getCategoryById(id, request);

  return { data };
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
    await deleteCategory(id, request);

    return {
      type: 'success',
      toast: 'Category deleted successfully!',
    };
  } catch {
    return {
      type: 'error',
      toast: 'Failed to delete category.',
    };
  }
};

function DeleteCategory() {
  const navigate = useNavigate();
  const actionData = useActionData<tostActionType>();
  const loaderData = useLoaderData<LoaderDataType>();
  const deleteCategoryFormRef = useRef<HTMLFormElement>(null);

  const handleClose = () => {
    navigate('/category');
  };

  const handleSubmit = () => {
    if (deleteCategoryFormRef.current) {
      deleteCategoryFormRef.current.requestSubmit();
    }
  };

  useEffect(() => {
    if (actionData) {
      if (actionData.type === 'success') {
        toast.success(actionData.toast);
        navigate('/category');
      } else {
        toast.error(actionData.toast);
      }
    }
  }, [actionData, navigate]);

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      header="Delete Category"
      onSubmit={handleSubmit}
      submitLabel="Delete"
      variant="danger"
    >
      <Form
        method="post"
        className="flex flex-col gap-4"
        ref={deleteCategoryFormRef}
      >
        <p>
          are you sure you want to delete this
          <span className="px-1 font-semibold">{loaderData.data.name}</span>
          category?
        </p>
      </Form>
    </Modal>
  );
}

export default DeleteCategory;
