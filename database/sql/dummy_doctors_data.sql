-- Clear existing doctor data
DELETE FROM appointments WHERE doctor_id IS NOT NULL;
DELETE FROM availability_slots WHERE doctor_id IS NOT NULL;
DELETE FROM reviews WHERE doctor_id IS NOT NULL;
DELETE FROM visits WHERE doctor_id IS NOT NULL;
DELETE FROM doctors WHERE id > 0;
DELETE FROM specialists WHERE id > 0;
DELETE FROM specialist_symptom WHERE specialist_id > 0;

-- Insert Specialists/Departments
INSERT INTO specialists (name) VALUES 
('Cardiology'),
('Dermatology'),
('Neurology'),
('Pediatrics'),
('Orthopedics'),
('Psychiatry'),
('ENT'),
('Gastroenterology'),
('Pulmonology'),
('Gynecology'),
('Ophthalmology'),
('Oncology');

-- Insert 10 Cardiologists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Rajesh Kapoor', 'Cardiology', 15, 4.8, 1000, 1),
('Dr. Priya Singh', 'Cardiology', 12, 4.7, 900, 2),
('Dr. Amit Verma', 'Cardiology', 10, 4.6, 850, 1),
('Dr. Neha Gupta', 'Cardiology', 8, 4.5, 800, 2),
('Dr. Arun Kumar', 'Cardiology', 14, 4.9, 950, 1),
('Dr. Meera Patel', 'Cardiology', 11, 4.5, 820, 2),
('Dr. Vikram Sharma', 'Cardiology', 9, 4.4, 780, 1),
('Dr. Anjali Nair', 'Cardiology', 13, 4.7, 920, 2),
('Dr. Sanjay Desai', 'Cardiology', 16, 4.9, 1050, 1),
('Dr. Deepika Reddy', 'Cardiology', 7, 4.3, 750, 2);

-- Insert 10 Dermatologists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Shreya Malhotra', 'Dermatology', 12, 4.7, 600, 1),
('Dr. Harshvardhan Singh', 'Dermatology', 10, 4.6, 550, 2),
('Dr. Pooja Verma', 'Dermatology', 8, 4.5, 500, 1),
('Dr. Arjun Tiwari', 'Dermatology', 14, 4.8, 700, 2),
('Dr. Ritika Sharma', 'Dermatology', 9, 4.4, 480, 1),
('Dr. Karan Nath', 'Dermatology', 11, 4.6, 580, 2),
('Dr. Neha Kulkarni', 'Dermatology', 13, 4.7, 650, 1),
('Dr. Rohan Patel', 'Dermatology', 7, 4.3, 450, 2),
('Dr. Avni Gupta', 'Dermatology', 15, 4.9, 750, 1),
('Dr. Sameer Khan', 'Dermatology', 6, 4.2, 420, 2);

-- Insert 10 Neurologists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Suresh Menon', 'Neurology', 16, 4.9, 1100, 1),
('Dr. Sakshi Mehta', 'Neurology', 12, 4.7, 950, 2),
('Dr. Aniruddh Rao', 'Neurology', 10, 4.5, 850, 1),
('Dr. Priya Kumari', 'Neurology', 14, 4.8, 1000, 2),
('Dr. Vikram Singh', 'Neurology', 8, 4.4, 780, 1),
('Dr. Anjana Dubey', 'Neurology', 11, 4.6, 900, 2),
('Dr. Nikhil Verma', 'Neurology', 9, 4.5, 820, 1),
('Dr. Shreya Iyer', 'Neurology', 13, 4.7, 980, 2),
('Dr. Arjun Pathak', 'Neurology', 15, 4.8, 1050, 1),
('Dr. Divya Sinha', 'Neurology', 7, 4.3, 720, 2);

-- Insert 10 Pediatricians
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Aarushi Nambiar', 'Pediatrics', 11, 4.7, 600, 1),
('Dr. Kabir Saxena', 'Pediatrics', 9, 4.5, 500, 2),
('Dr. Nisha Malviya', 'Pediatrics', 13, 4.8, 700, 1),
('Dr. Rohan Mishra', 'Pediatrics', 7, 4.3, 450, 2),
('Dr. Anjali Singh', 'Pediatrics', 10, 4.6, 580, 1),
('Dr. Ravi Kumar', 'Pediatrics', 14, 4.8, 750, 2),
('Dr. Pooja Chauhan', 'Pediatrics', 8, 4.4, 480, 1),
('Dr. Varun Pillai', 'Pediatrics', 12, 4.7, 650, 2),
('Dr. Simran Kaur', 'Pediatrics', 6, 4.2, 420, 1),
('Dr. Nitin Sharma', 'Pediatrics', 15, 4.9, 800, 2);

