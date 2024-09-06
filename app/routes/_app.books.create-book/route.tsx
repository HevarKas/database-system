import { Label } from '@radix-ui/react-label';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { redirect } from 'react-router';
import { createBook } from '~/api/endpoints/book';
import { getCategory } from '~/api/endpoints/category';
import Modal from '~/components/modal/modal';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

type DataType = {
  id: number;
  name: string;
}[];

// loader
export const loader = async ({ request }: { request: Request }) => {
  const data = await getCategory(request);

  return { data };
};

// action
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

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

  try {
    await createBook(request, book);
    const searchParams = new URL(request.url).searchParams;

    return redirect(`/books?${searchParams}`);
  } catch (error) {
    return 'Failed to create category';
  }
};

function CreateCategory() {
  const { data }: { data?: DataType } = useLoaderData();
  const actionData = useActionData<string>();
  const isOpen = true;
  const navigate = useNavigate();
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} header="Create Category">
      <Form method="post" className="flex flex-col gap-4 mx-3">
        {actionData && (
          <div className="bg-red-100 text-red-800 p-4 rounded">
            {actionData}
          </div>
        )}
        <Label htmlFor="name" className="dark:text-white">
          Name
        </Label>
        <Input type="text" name="name" id="name" maxLength={50} required />

        <Label htmlFor="description" className="dark:text-white">
          Description
        </Label>
        <Input
          type="text"
          name="description"
          id="description"
          maxLength={50}
          required
        />

        <Label htmlFor="author" className="dark:text-white">
          Author
        </Label>
        <Input type="text" name="author" id="author" maxLength={50} required />

        <Label htmlFor="translator" className="dark:text-white">
          Translator
        </Label>
        <Input
          type="text"
          name="translator"
          id="translator"
          maxLength={50}
          required
        />

        <Label htmlFor="publish_year" className="dark:text-white">
          Publish Year
        </Label>
        <Input type="number" name="publish_year" id="publish_year" required />

        <Label htmlFor="cost" className="dark:text-white">
          Cost
        </Label>
        <Input type="number" name="cost" id="cost" required />

        <Label htmlFor="price" className="dark:text-white">
          Price
        </Label>
        <Input type="number" name="price" id="price" required />

        <Label htmlFor="stock" className="dark:text-white">
          Stock
        </Label>
        <Input type="number" name="stock" id="stock" required />

        <Label htmlFor="category_id" className="dark:text-white">
          Category
        </Label>
        <Select name="category_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {data &&
              data.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
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
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default CreateCategory;
