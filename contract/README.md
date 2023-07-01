# Health Contract

The Health Contract is a smart contract designed to facilitate decentralized interactions between patients and doctors in the healthcare domain. It leverages the power of blockchain technology to ensure secure, transparent, and efficient connectivity while preserving patient privacy and control over medical data.

# Quickstart

1. Make sure you have installed [rust](https://rust.org/).
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Deploy the Contract
You can automatically compile and deploy the contract in the NEAR testnet by running:

```bash
./deploy.sh
```

Once finished, check the `neardev/dev-account` file to find the address in which the contract was deployed:

```bash
cat ./neardev/dev-account
# e.g. dev-1659899566943-21539992274727
```

<br />

## 2. Functions
```rust
pub fn get_patient(&self, id: &AccountId) -> Result<&Patient, &str>
```
This function returns the patient's information given his account ID.

```rust
pub fn get_doctor(&self, id: &AccountId) -> Result<&Patient, &str>
```
This function returns the doctor's information given his account ID.

```rust 
pub fn get_patient_records(&self, id: &AccountId) -> Vec<MedicalRecord> 
```
This function returns a patient's medical records given his account ID.

```rust
pub fn register_patient(&mut self, id: &AccountId, name: String)
```

This function allows the registration of a new patient with a specified ID and name. It ensures that the patient ID is unique and associates the patient with an empty list of medical records. The function is payable, meaning a fee is required to execute this operation.

```rust 
pub fn register_doctor(&mut self, id: &AccountId, name: String)
```
This function enables the registration of a new doctor with a specified ID and name. It checks the uniqueness of the doctor's ID and adds the doctor to the contract's list of doctors. Like `register_patient`, this function is payable.

```rust
pub fn store_medical_record(
    &mut self,
    id: u64,
    patient_id: &AccountId,
    record_data: String,
    is_public: bool,
)
```
This function allows the storage of a medical record for a patient with a specified ID, record data, and privacy settings. It ensures the uniqueness of the medical record ID and associates the record with the patient. If the record is marked as public, it will be added to the contract's list of public records. Similar to the previous functions, this operation requires a fee to be paid.

```rust
pub fn schedule_appointment(
    &mut self,
    id: u64,
    patient_id: &AccountId,
    doctor_id: &AccountId,
    timestamp: u64,
    location: String,
)
```
This function enables the scheduling of an appointment between a patient and a doctor. It verifies the uniqueness of the appointment ID and stores the appointment details, including the patient ID, doctor ID, appointment timestamp, and location.

```rust
pub fn pay_doctor(&mut self, doctor_id: &AccountId, amount: Balance) -> Promise
```
This function facilitates the payment of a specified amount to a doctor. It verifies the existence of both the patient and the doctor, checks if the patient has enough balance for the payment, and transfers the specified amount from the patient to the doctor.

```rust
pub fn view_scheduled_appointments(&self) -> Vec<Appointment>
```
This function allows patients and doctors to view their scheduled appointments. It retrieves the caller's account ID and checks if the caller is either a patient or a doctor. If authenticated, the function fetches and returns the appointments associated with the caller.
