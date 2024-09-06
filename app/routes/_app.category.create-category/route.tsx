import { Label } from '@radix-ui/react-label';
import { Form, useNavigate, useSearchParams } from '@remix-run/react';
import { useRef } from 'react';
import { redirect } from 'react-router';
import { createCategory } from '~/api/endpoints/category';
import Modal from '~/components/modal/modal';
import { Input } from '~/components/ui/input';

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const name = formData.get('name') as string;

  try {
    await createCategory({ request, name });
    const searchParams = new URL(request.url).searchParams;

    return redirect(`/category?${searchParams}`);
  } catch (error) {
    return 'Failed to create category';
  }
};

function CreateCategory() {
  const isOpen = true;
  const navigate = useNavigate();
  const createCategoryFormRef = useRef<HTMLFormElement>(null);
  const [searchParams] = useSearchParams();

  const handleClose = () => {
    navigate(`/category?${searchParams}`);
  };

  const handleSubmit = () => {
    if (createCategoryFormRef.current) {
      createCategoryFormRef.current.requestSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
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
        <Label htmlFor="name" className="dark:text-white">
          Name
        </Label>
        <Input type="text" name="name" id="name" maxLength={50} required />
      </Form>
    </Modal>
  );
}

export default CreateCategory;
