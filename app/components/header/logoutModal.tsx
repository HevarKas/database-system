import { Form } from '@remix-run/react';
import { useRef } from 'react';
import Modal from '~/components/modal/modal';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutComponent = ({ isOpen, onClose }: LogoutModalProps) => {
  const logoutFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    if (logoutFormRef.current) {
      logoutFormRef.current.requestSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Logout"
      submitLabel="Logout"
      onSubmit={handleSubmit}
      variant="danger"
    >
      <Form
        method="post"
        action="/logout"
        ref={logoutFormRef}
        className="flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold">
          Are you sure you want to logout?
        </h2>
      </Form>
    </Modal>
  );
};

export default LogoutComponent;
