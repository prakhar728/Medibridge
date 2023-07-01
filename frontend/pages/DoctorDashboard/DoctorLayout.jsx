import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { SignInPrompt, SignOutButton } from "../../ui-components";

const DoctorLayout = ({ isSignedIn, contractId, wallet }) => {
  console.log(isSignedIn);
  const [isADoctor, setisADoctor] = useState(false);
  const checkDoctorStatus = async () =>{
    console.log("Checking the Doctors status");
    try {
      // return await wallet.viewMethod({ method: 'get_patient', args: { id: wallet.accountId },contractId })
      const messages = await wallet.viewMethod({ contractId: contractId, method: "get_patient", args: { id: wallet.accountId }});
      console.log(messages);
      return messages;
    } catch (error) {
      console.log(error);
    }
    
  }
  useEffect(() => {
    if(isSignedIn)
    checkDoctorStatus();
  }, [])
  
  return (
    <div>
      <nav className="fade-in">
        <ul className="navigation-bar">
          <li>
            <Link to="logout.html"><SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/></Link>
          </li>
          <li>
            <Link to="patients.html">Patients</Link>
          </li>
          <li>
            <Link to="med-records.html">MedRecords</Link>
          </li>
        </ul>
      </nav>
 
      {!isSignedIn ?<SignInPrompt  onClick={() => wallet.signIn()}/> :
      <Outlet />
    }
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

export default DoctorLayout;
