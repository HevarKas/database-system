import Modal from '../modal';
import { Form } from '@remix-run/react';
import { Button } from '../ui/button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function LogoutComponent({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} header="Logout">
      <Form method="post" action="/logout" className="flex flex-col gap-4">
        <h2 className="text-l font-semibold">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
          >
            Logout
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default LogoutComponent;
