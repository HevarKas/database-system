import { useEffect, useRef } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Modal from '~/components/modal/modal';

import { tostActionType } from '~/shared/types/toast';
import { LoaderDataType } from '~/shared/types/pages/category';

import { updateCategory, getCategoryById } from '~/api/endpoints/category';

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
  const formData = await request.formData();

  const id = params.id;

  const name = formData.get('name') as string;

  try {
    await updateCategory({ request, name, id });

    return {
      type: 'success',
      toast: 'Category updated successfully!',
    };
  } catch {
    return {
      type: 'error',
      toast: 'Failed to update category.',
    };
  }
};

function UpdateCategory() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const actionData = useActionData<tostActionType>();
  const loaderData = useLoaderData<LoaderDataType>();
  const updateCategoryFormRef = useRef<HTMLFormElement>(null);

  const handleClose = () => {
    navigate('/category');
  };

  const handleSubmit = () => {
    if (updateCategoryFormRef.current) {
      updateCategoryFormRef.current.requestSubmit();
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
      header={t('category.updateCategory')}
      onSubmit={handleSubmit}
      submitLabel={t('category.update')}
      variant="warning"
    >
      <Form
        method="post"
        className="flex flex-col gap-4 mx-2"
        ref={updateCategoryFormRef}
      >
        <Label htmlFor="name">{t('category.categoryDetails.name')}</Label>
        <Input
          className="dark:text-black dark:bg-white"
          type="text"
          name="name"
          id="name"
          maxLength={50}
          defaultValue={loaderData.data.name}
          required
        />
      </Form>
    </Modal>
  );
}

export default UpdateCategory;
