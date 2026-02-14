import { useState, useEffect } from "react";
import axiosInstance from "../../util/axiosInstance";
import extractFormData from "../../util/formUtil";
import style from "./Profile.module.css";
import ToastMessage from "../../components/toast-message/ToastMessage";
import { FooterComponent } from "../../components/footer/Footer";

const { VITE_BASE_URL } = import.meta.env;

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({});
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const getSessionData = async () => {
    try {
      let response = await axiosInstance.post(
        `${VITE_BASE_URL}/user/validate-session`,
        {}
      );
      if (response.data.data) setUser(response.data.data);
      else {
        setToastMessage(response.data.message);
        setToastShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSessionData();
  }, []);

  const onFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = extractFormData(event.target);
      let response = await axiosInstance.put(
        `${VITE_BASE_URL}/user/update-user?_id=${user._id}`,
        data
      );
      setToastMessage(response.data.message);
      setToastShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.pageWrapper}>

      <div className={`container py-5 ${style.profileMain}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">

            <div className={`card shadow-lg rounded-4 overflow-hidden ${style.profileCard}`}>


              <div className={style.profileHeader}>
                <h3 className="mb-1">{user.name || "User Name"}</h3>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <span className="badge bg-warning text-dark">
                    {user.userType || "Citizen"}
                  </span>
                  <span className="fw-semibold">
                    ⭐ {user.points || 0} Points
                  </span>
                </div>
              </div>


              <div className="card-body p-4">
                <form onSubmit={onFormSubmit} className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      name="name"
                      className="form-control"
                      placeholder="Enter new name"
                      required
                      defaultValue={user.name}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter new email"
                      className="form-control"
                      required
                      defaultValue={user.email}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      name="phone"
                      className="form-control"
                      placeholder="Enter new phone number"
                      required
                      defaultValue={user.phone}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter new password"
                        defaultValue={user.password}
                      />
                      <span
                        className="input-group-text bg-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}></i>
                      </span>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows={3}
                      placeholder="Enter new address"
                      required
                      defaultValue={user.address}
                    />
                  </div>

                  <div className="col-12">
                    <button type="submit" className={`btn w-100 py-2 ${style.btnGradient}`}>
                      Update Profile
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>


      <FooterComponent />

      <ToastMessage
        show={toastShow}
        message={toastMessage}
        onClose={() => setToastShow(false)}
      />
    </div>
  );
};

export default Profile;
