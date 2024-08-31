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
import Modal from '../../components/modal';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { getBookById, updateBook } from '~/api/endpoints/book';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { getCategory } from '~/api/endpoints/category';

type DataType = {
  id: number;
  name: string;
}[];

export type Book = {
  id: number;
  cover: string | null;
  barcode: string;
  name: string;
  description: string;
  category: string;
  author: string;
  translator: string;
  publish_year: number;
  cost: number;
  price: number;
  stock: number;
};

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
    description: formData.get('description') as string,
    author: formData.get('author') as string,
    translator: formData.get('translator') as string,
    publish_year: Number(formData.get('publish_year')),
    cost: Number(formData.get('cost')),
    price: Number(formData.get('price')),
    stock: Number(formData.get('stock')),
    category_id: Number(formData.get('category_id')),
    barcode: formData.get('barcode') as string,
  };

  const response = await updateBook(request, book, id);

  const searchParams = new URL(request.url).searchParams;

  if (response.ok) {
    return redirect(`/books?${searchParams}`);
  }

  return 'Failed to Update book';
};

function UpdateBook() {
  const { book, category }: { book?: Book; category?: DataType } =
    useLoaderData();
  const actionData = useActionData<string>();
  const isOpen = true;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  const handleClose = () => {
    navigate(`/books?${searchParams}`);
  };

  const handleBarcodeKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} header="Update Book">
      <Form method="post" className="flex flex-col gap-4 mx-3">
        {actionData && (
          <div className="bg-red-100 text-red-800 p-4 rounded">
            {actionData}
          </div>
        )}
        <Label htmlFor="name" className="dark:text-white">
          Name
        </Label>
        <Input
          type="text"
          defaultValue={book?.name}
          name="name"
          id="name"
          maxLength={50}
          required
        />

        <Label htmlFor="description" className="dark:text-white">
          Description
        </Label>
        <Input
          type="text"
          defaultValue={book?.description}
          name="description"
          id="description"
          maxLength={50}
          required
        />

        <Label htmlFor="author" className="dark:text-white">
          Author
        </Label>
        <Input
          type="text"
          defaultValue={book?.author}
          name="author"
          id="author"
          maxLength={50}
          required
        />

        <Label htmlFor="translator" className="dark:text-white">
          Translator
        </Label>
        <Input
          type="text"
          defaultValue={book?.translator}
          name="translator"
          id="translator"
          maxLength={50}
          required
        />

        <Label htmlFor="publish_year" className="dark:text-white">
          Publish Year
        </Label>
        <Input
          type="number"
          defaultValue={book?.publish_year}
          name="publish_year"
          id="publish_year"
          required
        />

        <Label htmlFor="cost" className="dark:text-white">
          Cost
        </Label>
        <Input
          type="number"
          defaultValue={book?.cost}
          name="cost"
          id="cost"
          required
        />

        <Label
          htmlFor="price"
          defaultValue={book?.price}
          className="dark:text-white"
        >
          Price
        </Label>
        <Input
          type="number"
          defaultValue={book?.price}
          name="price"
          id="price"
          required
        />

        <Label htmlFor="stock" className="dark:text-white">
          Stock
        </Label>
        <Input
          type="number"
          defaultValue={book?.stock}
          name="stock"
          id="stock"
          required
        />

        <Label htmlFor="category_id" className="dark:text-white">
          Category
        </Label>
        <Select name="category_id" required>
          <SelectTrigger>
            <SelectValue placeholder={book?.category || 'Select Category'} />
          </SelectTrigger>
          <SelectContent>
            {category?.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label htmlFor="barcode" className="dark:text-white">
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

export default UpdateBook;
