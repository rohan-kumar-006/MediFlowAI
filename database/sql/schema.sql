USE healthcare;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (email, password)
VALUES 
('john@google.com', 'user2'),
('ram@gmail.com', '1234'),
('rohan@gmail.com', '1234'),
('ritesh@gmail.com', '1234'),
('priya@gmail.com', 'pass123'),
('arjun@gmail.com', 'pass123'),
('neha@gmail.com', 'pass123'),
('akshay@gmail.com', 'pass123');

-- PATIENTS
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    contact_number VARCHAR(15) NOT NULL UNIQUE,
    medical_record_number VARCHAR(20) NOT NULL UNIQUE,
    blood_group VARCHAR(10),
    marital_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT IGNORE INTO patients 
(user_id, name, date_of_birth, gender, contact_number, medical_record_number, blood_group, marital_status)
VALUES
(1, 'John Doe', '1990-03-15', 'Male', '9000000000', 'MRN001', 'O+', 'Single'),
(2, 'Ram Kumar', '1998-05-12', 'Male', '9000000001', 'MRN002', 'A+', 'Single'),
(3, 'Rohan Singh', '1995-08-20', 'Male', '9000000002', 'MRN003', 'B+', 'Married'),
(4, 'Ritesh Sharma', '2000-02-10', 'Male', '9000000003', 'MRN004', 'O+', 'Single'),
(5, 'Priya Verma', '1992-07-22', 'Female', '9000000004', 'MRN005', 'AB+', 'Single'),
(6, 'Arjun Patel', '1989-11-18', 'Male', '9000000005', 'MRN006', 'B-', 'Married'),
(7, 'Neha Gupta', '1997-01-30', 'Female', '9000000006', 'MRN007', 'O-', 'Single'),
(8, 'Akshay Kumar', '1994-06-12', 'Male', '9000000007', 'MRN008', 'A-', 'Married');

-- PATIENT HISTORY
CREATE TABLE IF NOT EXISTS patient_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    past_diagnoses TEXT,
    surgeries TEXT,
    hospital_admissions TEXT,
    immunization_records TEXT,
    family_medical_history TEXT,
    lifestyle_factors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

INSERT IGNORE INTO patient_history 
(patient_id, past_diagnoses, surgeries, hospital_admissions, immunization_records, family_medical_history, lifestyle_factors)
VALUES
(1, 'None', 'None', '0', 'All Vaccines', 'None', 'Healthy'),
(2, 'Diabetes', 'Appendix Surgery', '2 times', 'COVID Vaccine', 'Heart Disease', 'Smoking'),
(3, 'Hypertension', 'None', '1 time', 'Flu Vaccine', 'Diabetes', 'Alcohol'),
(4, 'Asthma', 'None', '0', 'All Vaccines', 'None', 'Healthy'),
(5, 'Migraine', 'None', '1 time', 'COVID Vaccine', 'Thyroid Issues', 'Stress'),
(6, 'High Cholesterol', 'Gall bladder surgery', '1 time', 'All Vaccines', 'Heart Disease', 'Exercise'),
(7, 'Anxiety', 'None', '2 times', 'COVID Vaccine', 'Depression', 'Meditation'),
(8, 'Arthritis', 'Knee surgery', '3 times', 'All Vaccines', 'Arthritis', 'Sedentary');

-- HOSPITALS
CREATE TABLE IF NOT EXISTS hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    address TEXT,
    contact_number VARCHAR(15),
    website TEXT
);

INSERT INTO hospitals (name, address, contact_number, website)
VALUES
('City Hospital', 'Delhi', '8888888888', 'www.cityhospital.com'),
('Metro Hospital', 'Mumbai', '7777777777', 'www.metrohospital.com');

-- DOCTORS
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    specialization VARCHAR(100),
    experience INT,
    rating DECIMAL(2,1),
    fees INT,
    hospital_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
);

INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id)
VALUES
('Dr Amit', 'Cardiologist', 10, 4.5, 500, 1),
('Dr Neha', 'Dermatologist', 8, 4.2, 400, 2),
('Dr Raj', 'Physician', 5, 4.0, 300, 1);

-- SLOTS
CREATE TABLE IF NOT EXISTS availability_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT,
    available_date DATE,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

INSERT INTO availability_slots (doctor_id, available_date, start_time, end_time)
VALUES
(1, '2026-05-10', '10:00:00', '12:00:00'),
(2, '2026-05-10', '12:00:00', '14:00:00'),
(3, '2026-05-10', '15:00:00', '17:00:00');

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT,
    patient_id INT,
    rating DECIMAL(3,2),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO reviews (doctor_id, patient_id, rating, comment)
VALUES
(1, 2, 4.5, 'Good'),
(2, 3, 4.0, 'Nice'),
(3, 4, 5.0, 'Excellent');

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    slot_id INT,
    appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(255)
);

INSERT INTO appointments (patient_id, doctor_id, slot_id, reason)
VALUES
(2, 1, 1, 'Heart check'),
(3, 2, 2, 'Skin issue'),
(4, 3, 3, 'Fever');

-- VISITS
CREATE TABLE IF NOT EXISTS visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    visit_date DATE,
    department VARCHAR(100),
    notes TEXT
);

INSERT INTO visits (patient_id, doctor_id, visit_date, department, notes)
VALUES
(2, 1, '2026-05-01', 'Cardiology', 'Routine'),
(3, 2, '2026-05-02', 'Dermatology', 'Rash'),
(4, 3, '2026-05-03', 'General', 'Fever');

-- SPECIALISTS
CREATE TABLE IF NOT EXISTS specialists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

INSERT INTO specialists (name)
VALUES ('Cardiologist'), ('Dermatologist'), ('Physician');

-- SYMPTOMS
CREATE TABLE IF NOT EXISTS symptoms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

INSERT INTO symptoms (name)
VALUES ('Chest Pain'), ('Skin Allergy'), ('Fever');

-- MAPPING
CREATE TABLE IF NOT EXISTS specialist_symptom (
    specialist_id INT,
    symptom_id INT,
    PRIMARY KEY (specialist_id, symptom_id)
);

INSERT INTO specialist_symptom VALUES
(1,1),(2,2),(3,3);