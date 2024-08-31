import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { redirect } from 'react-router';
import Modal from '../../components/modal';
import { Button } from '../../components/ui/button';
import { deleteBook, getBookById } from '~/api/endpoints/book';

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
  const id = params.id;
  const data = await getBookById(id, request);

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

  const response = await deleteBook(id, request);

  const searchParams = new URL(request.url).searchParams;

  if (response.ok) {
    return redirect(`/books?${searchParams}`);
  }

  return 'Failed to Update book';
};

function DeleteBook() {
  const loaderData = useLoaderData<{ data: { name: string } }>();
  const actionData = useActionData<string>();
  const isOpen = true;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleClose = () => {
    navigate(`/books?${searchParams}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} header="Delete book">
      <Form method="post" className="flex flex-col gap-4">
        {actionData && (
          <div className="bg-red-100 text-red-800 p-4 rounded">
            {actionData}
          </div>
        )}
        <p>
          are you sure you want to delete this
          <span className="px-1 font-semibold">{loaderData.data.name}</span>
          book?
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

export default DeleteBook;