-- Insert 10 Orthopedists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Sunil Bajaj', 'Orthopedics', 16, 4.9, 1200, 1),
('Dr. Kavya Mishra', 'Orthopedics', 12, 4.7, 950, 2),
('Dr. Abhijit Sharma', 'Orthopedics', 10, 4.6, 880, 1),
('Dr. Richa Verma', 'Orthopedics', 14, 4.8, 1050, 2),
('Dr. Harsh Negi', 'Orthopedics', 8, 4.4, 720, 1),
('Dr. Anjuli Pant', 'Orthopedics', 11, 4.6, 920, 2),
('Dr. Manoj Singh', 'Orthopedics', 9, 4.5, 820, 1),
('Dr. Sneha Joshi', 'Orthopedics', 13, 4.7, 1000, 2),
('Dr. Rahul Gupta', 'Orthopedics', 15, 4.9, 1150, 1),
('Dr. Divya Nair', 'Orthopedics', 7, 4.3, 680, 2);

-- Insert 10 Psychiatrists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Arjun Desai', 'Psychiatry', 14, 4.8, 800, 1),
('Dr. Sakshi Verma', 'Psychiatry', 10, 4.6, 650, 2),
('Dr. Nikhil Bansal', 'Psychiatry', 12, 4.7, 750, 1),
('Dr. Pooja Jain', 'Psychiatry', 8, 4.4, 550, 2),
('Dr. Varun Singhal', 'Psychiatry', 11, 4.6, 700, 1),
('Dr. Shreya Kapoor', 'Psychiatry', 9, 4.5, 600, 2),
('Dr. Rohan Nath', 'Psychiatry', 13, 4.8, 800, 1),
('Dr. Rani Patel', 'Psychiatry', 7, 4.3, 500, 2),
('Dr. Sanjay Kumar', 'Psychiatry', 15, 4.9, 900, 1),
('Dr. Aarav Singh', 'Psychiatry', 6, 4.2, 480, 2);

-- Insert 10 ENT Specialists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Vikas Sharma', 'ENT', 13, 4.8, 700, 1),
('Dr. Nisha Bhat', 'ENT', 9, 4.5, 550, 2),
('Dr. Sanjay Rao', 'ENT', 11, 4.6, 650, 1),
('Dr. Priya Malhotra', 'ENT', 7, 4.3, 480, 2),
('Dr. Aman Singh', 'ENT', 10, 4.6, 600, 1),
('Dr. Kavya Kumar', 'ENT', 14, 4.8, 750, 2),
('Dr. Harsh Desai', 'ENT', 8, 4.4, 520, 1),
('Dr. Anita Verma', 'ENT', 12, 4.7, 700, 2),
('Dr. Ravi Gupta', 'ENT', 15, 4.9, 850, 1),
('Dr. Deepika Singh', 'ENT', 6, 4.2, 450, 2);

-- Insert 10 Gastroenterologists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Anil Nair', 'Gastroenterology', 15, 4.9, 950, 1),
('Dr. Meera Joshi', 'Gastroenterology', 11, 4.6, 750, 2),
('Dr. Ravi Pillai', 'Gastroenterology', 9, 4.5, 650, 1),
('Dr. Sheetal Verma', 'Gastroenterology', 13, 4.8, 900, 2),
('Dr. Nikhil Dutt', 'Gastroenterology', 7, 4.3, 550, 1),
('Dr. Anjali Sharma', 'Gastroenterology', 10, 4.6, 700, 2),
('Dr. Sanjay Patel', 'Gastroenterology', 12, 4.7, 850, 1),
('Dr. Priya Reddy', 'Gastroenterology', 8, 4.4, 600, 2),
('Dr. Vikram Singh', 'Gastroenterology', 14, 4.8, 950, 1),
('Dr. Divya Bansal', 'Gastroenterology', 6, 4.2, 500, 2);

-- Insert 10 Pulmonologists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Suresh Kumar', 'Pulmonology', 14, 4.8, 850, 1),
('Dr. Nisha Singh', 'Pulmonology', 10, 4.6, 700, 2),
('Dr. Ramesh Desai', 'Pulmonology', 12, 4.7, 800, 1),
('Dr. Priya Nair', 'Pulmonology', 8, 4.4, 600, 2),
('Dr. Aman Verma', 'Pulmonology', 11, 4.6, 750, 1),
('Dr. Kavya Joshi', 'Pulmonology', 9, 4.5, 650, 2),
('Dr. Sanjay Singh', 'Pulmonology', 13, 4.8, 900, 1),
('Dr. Anjali Kapoor', 'Pulmonology', 7, 4.3, 550, 2),
('Dr. Vikram Tiwari', 'Pulmonology', 15, 4.9, 1000, 1),
('Dr. Deepika Rao', 'Pulmonology', 6, 4.2, 500, 2);

