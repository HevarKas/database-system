import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { redirect } from 'react-router';
import Modal from '../../components/modal/modal';
import { deleteBook, getBookById } from '~/api/endpoints/book';
import { useRef } from 'react';

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
  const deleteBookFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    if (deleteBookFormRef.current) {
      deleteBookFormRef.current.requestSubmit();
    }
  };

  const handleClose = () => {
    navigate(`/books?${searchParams}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header="Delete book"
      onSubmit={handleSubmit}
      submitLabel="Delete"
      variant="danger"
    >
      <Form
        method="post"
        className="flex flex-col gap-4"
        ref={deleteBookFormRef}
      >
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
      </Form>
    </Modal>
  );
}

export default DeleteBook;
