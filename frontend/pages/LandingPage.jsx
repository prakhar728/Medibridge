import React from "react";
import "../assets/global.css";
import services1 from "../assets/services1.png";
import services2 from "../assets/services2.png";
import services3 from "../assets/services2.png";
import logo from "../assets/MediBridge_logo.png";
import { Link } from "react-router-dom";
const LandingPage = () => {
  const showFeatureServices = (event) => {
    const service = event.target.closest(".service");
    if (service) {
      const serviceContent = service.querySelector(".service-content");
      if (serviceContent) {
        serviceContent.classNameList.toggle("show");
      }
    }
  };
  return (
    <div>
      <nav className="fade-in">
        <ul className="navigation-bar">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/contact"}>Contact</Link>
          </li>
        </ul>
      </nav>
      <div className="logo">
        <Link to="index.html">
          <img src={logo} alt="MedBridge Logo" />
        </Link>
      </div>
      <div className="user-authentication fade-in">
        {/* <!-- Show login or account-related links here --> */}
        <div className="login-signup">
          <Link to={'doctor/dashboard'}>Login as a Doctor</Link>
          <Link to={'patient/dashboard'}>Login as a Patient</Link>
        </div>
        {/* <!-- Display user name or profile picture here after authentication --> */}
        {/* <!-- User dropdown menu for account settings and logout --> */}
      </div>
      <main className="fade-in">
        {/* <!-- Hero section --> */}
        <section className="hero">
          <h1>Welcome to MedBridge - The Future of Decentralized Care</h1>
          {/* <!-- Add more content and features as needed --> */}
        </section>
        {/* <!-- Featured services or benefits section --> */}
        <section className="featured-services" onClick={showFeatureServices}>
          <h2>Featured Services</h2>
          <div className="service">
            <div className="service-content">
              <img src={services1} alt="Service 1" />
              <div className="service-text">
                <h3>Secure Payment</h3>
                <p>
                  Secure payment from patients to doctors based on the service
                  provided.
                </p>
              </div>
            </div>
          </div>
          <div className="service">
            <div className="service-content">
              <div className="service-text">
                <h3>Electronic Health Records</h3>
                <p>
                  Access and manage your health records securely online,
                  anytime, anywhere.
                </p>
              </div>
              <img src={services2} alt="Service 2" />
            </div>
          </div>
          <div className="service">
            <div className="service-content">
              <img src={services3} alt="Service 3" />
              <div className="service-text">
                <h3>Appointment Scheduling</h3>
                <p>
                  Book and manage appointments with healthcare providers in Link
                  convenient and hassle-free way.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="fade-in">
        <ul className="footer-links">
          <li>
            <Link to="terms.html">Terms of Service</Link>
          </li>
          <li>
            <Link to="privacy.html">Privacy Policy</Link>
          </li>
          <li>
            <Link to="about.html">About Us</Link>
          </li>
          <li>
            <Link to="contact.html">Contact Us</Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default LandingPage;
