import Modal from 'react-modal';
import styles from './ConfirmModal.module.css';

Modal.setAppElement('#root');

const ConfirmModal = ({
    isOpen,
    onConfirm,
    onCancel,
    message = "Sei sicuro?",
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel='Conferma azione'
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2>{message}</h2>
            <div className={styles.modalActions}>
                <button onClick={onConfirm} className={styles.confirmButton}>Si</button>
                <button onClick={onCancel} className={styles.cancelButton}>No</button>
            </div>
        </Modal>
    )
}


export default ConfirmModal