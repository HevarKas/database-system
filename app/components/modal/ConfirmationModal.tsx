import { Form } from "@remix-run/react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  customerName: string; 
  customerPhoneNumber: string;
  totalPrice: number;
  paidPrice: number;
}

export const ConfirmationModal = ({ isOpen, onCancel, customerName, customerPhoneNumber, totalPrice, paidPrice }: ConfirmationModalProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <Form method="post" className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <input type="hidden" name="customer_name" value={customerName} />
      <input type="hidden" name="customer_phone_number" value={customerPhoneNumber} />
      <input type="hidden" name="paid" value={paidPrice} />
      <input type="hidden" name="total" value={totalPrice} />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold">
          {t("orders.confirmOrder")}
        </h3>
        <div className="mt-4">
          <p>
            {t("orders.areYouSureYouWantToProceedWithTheOrder")}
          </p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button onClick={onCancel} variant="secondary"
            >Cancel</Button>
            <Button type="submit">
              {t("orders.confirm")}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
