import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../util/axiosInstance";
import Modal from "react-bootstrap/Modal";
import Header from "../header/Header";
import styles from "./MainLayout.module.css";
import ToastMessage from "../../components/toast-message/ToastMessage";

const { VITE_BASE_URL } = import.meta.env;

const MainLayout = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const handleClose = () => {
    setShow(!show);
  };

  const logout = async () => {
    try {
      let response = await axiosInstance.post(
        `${VITE_BASE_URL}/user/logout`,
        {}
      );
      setToastMessage(response?.data?.message)
      setToastShow(true)
      // alert(response.data.message);
      if (response.data.success) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    < >
      <div className={`${styles.dashboardMain} `} >

        <div className={`${styles.headerMain}`} >
          <Header handleClose={handleClose} show={show} setShow={setShow} />
        </div>
        <div className={`${styles.mainContent} `}>
          <Outlet />
        </div>


        {/* Logout Modal */}
        {show && (
          <Modal show={show} onHide={handleClose} animation size="sm">
            <Modal.Header closeButton>
              <span className="text-center text-danger">Confirm logout?</span>
            </Modal.Header>

            <Modal.Footer>
              <button className="btn btn-danger w-100" onClick={logout}>
                <i className="bi-box-arrow-left"></i> Logout
              </button>
            </Modal.Footer>
          </Modal>
        )}

        <ToastMessage
          show={toastShow}
          message={toastMessage}
          onClose={() => setToastShow(false)}
        />
      </div >
    </>
  );
};

export default MainLayout;
