import { Label } from '@radix-ui/react-label';
import {
  Form,
  useActionData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { redirect } from 'react-router';
import { createCategory } from '~/api/endpoints/category';
import Modal from '~/components/modal';
import { Button } from '~/components/ui/button';
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
  const actionData = useActionData<string>();
  const isOpen = true;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  const handleClose = () => {
    navigate(`/category?${searchParams}`);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} header="Create Category">
      <Form method="post" className="flex flex-col gap-4">
        {actionData && (
          <div className="bg-red-100 text-red-800 p-4 rounded">
            {actionData}
          </div>
        )}
        <Label htmlFor="name" className="dark:text-white">
          Name
        </Label>
        <Input
          ref={inputRef}
          className="dark:text-black dark:bg-white"
          type="text"
          name="name"
          id="name"
          maxLength={50}
          required
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={handleClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default CreateCategory;
