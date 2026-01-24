import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import styles from "./ToastMessage.module.css";

export default function ToastMessage({ show, message, onClose }) {
    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast
                show={show}
                onClose={onClose}
                delay={5000}
                autohide
                className={styles.toast}
            >
                <Toast.Header className={styles.toastHeader}>
                    <strong className="me-auto">Fix My Road</strong>
                    <small>now</small>
                </Toast.Header>

                <Toast.Body className={styles.toastBody}>
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}
