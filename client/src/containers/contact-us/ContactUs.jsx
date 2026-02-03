import { useState } from "react";
import axiosInstance from "../../util/axiosInstance";
import ToastMessage from "../../components/toast-message/ToastMessage";
import { FooterComponent } from "../../components/footer/Footer";
const { VITE_BASE_URL } = import.meta.env;
export function ContactUs() {
    const [toastShow, setToastShow] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    async function handleFormSubmit(e) {
        e.preventDefault()
        let data = {}
        let formData = new FormData(e.target);
        for (let [key, values] of formData) {
            data[key] = values;
        }
        const respond = await axiosInstance.post(`${VITE_BASE_URL}/contactUs/message`, data);

        setToastMessage(respond?.data?.message)
        setToastShow(true)

    }

    return (
        <div className="d-flex flex-column min-vh-100">

            <div className="d-flex justify-content-center align-items-center flex-column flex-grow-1 py-5 px-3">
                <div className="card shadow rounded-3 w-100" style={{ maxWidth: "500px" }}>
                    <div className="card-title h3 text-center mt-3 text-primary">
                        <i className="bi bi-person-lines-fill"></i> Contact Us
                    </div>
                    <div className="card-body">

                        <form className="mt-2" onSubmit={handleFormSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    required
                                    placeholder="Name"
                                />
                                <label>Name:</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    required
                                    placeholder="Email"
                                />
                                <label>Email:</label>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Message</label>
                                <textarea
                                    className="form-control mt-1"
                                    name="message"
                                    rows="6"
                                    required
                                    placeholder="Type Your Message"
                                ></textarea>
                            </div>

                            <button className="btn btn-outline-primary w-100" type="submit">
                                <i className="bi bi-send-fill"></i> Send Message
                            </button>
                        </form>

                    </div>
                </div>

                <ToastMessage
                    show={toastShow}
                    message={toastMessage}
                    onClose={() => setToastShow(false)}
                />
            </div>

            <FooterComponent />
        </div>

    )
}