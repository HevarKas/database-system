import { Form } from '@remix-run/react';
import Modal from '~/components/modal/modal';
import { Button } from '~/components/ui/button';

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LogoutComponent = ({ isOpen, onClose }: LogoutModalProps) => {
  const cancelButtonClasses =
    'bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none';
  const logoutButtonClasses =
    'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none';

  return (
    <Modal isOpen={isOpen} onClose={onClose} header="Logout">
      <Form method="post" action="/logout" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            onClick={onClose}
            className={cancelButtonClasses}
          >
            Cancel
          </Button>
          <Button type="submit" className={logoutButtonClasses}>
            Logout
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default LogoutComponent;
