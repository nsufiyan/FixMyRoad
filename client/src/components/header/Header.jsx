import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import styles from "./Header.module.css";
import UserPopover from "../user-popover/UserPopover";

const Header = (props) => {
  const [userData, setUserData] = useState({});


  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")) || {});
  }, []);


  return (
    <Navbar collapseOnSelect expand="lg" className="bg-white shadow-sm w-100 sticky-top">

      {/* Government accent bar */}
      <div className={styles.govBar}></div>

      <Container fluid className="px-4">
        <Navbar.Brand href="#home" className="d-flex align-items-center gap-2">
          <img height={48} width={58} src="/fmr_LOGO.png" alt="Fix My Road" />
          <span className={styles.logoname}>Fix My Road</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto w-100 align-items-center">

            {userData.userType == "admin" && (
              <Link className={`ms-3 ${styles.customLink}`} to={"/dashboard/admin-dashboard"}>
                Admin Dashboard
              </Link>
            )}

            {userData.userType != "admin" && (
              <Link className={`ms-3 ${styles.customLink}`} to={"/dashboard"}>
                Dashboard
              </Link>
            )}

            {/* Complaints with notification dot */}
            <Link
              className={`ms-3 ${styles.customLink} ${styles.notify}`}
              to={"/dashboard/requests"}
            >
              Complaints

            </Link>

            {userData.userType !== "admin" && (
              <Link className={`ms-3 ${styles.customLink}`} to={"/dashboard/profile"}>
                Profile
              </Link>
            )}

            {/* Right side */}
            <div className="ms-auto d-flex align-items-center">

              {/* Avatar */}
              <div className="ms-auto d-flex align-items-center">
                <UserPopover userData={userData} />
                {userData.userType == "citizen" ? <span className={styles.roleBadge} >  CITIZEN</span> : <span className={styles.roleBadge} > ADMIN</span>}
                <button className={`btn ${styles.logoutBtn}`} onClick={() => props.setShow(true)}>Logout</button>
              </div>

            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


  );
};

export default Header;
