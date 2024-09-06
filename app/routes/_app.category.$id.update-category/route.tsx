import { Label } from '@radix-ui/react-label';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { redirect } from 'react-router';
import { updateCategory, getCategoryById } from '../../api/endpoints/category';
import Modal from '../../components/modal/modal';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

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

  const response = await updateCategory({ request, name, id });

  const searchParams = new URL(request.url).searchParams;

  if (response.ok) {
    return redirect(`/category?${searchParams}`);
  }

  return 'Failed to Update category';
};

function UpdateCategory() {
  const loaderData = useLoaderData<{ data: { name: string } }>();
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
    <Modal isOpen={isOpen} onClose={handleClose} header="Update Category">
      <Form method="post" className="flex flex-col gap-4 mx-2">
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
          defaultValue={loaderData.data.name}
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
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default UpdateCategory;
