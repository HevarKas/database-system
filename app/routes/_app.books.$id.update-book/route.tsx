import { useEffect, useRef } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { toast } from 'react-toastify';

import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Modal from '~/components/modal/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { tostActionType } from '~/shared/types/toast';
import { BookGetDataType } from '~/shared/types/pages/book';
import { CategoryGetDataType } from '~/shared/types/pages/category';

import { getCategory } from '~/api/endpoints/category';
import { getBookById, updateBook } from '~/api/endpoints/book';

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
  const id = params.id;
  const book = await getBookById(id, request);
  const category = await getCategory(request);

  return { book, category };
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

  const book = {
    name: formData.get('name') as string,
    description: 'Soon will be deleted',
    author: formData.get('author') as string,
    translator: formData.get('translator') as string,
    publish_year: Number(formData.get('publish_year')),
    cost: Number(formData.get('cost')),
    price: Number(formData.get('price')),
    stock: Number(formData.get('stock')),
    category_id: Number(formData.get('category_id')),
    barcode: formData.get('barcode') as string,
  };

  try {
    await updateBook(request, book, id);

    return {
      type: 'success',
      toast: 'Book updated successfully!',
    };
  } catch {
    return {
      type: 'error',
      toast: 'Failed to update book.',
    };
  }
};

function UpdateBook() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<tostActionType>();
  const {
    book,
    category,
  }: { book?: BookGetDataType; category?: CategoryGetDataType } =
    useLoaderData();
  const updateBookFormRef = useRef<HTMLFormElement>(null);

  console.log('book', book);

  const handleClose = () => {
    navigate(`/books?${searchParams}`);
  };

  const handleSubmit = () => {
    if (updateBookFormRef.current) {
      updateBookFormRef.current.requestSubmit();
    }
  };

  const handleBarcodeKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
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
      header="Update Book"
      onSubmit={handleSubmit}
      submitLabel="Update"
      variant="warning"
    >
      <Form method="post" className="space-y-6 p-2" ref={updateBookFormRef}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label
              htmlFor="name"
              className="text-lg font-semibold dark:text-white"
            >
              Name
            </Label>
            <Input
              type="text"
              defaultValue={book?.name}
              name="name"
              id="name"
              maxLength={50}
              required
              className="p-3 border rounded-md"
            />
          </div>
          <div>
            <Label
              htmlFor="author"
              className="text-lg font-semibold dark:text-white"
            >
              Author
            </Label>
            <Input
              type="text"
              defaultValue={book?.author}
              name="author"
              id="author"
              maxLength={50}
              required
              className="p-3 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label
              htmlFor="translator"
              className="text-lg font-semibold dark:text-white"
            >
              Translator
            </Label>
            <Input
              type="text"
              defaultValue={book?.translator}
              name="translator"
              id="translator"
              maxLength={50}
              required
              className="p-3 border rounded-md"
            />
          </div>
          <div>
            <Label
              htmlFor="publish_year"
              className="text-lg font-semibold dark:text-white"
            >
              Publish Year
            </Label>
            <Input
              type="number"
              defaultValue={book?.publish_year}
              name="publish_year"
              id="publish_year"
              required
              className="p-3 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label
              htmlFor="cost"
              className="text-lg font-semibold dark:text-white"
            >
              Cost
            </Label>
            <Input
              type="number"
              defaultValue={book?.cost}
              name="cost"
              id="cost"
              required
              className="p-3 border rounded-md"
            />
          </div>
          <div>
            <Label
              htmlFor="price"
              className="text-lg font-semibold dark:text-white"
            >
              Price
            </Label>
            <Input
              type="number"
              defaultValue={book?.price}
              name="price"
              id="price"
              required
              className="p-3 border rounded-md"
            />
          </div>
          <div>
            <Label
              htmlFor="stock"
              className="text-lg font-semibold dark:text-white"
            >
              Stock
            </Label>
            <Input
              type="number"
              defaultValue={book?.stock}
              name="stock"
              id="stock"
              required
              className="p-3 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label
              htmlFor="category_id"
              className="text-lg font-semibold dark:text-white"
            >
              Category
            </Label>
            <Select name="category_id" required>
              <SelectTrigger>
                <SelectValue
                  placeholder={book?.category || 'Select Category'}
                />
              </SelectTrigger>
              <SelectContent>
                {category?.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="barcode"
              className="text-lg font-semibold dark:text-white"
            >
              Barcode
            </Label>
            <Input
              type="text"
              name="barcode"
              defaultValue={book?.barcode}
              id="barcode"
              maxLength={50}
              required
              onKeyDown={handleBarcodeKeyDown}
              className="p-3 border rounded-md"
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default UpdateBook;
