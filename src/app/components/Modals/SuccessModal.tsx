// components/dashboard/Modals/SuccessModal.tsx
import Modal from "react-modal";
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Student Added"
      className="modal bitemogi-popup"
      overlayClassName="overlay"
    >
      <div className="form-image-container">
        <img src="/images/bitemogi.png" alt="bitemogi" className="bitemogi-img" />
        <p className="form-image-caption">😊 Smile you have been Added!</p>
      </div>
    </Modal>
  );
}