import { Form } from "@remix-run/react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  totalCost: number;
  totalPrice: number;
}

export const ConfirmationModal = ({ isOpen, onCancel, totalCost, totalPrice }: ConfirmationModalProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <Form method="post" className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <input type="hidden" name="customer_name" value="customer" />
      <input type="hidden" name="customer_phone_number" value="123456789" />
      <input type="hidden" name="paid" value={totalCost} />
      <input type="hidden" name="total" value={totalPrice} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
