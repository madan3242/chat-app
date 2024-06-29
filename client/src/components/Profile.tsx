import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, useEffect } from "react";

const Profile: FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open) return;
  }, [open]);

  return (
    <Transition.Root show={open}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-visible">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 "
              enterTo="opacity-100 translate-y-0 sm:scale-95"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform overflow-x-hidden rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all bg-purple-400 sm:my-8 sm:w-full sm:max-w-3xl sm:p-6"
                style={{
                  overflow: "inherit",
                }}
              >
                <Dialog.Title as="h3">Profile</Dialog.Title>
                <button onClick={() => handleClose()}>
                  <XMarkIcon className="h-6 w-6" aria-hidden />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Profile;
