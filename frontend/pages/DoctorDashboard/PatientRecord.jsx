import React from "react";
import { useParams } from "react-router-dom";

export async function loader() {
  const patientRecord = await getContacts();
  return { contacts };
}

const PatientRecord = ({ isSignedIn, contractId, wallet }) => {
  let { patientid } = useParams();
  console.log(patientid);
  return (
    <div>
      <main class="fade-in">
        <section>
          <h2>Patient Information</h2>
          <div class="patient-details">
            <p>
              Name: <span class="patient-name">[Patient Name]</span>
            </p>
            <p>
              Age: <span class="patient-age">[Patient Age]</span>
            </p>
            <p>
              Gender: <span class="patient-gender">[Patient Gender]</span>
            </p>
            <p>
              Address: <span class="patient-address">[Patient Address]</span>
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
            enctype="multipart/form-data"
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
          <div class="medical-records">
            {/* <!-- Add medical record items here --> */}
            <div class="record-item">
              <p>Record 1</p>
              {/* <!-- Add more details about the record --> */}
            </div>
            <div class="record-item">
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
