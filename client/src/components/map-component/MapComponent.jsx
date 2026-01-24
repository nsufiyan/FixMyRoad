import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Webcam from "react-webcam";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import extractBinaryFormData from "../../util/binaryFormUtil";
import binaryAxiosInstance from "../../util/binaryAxiosInstance";
import ToastMessage from "../../components/toast-message/ToastMessage";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";

const { VITE_BASE_URL } = import.meta.env;



function FitMapToLocations({ location, markers }) {
  const map = useMap();

  useEffect(() => {
    const points = [];

    if (location?.length === 2) {
      points.push(location);
    }

    markers.forEach((m) => {
      points.push([m.position.lat, m.position.lng]);
    });

    if (points.length > 0) {
      map.fitBounds(points, { padding: [50, 50] });
    }
  }, [location, markers, map]);

  return null;
}


export default function MapComponent({ location, initialMarkers }) {
  const [markers, setMarkers] = useState([]);
  const [show, setShow] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [capturedImage, setCapturedImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  /* -------- FIXED: map complaints to markers -------- */
  useEffect(() => {
    if (!initialMarkers || initialMarkers.length === 0) {
      setMarkers([]);
      return;
    }

    const mapped = initialMarkers.map((ele, index) => ({
      id: ele._id || index,
      position: { lat: ele.latitude, lng: ele.longitude },
      title: ele?.status,
      description: <p>{ele?.description}</p>,
      ...ele,
    }));

    setMarkers(mapped);
  }, [initialMarkers]);

  /* -------- CAMERA ENUMERATION -------- */
  const enumerateCameras = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;

    let tempStream = null;
    try {
      tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices.filter((d) => d.kind === "videoinput"));
    } catch (err) {
      console.log(err);
    } finally {
      tempStream?.getTracks().forEach((t) => t.stop());
    }
  };

  useEffect(() => {
    if (showUpdateModal) enumerateCameras();
  }, [showUpdateModal]);

  /* -------- IMAGE UTILS -------- */
  function base64ToImageFile(base64String, fileName = "capture.png") {
    const base64Data = base64String.split(",")[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new File([bytes], fileName, { type: "image/png" });
  }

  const getVideoConstraints = () => ({
    width: 1280,
    height: 720,
    ...(selectedDeviceId && { deviceId: { exact: selectedDeviceId } }),
  });

  /* -------- RESOLVE COMPLAINT -------- */
  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (!capturedImage) {
      setToastMessage("Please Capture the Image")
      setToastShow(true)
      // alert("Please capture image!");
      return;
    }

    const imageFile = base64ToImageFile(
      capturedImage,
      `resolved-${new Date().getMilliseconds()}.png`
    );

    const data = extractBinaryFormData(event.target);
    const reqBody = new FormData();

    reqBody.append("reolvedComment", data.resolvedComment);
    reqBody.append("resolvedOn", dayjs().toDate());
    reqBody.append("status", "resolved");
    reqBody.append("resolvedUrl", imageFile);

    try {
      const response = await binaryAxiosInstance.put(
        `${VITE_BASE_URL}/complaint/update-complaint?_id=${selected?._id}`,
        reqBody
      );
      setToastMessage(response.data.message)
      setToastShow(true)
      //   alert(response.data.message);
      if (response.data.success) {
        setShowUpdateModal(false);
        setShow(false)
        setCapturedImage(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="w-100 h-100">
      {location?.length === 2 && (
        <MapContainer
          center={location}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FitMapToLocations location={location} markers={markers} />

          {markers.map((ele) => (
            <Marker
              key={ele.id}
              position={[ele.position.lat, ele.position.lng]}
              eventHandlers={{
                click: () => {
                  setSelected(ele);
                  setShow(true);
                },
              }}
            />
          ))}
        </MapContainer>
      )}

      {/* -------- VIEW COMPLAINT MODAL -------- */}
      <Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Complaint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Img variant="top" src={selected?.url} />
            <Card.Body>
              <Card.Title>Status: {selected?.status}</Card.Title>
              <Card.Text>{selected?.description}</Card.Text>
              <button
                className="btn btn-warning w-100"
                onClick={() => setShowUpdateModal(true)}
              >
                Resolve?
              </button>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>


      \<Modal
        centered
        size="lg"
        show={showUpdateModal}
        onHide={() => {
          setShowUpdateModal(false);
          setCapturedImage(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Complaint</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <form onSubmit={onFormSubmit}>
            {/* Camera Selection */}
            <div className="mb-3">
              <label className="form-label">Select Camera</label>
              <select
                className="form-select"
                value={selectedDeviceId || ""}
                onChange={(e) => {
                  setSelectedDeviceId(e.target.value);
                  setCapturedImage(null);
                }}
              >
                {devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || "Camera"}
                  </option>
                ))}
              </select>
            </div>

            {/* Webcam Capture */}
            {!capturedImage && (
              <div className="text-center mb-3">
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={getVideoConstraints()}
                  width={750}
                  height={340}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                  ref={(webcam) => (window.webcamRef = webcam)}
                />
                <br />
                <button
                  type="button"
                  className="btn btn-info mt-3 w-50"
                  onClick={() => {
                    const imageSrc = window.webcamRef?.getScreenshot();
                    setCapturedImage(imageSrc);
                  }}
                >
                  Capture Image
                </button>
              </div>
            )}

            {/* Gallery Upload */}
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

            {/* Image Preview */}
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "240px", objectFit: "cover" }}
              />
            )}

            {/* Resolve Comment */}
            <div className="mb-3">
              <label className="form-label">Resolve Comment</label>
              <textarea
                name="resolvedComment"
                className="form-control"
                rows={3}
                required
              />
            </div>

            <Modal.Footer className="p-0">
              <button className="btn btn-primary w-100">
                Resolve Complaint
              </button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>



      <ToastMessage
        show={toastShow}
        message={toastMessage}
        onClose={() => setToastShow(false)}
      />
    </div>
  );
}
