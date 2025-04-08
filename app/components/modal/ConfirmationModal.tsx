import { Form } from "@remix-run/react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface Book {
  id: number;
  price: number;
  quantity: number;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  customerName: string;
  customerPhoneNumber: string;
  paidPrice: number;
  books: Book[];
  disabled: boolean;
}

export const ConfirmationModal = ({ isOpen, onCancel, customerName, customerPhoneNumber, paidPrice, books, disabled }: ConfirmationModalProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const formData = [
    { key: "paid", value: paidPrice.toString(), type: "text" },
    { key: "customer_name", value: customerName, type: "text" },
    { key: "customer_phone_number", value: customerPhoneNumber, type: "text" },
    ...books.map((book, index) => [
      { key: `books[${index}][id]`, value: book.id.toString(), type: "text" },
      { key: `books[${index}][price]`, value: book.price.toString(), type: "text" },
      { key: `books[${index}][quantity]`, value: book.quantity.toString(), type: "text" },
    ]).flat(),
  ];

  return (
    <Form method="post" className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      {formData.map(({ key, value }) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold">{t("orders.confirmOrder")}</h3>
        <div className="mt-4">
          <p>{t("orders.areYouSureYouWantToProceedWithTheOrder")}</p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button onClick={onCancel} variant="secondary">Cancel</Button>
            <Button type="submit" disabled={disabled}>
              {t("orders.confirm")}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
