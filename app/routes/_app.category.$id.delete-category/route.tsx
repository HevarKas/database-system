import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { redirect } from 'react-router';
import { deleteCategory, getCategoryById } from '../../api/endpoints/category';
import Modal from '../../components/modal/modal';
import { Button } from '../../components/ui/button';

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

  const response = await deleteCategory(id, request);

  const searchParams = new URL(request.url).searchParams;

  if (response.ok) {
    return redirect(`/category?${searchParams}`);
  }

  return 'Failed to Update category';
};

function DeleteCategory() {
  const loaderData = useLoaderData<{ data: { name: string } }>();
  const actionData = useActionData<string>();
  const isOpen = true;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleClose = () => {
    navigate(`/category?${searchParams}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} header="Delete Category">
      <Form method="post" className="flex flex-col gap-4">
        {actionData && (
          <div className="bg-red-100 text-red-800 p-4 rounded">
            {actionData}
          </div>
        )}
        <p>
          are you sure you want to delete this
          <span className="px-1 font-semibold">{loaderData.data.name}</span>
          category?
        </p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={handleClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </Button>
          <Button type="submit">Delete</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default DeleteCategory;
