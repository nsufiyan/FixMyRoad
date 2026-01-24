import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../util/axiosInstance";
import styles from './UserPopover.module.css';
const { VITE_BASE_URL } = import.meta.env;
const UserPopover = ({ userData }) => {
    const [complaints, setComplaints] = useState(0)
    const [resolvedcomplaints, setResolvedComplaints] = useState(0)
    const uData = (JSON.parse(localStorage.getItem("userData")));


    const getResolvedComplaints = async () => {
        try {
            let response = await axiosInstance.get(
                `${VITE_BASE_URL}/complaint/get-complaint?status=resolved`
            );
            setResolvedComplaints(response?.data?.data?.length);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getResolvedComplaints();
    }, []);




    const getComplaints = async () => {
        try {
            let response = await axiosInstance.get(
                `${VITE_BASE_URL}/complaint/get-complaint?user=${uData._id}`

            );
            setComplaints(response?.data?.data.length);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getComplaints();
    }, []);


    const popover = (
        <Popover id="user-popover" className={styles.popoverCard}>
            <Popover.Body className="p-3">
                {/* Top: Avatar + Name + Email */}

                <div className="d-flex align-items-center mb-3">
                    <div className={styles.innerAvatar}>
                        {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                        <div className="fw-bold">{userData?.name || "User"}</div>
                        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                            {userData?.email || "user@example.com"}
                        </div>
                    </div>
                </div>

                <hr className="my-2" />

                {/* Role */}
                <div className="mb-2">
                    <span className="text-muted me-1">Role:</span>
                    <span className="fw-semibold">
                        {userData?.userType?.toUpperCase() || "CITIZEN"}
                    </span>
                </div>

                {/* Complaints Raised */}
                {uData?.userType == "citizen" ?
                    <div className="mb-3">
                        <span className="text-muted me-1">Pothole Reported:</span>
                        <span className="fw-semibold">{complaints}</span>
                    </div>
                    : <div className="mb-3">
                        <span className="text-muted me-1">Pothole Resolved:</span>
                        <span className="fw-semibold">{resolvedcomplaints}</span>
                    </div>
                }

                {/* Go to Profile Button */}
                {uData?.userType == "citizen" ?
                    <Link to="/dashboard/profile">
                        <Button variant="primary" size="sm" className="w-100">
                            Go to Profile
                        </Button>
                    </Link>
                    : ""}
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={popover}
            delay={{ show: 200, hide: 100 }}
        >
            <div className={styles.avatar} style={{ cursor: "pointer" }}>
                {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
        </OverlayTrigger>
    );
};

export default UserPopover;
