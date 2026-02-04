import { useState } from "react";
import { useNavigate } from "react-router-dom";
import extractFormData from "../../util/formUtil";
import axiosInstance from "../../util/axiosInstance";
import ToastMessage from "../../components/toast-message/ToastMessage";
const { VITE_BASE_URL } = import.meta.env;
import "./Signup.css";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const onFormSubmit = async (event) => {
    try {
      event.preventDefault();
      let data = extractFormData(event.target);
      let response = await axiosInstance.post(`${VITE_BASE_URL}/user/add-user`, data);

      alert(response.data.message);

      if (response?.data?.success) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  }



  return (
    <div className="background-img d-flex justify-content-center align-items-center vh-100  vw-100 bg-light signup-page" >
      <div
        className="container p-0 shadow-lg rounded-4 overflow-hidden animate-container"
        style={{ maxWidth: "700px", height: "700" }}
      >
        <div className="row g-0">

          {/* LEFT PANEL */}

          <div className="fixmyroad-logo">
            🛣 FixMyRoad
          </div>

          <div
            className="col-md-6 d-flex flex-column justify-content-center text-white p-5 left-panel"
            style={{
              background: "linear-gradient(135deg, #0f2a44, #1e5aa8)"
            }}
          >
            <h2 className="fw-bold mb-3 animate-fade-up">
              Join FixMyRoad
            </h2>

            <p className="mb-4 animate-fade-up delay-1">
              Join us! Create an account to report potholes and help make your city safer.
            </p>

            <p className="animate-fade-up delay-2">
              Already have an account?
            </p>


            <button
              className="btn btn-outline-light px-4 login-btn-outline animate-pulse"
              onClick={() => navigate("/")}
            >
              <i className="bi bi-box-arrow-in-left"></i> LOGIN
            </button>
            <div className="road-line"></div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-md-6 bg-white p-4 p-md-5 right-panel">
            <h3 className="fw-bold mb-4 text-center animate-fade-down">
              Create Account
            </h3>

            <form onSubmit={onFormSubmit} className="animate-fade-in delay-1">

              <div className="form-floating mb-3 animated-input">
                <input
                  name="name"
                  className="form-control"
                  placeholder=""
                  required
                />
                <label><i className="bi bi-person-fill"></i> Name</label>
              </div>

              <div className="form-floating mb-3 animated-input">
                <input
                  name="email"
                  className="form-control"
                  placeholder=""
                  required
                />
                <label><i className="bi bi-envelope-at-fill"></i> Email</label>
              </div>

              <div className="form-floating mb-3 animated-input">
                <input
                  name="phone"
                  className="form-control"
                  placeholder=""
                  required
                />
                <label><i className="bi bi-telephone-fill"></i> Phone</label>
              </div>

              <div className="form-floating mb-3 position-relative animated-input">
                <input
                  name="password"
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  required
                />

                <i
                  className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} password-eye`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>

                <label><i className="bi bi-lock-fill"></i> Password</label>
              </div>

              <div className="mb-3 text-start animated-input">
                <label className="form-label">
                  <i className="bi bi-geo-alt-fill"></i> Address
                </label>
                <textarea
                  name="address"
                  className="form-control"
                  required
                ></textarea>
              </div>

              <button
                className="btn w-100 text-white mt-2 signup-btn"
                type="submit"
                style={{ background: "#2b40ffff" }}
              >
                <i className="bi bi-person-plus-fill"></i> SIGN UP  </button>

            </form>

          </div>
        </div>
      </div>

      <ToastMessage
        show={toastShow}
        message={toastMessage}
        onClose={() => setToastShow(false)}
      />
    </div>

  );
}
export default Signup