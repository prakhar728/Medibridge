import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export async function loader() {
  const patientRecord = await getContacts();
  return { contacts };
}

const PatientRecord = ({ isSignedIn, contractId, wallet }) => {
  let { patientid } = useParams();
  const [patientDetails, setPatientDetails] = useState("");
  console.log(patientid);
  const getPatientInfo = async () => {
    console.log("Gather Patients Info");
    try {
      // return await wallet.viewMethod({ method: 'get_patient', args: { id: wallet.accountId },contractId })
      const messages = await wallet.viewMethod({
        contractId: contractId,
        method: "get_patient",
        args: { id: patientid },
      });
      console.log(messages);
      setPatientDetails(messages);
      return messages;
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    
  
    getPatientInfo();
  }, [])
  
  if(patientDetails===""){
    return <div>Patient hasn't been registered with us yet!</div>
  }
  return (
    <div>
      <main className="fade-in">
        <section>
          <h2>Patient Information</h2>

          
          <div className="patient-details">
            <p>
              Name: <span className="patient-name">[Patient Name]</span>
            </p>
            <p>
              Age: <span className="patient-age">[Patient Age]</span>
            </p>
            <p>
              Gender: <span className="patient-gender">[Patient Gender]</span>
            </p>
            <p>
              Address:{" "}
              <span className="patient-address">[Patient Address]</span>
            </p>
            {/* <!-- Add more patient information here --> */}
          </div>
        </section>

        <section>
          <h3>Upload Medical Records</h3>
          <form
            id="upload-form"
            action="#"
            method="post"
            encType="multipart/form-data"
          >
            <input
              type="file"
              name="file"
              id="file"
              accept=".pdf, .doc, .docx"
            />
            <button type="submit">Upload</button>
          </form>
        </section>

        <section>
          <h3>Medical Records</h3>
          <div className="medical-records">
            {/* <!-- Add medical record items here --> */}
            <div className="record-item">
              <p>Record 1</p>
              {/* <!-- Add more details about the record --> */}
            </div>
            <div className="record-item">
              <p>Record 2</p>
              {/* <!-- Add more details about the record --> */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientRecord;
