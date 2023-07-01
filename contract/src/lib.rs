use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::env::panic_str;
use near_sdk::log;
use near_sdk::require;
use near_sdk::serde::Serialize;
use near_sdk::AccountId;
use near_sdk::Balance;
use near_sdk::Promise;
use near_sdk::{env, near_bindgen};
use std::collections::{HashMap, HashSet};
use std::hash::BuildHasher;

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct HealthContract {
    patients: HashMap<AccountId, Patient>,
    doctors: HashMap<AccountId, Doctor>,
    medical_records: HashMap<u64, MedicalRecord>,
    public_records: HashSet<u64, MedicalRecord>,
    appointments: HashMap<u64, Appointment>,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Patient {
    id: AccountId,
    name: String,
    medical_records: Vec<MedicalRecord>,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Doctor {
    id: AccountId,
    name: String,
    base_consultation_fee: Balance,
}

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct MedicalRecord {
    id: u64,
    patient_id: AccountId,
    record_data: String,
}

impl Default for MedicalRecord {
    fn default() -> Self {
        Self {
            id: Default::default(),
            patient_id: AccountId::new_unchecked("000".to_string()), // Empty string as default for AccountId
            record_data: Default::default(),
        }
    }
}

impl BuildHasher for MedicalRecord {
    type Hasher = std::collections::hash_map::DefaultHasher;

    fn build_hasher(&self) -> Self::Hasher {
        std::collections::hash_map::DefaultHasher::new()
    }
}

#[derive(Clone, Serialize, BorshDeserialize, BorshSerialize)]
pub struct Appointment {
    patient_id: AccountId,
    doctor_id: AccountId,
    timestamp: u64,
    location: String,
}

#[near_bindgen]
impl HealthContract {
    // Get patient information by account ID.
    #[handle_result]
    pub fn get_patient(&self, id: &AccountId) -> Result<&Patient, &str> {
        require!(
            self.patients.contains_key(id),
            "Patient with the specified ID does not exist."
        );

        match self.patients.get(id) {
            Some(patient) => Ok(patient),
            None => Err("Failed to retrieve patient information."),
        }
    }

    // Get doctor information by account ID.
    #[handle_result]
    pub fn get_doctor(&self, id: &AccountId) -> Result<&Doctor, &str> {
        require!(
            self.doctors.contains_key(id),
            "Doctor with the specified ID does not exist."
        );

        match self.doctors.get(id) {
            Some(doctor) => Ok(doctor),
            None => Err("Failed to retrieve doctor information."),
        }
    }

    // Get the medical records for the calling patient.
    pub fn get_patient_records(&self) -> Vec<MedicalRecord> {
        let account_id = env::predecessor_account_id();
        log!("The Account id calling this is: {}", account_id);

        // Check if the caller is a patient
        if self.patients.contains_key(&account_id) {
            let patient = self.patients.get(&account_id).unwrap();
            patient.medical_records.clone()
        } else {
            env::panic_str("Access denied. Only patients can view their medical records.");
        }
    }

    // Register a new patient with the specified ID and name.
    #[payable]
    pub fn register_patient(&mut self, id: &AccountId, name: String) {
        self.transfer_fee();
        require!(
            !self.patients.contains_key(id),
            "Patient with the same ID already exists."
        );

        let patient = Patient {
            id: id.clone(),
            name,
            medical_records: Vec::new(),
        };
        self.patients.insert(id.clone(), patient);

        log!("Registered patient successfully. ID: {}", id);
    }

    // Register a new doctor with the specified ID and name.
    #[payable]
    pub fn register_doctor(&mut self, id: &AccountId, name: String, fee: Balance) {
        self.transfer_fee();
        require!(
            !self.doctors.contains_key(id),
            "Doctor with the same ID already exists."
        );

        let doctor = Doctor {
            id: id.clone(),
            name,
            base_consultation_fee: fee,
        };
        self.doctors.insert(id.clone(), doctor);
        log!("Registered doctor successfully. ID: {}", id);
    }

    // Store a medical record for a patient with the specified ID,
    // record data, and privacy setting.
    #[payable]
    pub fn store_medical_record(
        &mut self,
        id: u64,
        patient_id: &AccountId,
        record_data: String,
        is_public: bool,
    ) {
        self.transfer_fee();
        require!(
            !self.medical_records.contains_key(&id),
            "Medical records with the same ID already exist."
        );

        let medical_record = MedicalRecord {
            id,
            patient_id: patient_id.clone(),
            record_data,
        };
        self.medical_records.insert(id, medical_record.clone());

        if let Some(patient) = self.patients.get_mut(patient_id) {
            patient.medical_records.push(medical_record);
            if is_public {
                self.public_records.insert(id);
            }
            log!("Stored medical record successfully. ID: {}", id);
        }
    }

    // Schedule an appointment between a patient and a doctor at the specified time and location.
    #[payable]
    pub fn schedule_appointment(
        &mut self,
        id: u64,
        patient_id: &AccountId,
        doctor_id: &AccountId,
        timestamp: u64,
        location: String,
    ) {
        self.transfer_fee();
        require!(
            !self.appointments.contains_key(&id),
            "An appointment with the same ID already exists."
        );

        let appointment = Appointment {
            patient_id: patient_id.clone(),
            doctor_id: doctor_id.clone(),
            timestamp,
            location,
        };
        self.appointments.insert(id, appointment);
        log!("Scheduled appointment successfully. ID: {}", id);
    }

    // Make a payment to a doctor for the provided amount.
    #[payable]
    pub fn pay_doctor(&mut self, doctor_id: &AccountId, amount: Balance) -> Promise {
        self.transfer_fee();

        let patient_id = env::predecessor_account_id();
        // Ensure the patient exists
        let _patient = match self.patients.get_mut(&patient_id) {
            Some(patient) => patient,
            None => panic_str("Patient does not exist."),
        };

        // Ensure the doctor exists
        let doctor = match self.doctors.get(doctor_id) {
            Some(doctor) => doctor,
            None => panic_str("Doctor does not exist."),
        };
        require!(
            amount >= doctor.base_consultation_fee,
            "An appointment with the same ID already exists."
        );

        // Ensure the patient has enough balance to make the payment
        let patient_balance = env::account_balance();
        if patient_balance < amount {
            panic_str("Insufficient balance to make the payment.");
        }

        // Transfer the payment from patient to doctor
        let doctor_account_id = doctor.id.clone();
        Promise::new(doctor_account_id).transfer(amount)
    }

    // Function to view scheduled appointments for a patient or doctor, with necessary authentication.
    pub fn view_scheduled_appointments(&self) -> Vec<Appointment> {
        let account_id = env::predecessor_account_id();
        log!("The Account id calling this is:{}", account_id);
        // Check if the caller is a patient or doctor
        if self.patients.contains_key(&account_id) || self.doctors.contains_key(&account_id) {
            // Fetch the appointments for the patient or doctor
            let appointments = self
                .appointments
                .values()
                .filter(|appointment| {
                    appointment.patient_id == account_id || appointment.doctor_id == account_id
                })
                .cloned()
                .collect();

            appointments
        } else {
            env::panic_str(
                "Access denied. Only patients and doctors can view scheduled appointments.",
            );
        }
    }

    // Helper function to transfer the fee from the caller
    fn transfer_fee(&mut self) -> Promise {
        let attached_deposit = env::attached_deposit();
        // transfer 10% of the attached deposit as a fee
        let fee_amount = attached_deposit / 10;
        let contract_owner = env::predecessor_account_id();

        // Transfer the fee from the caller to the contract owner and return the Promise
        Promise::new(contract_owner).transfer(fee_amount)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn register_patient_successfully() {
        let mut contract = HealthContract::default();
        contract.register_patient(
            &AccountId::new_unchecked("kinosxz.near".to_string()),
            "John Doe".to_string(),
        );
        let patient = contract
            .patients
            .get(&AccountId::new_unchecked("kinosxz.near".to_string()))
            .unwrap();
        assert_eq!(patient.name, "John Doe".to_string());
    }

    #[test]
    fn register_doctor_successfully() {
        let mut contract = HealthContract::default();
        contract.register_doctor(
            &AccountId::new_unchecked("elsayed.near".to_string()),
            "Dr. Tarek".to_string(),
            3,
        );
        let doctor = contract
            .doctors
            .get(&AccountId::new_unchecked("elsayed.near".to_string()))
            .unwrap();
        assert_eq!(doctor.name, "Dr. Tarek".to_string());
    }

    #[test]
    fn get_patient_records_test() {
        let mut contract = HealthContract::default();
        let patient_id = AccountId::new_unchecked("bob.near".to_string());
        let record_id = 1;
        let record_data = "Medical record data".to_string();
        let is_public = true;

        contract.register_patient(&patient_id, "Alice".to_string());
        contract.store_medical_record(record_id, &patient_id, record_data.clone(), is_public);

        let records = contract.get_patient_records();

        assert_eq!(records.len(), 1);
        assert_eq!(records[0].id, record_id);
        assert_eq!(records[0].patient_id, patient_id);
        assert_eq!(records[0].record_data, record_data);
    }

    #[test]
    fn store_medical_record_successfully() {
        let mut contract = HealthContract::default();
        contract.register_patient(
            &AccountId::new_unchecked("kinosxz.near".to_string()),
            "John Doe".to_string(),
        );
        contract.store_medical_record(
            1,
            &AccountId::new_unchecked("kinosxz.near".to_string()),
            "Some record data".to_string(),
            true,
        );
        let patient = contract
            .patients
            .get(&AccountId::new_unchecked("kinosxz.near".to_string()))
            .unwrap();
        assert_eq!(patient.medical_records.len(), 1);
        assert_eq!(contract.medical_records.len(), 1);
    }

    #[test]
    fn schedule_appointment_successfully() {
        let mut contract = HealthContract::default();
        contract.register_patient(
            &AccountId::new_unchecked("kinosxz.near".to_string()),
            "John Doe".to_string(),
        );
        contract.register_doctor(
            &AccountId::new_unchecked("elsayed.near".to_string()),
            "Dr. Smith".to_string(),
            3,
        );

        contract.schedule_appointment(
            1,
            &AccountId::new_unchecked("kinosxz.near".to_string()),
            &AccountId::new_unchecked("elsayed.near".to_string()),
            1677721600, // Assuming timestamp represents July 1, 2023, 00:00:00 UTC
            "Hospital A".to_string(),
        );

        let appointment = contract.appointments.get(&1).unwrap();
        assert_eq!(appointment.location, "Hospital A".to_string());
    }

    #[test]
    fn view_scheduled_appointments_patient() {
        let mut contract = HealthContract::default();
        let patient_id = AccountId::new_unchecked("bob.near".to_string());
        let doctor_id = AccountId::new_unchecked("doctor.near".to_string());

        let timestamp = 1625097600; // July 1, 2021, 00:00:00 UTC
        let location = "Hospital".to_string();

        contract.register_patient(&patient_id, "John Doe".to_string());
        contract.register_doctor(&doctor_id, "Dr. Smith".to_string(), 3);
        contract.schedule_appointment(1, &patient_id, &doctor_id, timestamp, location.clone());
        contract.schedule_appointment(
            2,
            &patient_id,
            &doctor_id,
            timestamp + 86400,
            location.clone(),
        );
        contract.schedule_appointment(
            3,
            &patient_id,
            &doctor_id,
            timestamp + 172800,
            location.clone(),
        );

        let appointments = contract.view_scheduled_appointments();
        assert_eq!(appointments.len(), 3);
        assert_eq!(appointments[0].location, location);
        assert_eq!(appointments[1].location, location);
        assert_eq!(appointments[2].location, location);
    }
}
