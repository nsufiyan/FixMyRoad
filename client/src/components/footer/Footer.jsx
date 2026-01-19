import { useState } from "react";
import ToastMessage from "../toast-message/ToastMessage"
export function FooterComponent() {
    const [toastShow, setToastShow] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    function handleClick() {
        setToastMessage("We are working on it")
        setToastShow(true)
    }
    return (<div className="mt-5" style={{ width: "100vw" }}>



        <div className="bg-dark text-white py-3">
            <div className="container">
                <div className="row gy-4">


                    <div className="col-12 col-md-3">
                        <h6 className="fw-bold mb-1">Fix My Road</h6>
                        <p className="small mb-1 fst-italic">Report - Fix - Improve</p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-6 col-md-2">
                        <h6 className="fw-bold mb-1">Quick Links</h6>
                        <ul className="list-unstyled small mb-1">
                            <li><a href="/dashboard" className="text-white text-decoration-none">Home</a></li>
                            <li><a href="/dashboard/requests" className="text-white text-decoration-none">Report Pothole</a></li>
                            <li><a href="/dashboard/contactus" className="text-white text-decoration-none">Help Center</a></li>
                        </ul>
                    </div>

                    {/* How It Works */}
                    <div className="col-6 col-md-2">
                        <h6 className="fw-bold mb-1">How It Works</h6>
                        <ul className="list-unstyled small mb-1">
                            <li><a href="/dashboard/Guide" className="text-white text-decoration-none">Step by Step Guide</a></li>
                            <li><a href="/dashboard/FAQ" className="text-white text-decoration-none">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="col-6 col-md-2">
                        <h6 className="fw-bold mb-1">Resources</h6>
                        <ul className="list-unstyled small mb-1">
                            <li><a href="/dashboard/roadSafety" className="text-white text-decoration-none">Road Safety Tips</a></li>

                        </ul>
                    </div>

                    {/* Disclaimer & Social */}
                    <div className="col-12 col-md-3">
                        <h6 className="fw-bold mb-1">Disclaimer & Contact</h6>
                        <p className="small mb-2">
                            Fix My Road is a non-governmental platform. All reports are submitted by users, and we cannot guarantee the actions of third parties.
                        </p>
                        <a href="mailto:fixmyroadteam@gmail.com" className="text-light text-decoration-none ">Email: fixmyroadteam@gmail.com</a>


                        <div className="d-flex gap-3 mt-1">
                            <a href="#" className="text-light fs-5" onClick={handleClick}>
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" className="text-light fs-5" onClick={handleClick}>
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" className="text-light fs-5" onClick={handleClick}>
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="#" className="text-light fs-5" onClick={handleClick} >
                                <i className="bi bi-whatsapp"></i>
                            </a>
                            <a href="#" className="text-light fs-5" onClick={handleClick}>
                                <i className="bi bi-linkedin"></i>
                            </a>
                            <a href="#" className="text-light fs-5" onClick={handleClick} >
                                <i className="bi bi-github"></i>
                            </a>

                        </div>
                    </div>

                </div>

                <hr className="border-light my-2" />

                <div className="text-center small">
                    Fix My Road 2025.
                </div>
            </div>
            <ToastMessage
                show={toastShow}
                message={toastMessage}
                onClose={() => setToastShow(false)}
            />
        </div>


    </div>
    )
}