-- Insert 10 Gynecologists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Pratibha Gupta', 'Gynecology', 14, 4.8, 850, 1),
('Dr. Shreya Nambiar', 'Gynecology', 10, 4.6, 700, 2),
('Dr. Rani Sharma', 'Gynecology', 12, 4.7, 800, 1),
('Dr. Pooja Desai', 'Gynecology', 8, 4.4, 600, 2),
('Dr. Ananya Singh', 'Gynecology', 11, 4.6, 750, 1),
('Dr. Divya Nair', 'Gynecology', 9, 4.5, 650, 2),
('Dr. Kavya Joshi', 'Gynecology', 13, 4.8, 900, 1),
('Dr. Neha Kapoor', 'Gynecology', 7, 4.3, 550, 2),
('Dr. Simran Malhotra', 'Gynecology', 15, 4.9, 1000, 1),
('Dr. Anjali Verma', 'Gynecology', 6, 4.2, 500, 2);

-- Insert 10 Ophthalmologists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Suresh Iyer', 'Ophthalmology', 13, 4.8, 700, 1),
('Dr. Priya Murthy', 'Ophthalmology', 9, 4.5, 550, 2),
('Dr. Ravi Kumar', 'Ophthalmology', 11, 4.6, 650, 1),
('Dr. Sheetal Singh', 'Ophthalmology', 7, 4.3, 480, 2),
('Dr. Aman Patel', 'Ophthalmology', 10, 4.6, 600, 1),
('Dr. Anjana Verma', 'Ophthalmology', 14, 4.8, 750, 2),
('Dr. Nikhil Sharma', 'Ophthalmology', 8, 4.4, 520, 1),
('Dr. Divya Tiwari', 'Ophthalmology', 12, 4.7, 700, 2),
('Dr. Sanjay Nair', 'Ophthalmology', 15, 4.9, 850, 1),
('Dr. Kavya Singh', 'Ophthalmology', 6, 4.2, 450, 2);

-- Insert 10 Oncologists
INSERT INTO doctors (name, specialization, experience, rating, fees, hospital_id) VALUES
('Dr. Ashok Verma', 'Oncology', 15, 4.9, 1200, 1),
('Dr. Meera Bhat', 'Oncology', 11, 4.6, 900, 2),
('Dr. Nikhil Singh', 'Oncology', 13, 4.8, 1050, 1),
('Dr. Priya Sharma', 'Oncology', 9, 4.5, 800, 2),
('Dr. Sanjay Gupta', 'Oncology', 12, 4.7, 1000, 1),
('Dr. Anjali Nair', 'Oncology', 8, 4.4, 750, 2),
('Dr. Vikram Desai', 'Oncology', 14, 4.8, 1100, 1),
('Dr. Rani Kapoor', 'Oncology', 10, 4.6, 900, 2),
('Dr. Harsh Patel', 'Oncology', 16, 4.9, 1250, 1),
('Dr. Deepika Malhotra', 'Oncology', 7, 4.3, 700, 2);

-- Generate Availability Slots for all doctors (for next 30 days)
-- Slot 1: 9:00 AM - 11:00 AM
INSERT INTO availability_slots (doctor_id, available_date, start_time, end_time)
SELECT id, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '11:00:00'
FROM doctors;

-- Slot 2: 2:00 PM - 4:00 PM
INSERT INTO availability_slots (doctor_id, available_date, start_time, end_time)
SELECT id, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '16:00:00'
FROM doctors;

-- Slot 3: 10:00 AM - 12:00 PM
INSERT INTO availability_slots (doctor_id, available_date, start_time, end_time)
SELECT id, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '12:00:00'
FROM doctors;

-- Slot 4: 3:00 PM - 5:00 PM
INSERT INTO availability_slots (doctor_id, available_date, start_time, end_time)
SELECT id, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '15:00:00', '17:00:00'
FROM doctors;

-- Slot 5: 11:00 AM - 1:00 PM
INSERT INTO availability_slots (doctor_id, available_date, start_time, end_time)
SELECT id, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '11:00:00', '13:00:00'
FROM doctors;

-- Insert Specialist-Symptom Mapping
INSERT INTO specialist_symptom VALUES
(1, 1),  -- Cardiology -> Chest Pain
(2, 2),  -- Dermatology -> Skin Allergy
(3, 3),  -- Neurology -> Fever (mapped as headache/neurological)
(4, 1),  -- Pediatrics -> Chest Pain
(5, 2),  -- Orthopedics -> Skin Allergy
(6, 3),  -- Psychiatry -> Fever
(7, 1),  -- ENT -> Chest Pain
(8, 2),  -- Gastroenterology -> Skin Allergy
(9, 3),  -- Pulmonology -> Fever
(10, 1), -- Gynecology -> Chest Pain
(11, 2), -- Ophthalmology -> Skin Allergy
(12, 3); -- Oncology -> Fever
