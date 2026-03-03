import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Webcam from "react-webcam";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import extractBinaryFormData from "../../util/binaryFormUtil";
import axiosInstance from "../../util/axiosInstance";
import binaryAxiosInstance from "../../util/binaryAxiosInstance";
import styles from "./Requests.module.css";
import ToastMessage from "../../components/toast-message/ToastMessage";
import { FooterComponent } from "../../components/footer/Footer";

const { VITE_BASE_URL } = import.meta.env;

const Requests = (props) => {
  const [userData, setUserData] = useState({});
  const [show, setShow] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [confirmLocationShow, setConfirmLocationShow] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);


  const handleClose = () => {
    setShow(false);
    setCapturedImage(null);
  };

  function base64ToImageFile(
    base64String,
    fileName = "capture.png",
    mimeType = "image/png"
  ) {
    const base64Data = base64String.split(",")[1] || base64String;
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return new File([blob], fileName, { type: mimeType });
  }

  const getVideoConstraints = () => {
    const base = { width: 1280, height: 720 };
    if (selectedDeviceId) {
      return { ...base, deviceId: { exact: selectedDeviceId } };
    }
    return { ...base, facingMode: "user" };
  };

  const fetchAddressFromCoordinates = async (lat, lon) => {
    try {
      setLocationLoading(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );

      const data = await response.json();

      if (data?.display_name) {
        setLocationAddress(data.display_name);
      } else {
        setLocationAddress("Address not found");
      }
    } catch (error) {
      console.log(error);
      setLocationAddress("Unable to fetch address");
    } finally {
      setLocationLoading(false);
    }
  };


  // Initial form submit – only prepares data and shows confirmation modal
  const onFormSubmit = (event) => {
    event.preventDefault();
    if (!capturedImage) {
      setToastMessage("Please capture or select the image");
      setToastShow(true);
      return;
    }

    const imageFile = base64ToImageFile(
      capturedImage,
      `complaint-${new Date().getMilliseconds()}.png`
    );

    const data = extractBinaryFormData(event.target);
    const reqBody = new FormData();
    reqBody.append("description", data.description);
    reqBody.append("latitude", props?.location[0]);
    reqBody.append("longitude", props?.location[1]);
    reqBody.append("url", imageFile);

    // Save temporarily and show confirmation modal
    // Save temporarily and show confirmation modal
    setPendingFormData(reqBody);

    fetchAddressFromCoordinates(
      props?.location[0],
      props?.location[1]
    );

    setConfirmLocationShow(true);

  };

  // Actually submit after location confirmation
  const submitConfirmedComplaint = async () => {
    try {
      if (!pendingFormData) return;

      const response = await binaryAxiosInstance.post(
        `${VITE_BASE_URL}/complaint/add-complaint`,
        pendingFormData
      );

      setToastMessage(response.data.message);
      setToastShow(true);

      if (response.data.success) {
        setShow(false);
        getComplaints();
      }

      setCapturedImage(null);
      setPendingFormData(null);
      setConfirmLocationShow(false);
    } catch (error) {
      console.log(error);
      setPendingFormData(null);
      setConfirmLocationShow(false);
    }
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")));
  }, []);

  const getComplaints = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("userData"));
      let url = `${VITE_BASE_URL}/complaint/get-complaint`;

      if (userData.userType !== "admin") {
        url = `${VITE_BASE_URL}/complaint/get-complaint?user=${userData?._id}`;
      }

      let response = await axiosInstance.get(url);
      if (response?.data?.success) {
        setComplaints(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const followupComplaint = async (complainId) => {
    try {
      let response = await axiosInstance.get(
        `${VITE_BASE_URL}/complaint/followup-complaint?complainId=${complainId}`
      );
      setToastMessage(response.data.message);
      setToastShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const rejectComplaint = async (complainId) => {
    try {
      let response = await axiosInstance.put(
        `${VITE_BASE_URL}/complaint/reject-complaint?_id=${complainId}`,
        { status: "rejected" }
      );
      setToastMessage(response.data.message);
      setToastShow(true);
      getComplaints();
    } catch (error) {
      console.log(error);
    }
  };

  const enumerateCameras = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      setDevices([]);
      return;
    }

    let tempStream = null;
    try {
      tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(
        (d) => d.kind === "videoinput"
      );

      setDevices(videoDevices);
      if (videoDevices.length && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.log(err);
    } finally {
      tempStream?.getTracks().forEach((t) => t.stop());
    }
  };

  useEffect(() => {
    if (show) enumerateCameras();
  }, [show]);

  useEffect(() => {
    getComplaints();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* MAIN CONTENT */}
      <div className="flex-grow-1">
        <div className={`${styles.complaintsMainDiv} w-100`}>
          <div className="row p-0 m-0">
            {complaints?.length === 0 && (
              <div className="col-12 d-flex justify-content-center mt-4">
                <Card
                  style={{ height: "200px", width: "50%" }}
                  className="p-3 text-center border shadow text-primary"
                >
                  <h4>No complaints yet</h4>
                  {userData?.userType == "citizen" ? (
                    <p>You haven't raised any complaints.</p>
                  ) : (
                    <p>No Pothole Complaints Found!</p>
                  )}
                </Card>
              </div>
            )}

            {complaints?.length > 0 &&
              complaints.map((complaint, index) => (
                <div
                  key={index}
                  className="col-md-3 col-sm-12 p-1 d-flex justify-content-center"
                >
                  <Card style={{ height: "600px", width: "80%" }} className="p-2">
                    {complaint?.resolvedUrl ? (
                      <div className="h-50 w-100 d-flex">
                        <Card.Img className="h-100 w-50 p-1" src={complaint.url} />
                        <Card.Img className="h-100 w-50 p-1" src={complaint.resolvedUrl} />
                      </div>
                    ) : (
                      <Card.Img className="h-50 w-100 p-1" src={complaint.url} />
                    )}

                    <Card.Body style={{ height: "40%" }}>
                      <Card.Title>
                        <label
                          className={
                            complaint.status === "resolved"
                              ? "text-success"
                              : complaint.status === "rejected"
                                ? "text-danger"
                                : "text-warning"
                          }
                        >
                          Status: {complaint.status}
                        </label>
                      </Card.Title>

                      {complaint?.resolvedOn && (
                        <Card.Title>
                          Resolved On:{" "}
                          <label className="text-success">
                            {dayjs(complaint.resolvedOn).format("DD-MMM-YY")}
                          </label>
                        </Card.Title>
                      )}

                      <Card.Title>
                        Raised On:{" "}
                        <label className="text-warning">
                          {dayjs(complaint.createdAt).format("DD-MMM-YY")}
                        </label>
                      </Card.Title>

                      <Card.Text className="h-50">
                        {complaint.description}
                      </Card.Text>
                    </Card.Body>

                    <Card.Footer>
                      {userData.userType == "admin" && (
                        <button
                          className="btn btn-danger w-100"
                          disabled={
                            complaint.status === "rejected" ||
                            complaint.status === "resolved"
                          }
                          onClick={() => rejectComplaint(complaint._id)}
                        >
                          Reject
                        </button>
                      )}

                      {userData.userType !== "admin" && (
                        <>
                          {complaint.status === "pending" ? (
                            <button
                              className="btn btn-danger w-100"
                              onClick={() => {
                                followupComplaint(complaint?._id);
                              }}
                              disabled={
                                Math.max(
                                  5 -
                                  dayjs().diff(
                                    dayjs(complaint?.createdAt),
                                    "days"
                                  ),
                                  0
                                ) > 0
                              }
                            >
                              Follow Up?
                              {Math.max(
                                5 -
                                dayjs().diff(
                                  dayjs(complaint?.createdAt),
                                  "days"
                                ),
                                0
                              ) > 0
                                ? ` (In ${Math.max(
                                  5 -
                                  dayjs().diff(
                                    dayjs(complaint?.createdAt),
                                    "days"
                                  ),
                                  0
                                )} days)`
                                : ""}
                            </button>
                          ) : (
                            <button
                              className={`btn btn-${complaint.status === "resolved" ? "success" : "danger"
                                } w-100`}
                              disabled
                            >
                              {complaint.status}
                            </button>
                          )}
                        </>
                      )}
                    </Card.Footer>
                  </Card>
                </div>
              ))}
          </div>

          {userData.userType !== "admin" && (
            <button
              className={`btn btn-primary p-3 ${styles.complaintsButton}`}
              onClick={() => setShow(true)}
            >
              Add Complaint?
            </button>
          )}

          <Modal size="lg" centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Complaint</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={onFormSubmit} className="p-3">
                <select
                  className="form-select mb-3"
                  value={selectedDeviceId || ""}
                  onChange={(e) => {
                    setSelectedDeviceId(e.target.value || null);
                    setCapturedImage(null);
                  }}
                >
                  {devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Camera ${d.deviceId}`}
                    </option>
                  ))}
                </select>

                {/* Option to select image from gallery */}
                <div className="mb-3">
                  <label className="form-label">Or choose from gallery:</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setCapturedImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                {!capturedImage && (
                  <Webcam
                    audio={false}
                    height={240}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={getVideoConstraints()}
                  >
                    {({ getScreenshot }) => (
                      <button
                        type="button"
                        className="btn btn-info text-light w-100"
                        onClick={() =>
                          setCapturedImage(getScreenshot())
                        }
                      >
                        <i className="bi bi-camera-fill"></i>
                      </button>
                    )}
                  </Webcam>
                )}

                {capturedImage && (
                  <img src={capturedImage} className="img-fluid my-2" />
                )}

                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control mt-3"
                  required
                ></textarea>

                <button className="btn btn-primary mt-3 w-100">
                  Submit Complaint
                </button>
              </form>
            </Modal.Body>
          </Modal>

          {/* Confirmation Modal for location */}
          <Modal size="md"
            centered
            show={confirmLocationShow}
            onHide={() => setConfirmLocationShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Is this the correct location of the pothole?</p>
              <p>
                Latitude: <b>{props?.location?.[0]?.toFixed(4)}</b> <br />
                Longitude: <b>{props?.location?.[1]?.toFixed(4)}</b>
              </p>


              <hr />

              {locationLoading ? (
                <p><b>Fetching address...</b></p>
              ) : (
                <p>
                  <b>Exact Address:</b><br />
                  {locationAddress}
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmLocationShow(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={submitConfirmedComplaint}
              >
                Confirm & Submit
              </button>
            </Modal.Footer>
          </Modal>

          <ToastMessage
            show={toastShow}
            message={toastMessage}
            onClose={() => setToastShow(false)}
          />
        </div>
      </div>

      {/* FOOTER */}
      {userData.userType == "citizen" ?
        <FooterComponent />
        : ""
      }
    </div>
  );
};


export default Requests;
