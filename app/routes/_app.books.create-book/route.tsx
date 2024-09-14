import { useEffect, useRef, useState } from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

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

import { createBook } from '~/api/endpoints/book';
import { getCategory } from '~/api/endpoints/category';
import { CategoryGetDataType } from '~/shared/types/pages/category';
import { tostActionType } from '~/shared/types/toast';

export const loader = async ({ request }: { request: Request }) => {
  const data = await getCategory(request);

  return { data };
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const formDataToSend = new FormData();

  formDataToSend.append('name', formData.get('name') as string);
  formDataToSend.append('description', 'soon will be deleted');
  formDataToSend.append('author', formData.get('author') as string);
  formDataToSend.append('translator', formData.get('translator') as string);
  formDataToSend.append('publish_year', formData.get('publish_year') as string);
  formDataToSend.append('cost', formData.get('cost') as string);
  formDataToSend.append('price', formData.get('price') as string);
  formDataToSend.append('stock', formData.get('stock') as string);
  formDataToSend.append('category_id', formData.get('category_id') as string);
  formDataToSend.append('barcode', formData.get('barcode') as string);
  formDataToSend.append('cover_image', formData.get('cover_image') as File);

  try {
    await createBook(request, formDataToSend);

    return {
      type: 'success',
      toast: 'Book created successfully!',
    };
  } catch {
    return {
      type: 'error',
      toast: 'Failed to create book.',
    };
  }
};

function CreateCategory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<tostActionType>();
  const createBookFormRef = useRef<HTMLFormElement>(null);
  const { data }: { data?: CategoryGetDataType } = useLoaderData();
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const { t } = useTranslation();

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = () => {
    if (createBookFormRef.current) {
      createBookFormRef.current.requestSubmit();
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
      header={t('books.createBook')}
      onSubmit={onSubmit}
      submitLabel={t('books.create')}
    >
      <Form
        method="post"
        className="space-y-6 p-2"
        ref={createBookFormRef}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="name"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.name')}
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              maxLength={50}
              required
              className="p-3 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="author"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.author')}
            </Label>
            <Input
              type="text"
              name="author"
              id="author"
              maxLength={50}
              required
              className="p-3 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="translator"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.translator')}
            </Label>
            <Input
              type="text"
              name="translator"
              id="translator"
              maxLength={50}
              required
              className="p-3 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="publish_year"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.publishYear')}
            </Label>
            <Input
              type="number"
              name="publish_year"
              id="publish_year"
              required
              className="p-3 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="cost"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.cost')}
            </Label>
            <Input
              type="number"
              name="cost"
              id="cost"
              required
              className="p-3 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="price"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.price')}
            </Label>
            <Input
              type="number"
              name="price"
              id="price"
              required
              className="p-3 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="stock"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.stock')}
            </Label>
            <Input
              type="number"
              name="stock"
              id="stock"
              required
              className="p-3 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="category_id"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.category')}
            </Label>
            <Select name="category_id" required>
              <SelectTrigger>
                <SelectValue
                  placeholder={t('books.bookDetails.selectCategory')}
                />
              </SelectTrigger>
              <SelectContent>
                {data?.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="barcode"
              className="text-lg font-semibold dark:text-white"
            >
              {t('books.bookDetails.barcode')}
            </Label>
            <Input
              type="text"
              name="barcode"
              id="barcode"
              maxLength={50}
              required
              onKeyDown={handleBarcodeKeyDown}
              className="p-3 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex flex-col gap-4">
              <Label
                htmlFor="cover_image"
                className="text-lg font-semibold dark:text-white"
              >
                {t('books.bookDetails.coverImage')}
              </Label>
              <input
                type="file"
                id="cover_image"
                name="cover_image"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-center items-center">
              <img src={imagePreview} alt="Book Cover" className="w-24 h-24" />
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default CreateCategory;
