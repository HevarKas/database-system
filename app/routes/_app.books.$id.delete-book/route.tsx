import { useEffect, useRef } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { toast } from 'react-toastify';

import Modal from '~/components/modal/modal';

import { tostActionType } from '~/shared/types/toast';
import { BookGetDataType } from '~/shared/types/pages/book';

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

  try {
    await deleteBook(id, request);

    return {
      type: 'success',
      toast: 'Book deleted successfully!',
    };
  } catch {
    return {
      type: 'error',
      toast: 'Failed to delete book.',
    };
  }
};

function DeleteBook() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<tostActionType>();
  const loaderData = useLoaderData<{ data: BookGetDataType }>();
  const deleteBookFormRef = useRef<HTMLFormElement>(null);

  const handleClose = () => {
    navigate(`/books?${searchParams}`);
  };

  const handleSubmit = () => {
    if (deleteBookFormRef.current) {
      deleteBookFormRef.current.requestSubmit();
    }
  };

  useEffect(() => {
    if (actionData) {
      if (actionData.type === 'success') {
        toast.success(actionData.toast);
        navigate(`/books?${searchParams}`);
      } else {
        toast.error(actionData.toast);
      }
    }
  }, [actionData, navigate, searchParams]);

  return (
    <Modal
      isOpen={true}
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
