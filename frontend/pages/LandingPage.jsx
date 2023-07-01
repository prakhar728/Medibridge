import React from "react";
import "../assets/global.css";
import services1 from "../assets/services1.png";
import services2 from "../assets/services2.png";
import services3 from "../assets/services2.png";
import logo from "../assets/MediBridge_logo.png";
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
            <a href="index.html">Home</a>
          </li>
          <li>
            <a href="about.html">About</a>
          </li>
          <li>
            <a href="contact.html">Contact</a>
          </li>
        </ul>
      </nav>
      <div className="logo">
        <a href="index.html">
          <img src={logo} alt="MedBridge Logo" />
        </a>
      </div>
      <div className="user-authentication fade-in">
        {/* <!-- Show login or account-related links here --> */}
        <div className="login-signup">
          <a href="doctor.html">Login as a Doctor</a>
          <a href="patient.html">Login as a Patient</a>
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
                  Book and manage appointments with healthcare providers in a
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
            <a href="terms.html">Terms of Service</a>
          </li>
          <li>
            <a href="privacy.html">Privacy Policy</a>
          </li>
          <li>
            <a href="about.html">About Us</a>
          </li>
          <li>
            <a href="contact.html">Contact Us</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default LandingPage;
