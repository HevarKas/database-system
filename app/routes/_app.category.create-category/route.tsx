import { useEffect, useRef } from 'react';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { toast } from 'react-toastify';

import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Modal from '~/components/modal/modal';

import { tostActionType } from '~/shared/types/toast';

import { createCategory } from '~/api/endpoints/category';

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;

  try {
    await createCategory({ request, name });
    return {
      type: 'success',
      toast: 'Category created successfully!',
    };
  } catch {
    return {
      type: 'error',
      toast: 'Failed to create category.',
    };
  }
};

function CreateCategory() {
  const navigate = useNavigate();
  const actionData = useActionData<tostActionType>();
  const createCategoryFormRef = useRef<HTMLFormElement>(null);

  const handleClose = () => {
    navigate('/category');
  };

  const handleSubmit = () => {
    createCategoryFormRef.current?.requestSubmit();
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
      header="Create Category"
      onSubmit={handleSubmit}
      submitLabel="Create"
      variant="success"
    >
      <Form
        method="post"
        className="flex flex-col gap-4 mx-2"
        ref={createCategoryFormRef}
      >
        <Label htmlFor="name">Name</Label>
        <Input type="text" name="name" id="name" maxLength={50} required />
      </Form>
    </Modal>
  );
}

export default CreateCategory;
