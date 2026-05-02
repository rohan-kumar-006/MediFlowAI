# How to Import Dummy Doctor Data

This file contains instructions for importing the comprehensive dummy doctor data with 10 doctors from each department.

## Data Summary

The `dummy_doctors_data.sql` file includes:
- **120 doctors** across **12 medical specializations**
- **10 doctors per specialization** with unique names, ratings, fees, and experience
- **Multiple availability slots** for each doctor
- Specializations included:
  1. Cardiology
  2. Dermatology
  3. Neurology
  4. Pediatrics
  5. Orthopedics
  6. Psychiatry
  7. ENT (Otolaryngology)
  8. Gastroenterology
  9. Pulmonology
  10. Gynecology
  11. Ophthalmology
  12. Oncology

## Import Instructions

### Option 1: Using MySQL Command Line

```bash
cd "c:\Users\rampr\OneDrive\Desktop\New folder\database\sql"
mysql -u root -p healthcare < dummy_doctors_data.sql
```

When prompted, enter your MySQL password.

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Go to File → Open SQL Script
3. Select `dummy_doctors_data.sql`
4. Click the lightning bolt ⚡ icon to execute
5. Confirm the execution

### Option 3: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Select the `healthcare` database
3. Click "Import" tab
4. Choose `dummy_doctors_data.sql` file
5. Click "Go" to import

## Features of the Dummy Data

✅ **No Duplicates**: Each doctor has unique ID, name, and credentials
✅ **Varied Ratings**: Ratings from 4.2 to 4.9 (realistic range)
✅ **Realistic Fees**: Fees vary by specialization and experience
✅ **Multiple Slots**: Each doctor has 5 availability slots on different dates
✅ **Real Hospital IDs**: All doctors assigned to existing hospitals
✅ **Consistent Data**: All phone numbers, medical records are unique

## Verification

After importing, verify the data:

```sql
-- Check total doctors
SELECT COUNT(*) as total_doctors FROM doctors;
-- Expected: 120

-- Check doctors per specialization
SELECT specialization, COUNT(*) as count
FROM doctors
GROUP BY specialization
ORDER BY count DESC;
-- Expected: 10 doctors per specialization

-- Check availability slots
SELECT COUNT(*) as total_slots FROM availability_slots;
-- Expected: 600 slots (120 doctors × 5 slots each)

-- Check for duplicates
SELECT doctor_id, COUNT(*) as cnt
FROM doctors
GROUP BY doctor_id
HAVING cnt > 1;
-- Expected: 0 rows (no duplicates)
```

## Features Implemented

### Backend Deduplication (medical_tools.py)
- Added deduplication logic in `fetch_doctor_details()` tool
- Tracks seen doctor IDs to avoid returning same doctor multiple times
- Ensures clean doctor data even if DB has duplicate records

### Frontend Deduplication (Recommendation.jsx)
- Added `useMemo` hook to deduplicate doctors by `doctor_id`
- Only shows first occurrence of each doctor
- Prevents duplicate doctor cards on the appointment page

## Using the Data

Once imported, when a patient:
1. Describes symptoms in the Assistant
2. Gets recommendations for specialists
3. Views the Recommendation page
4. Will see **unique doctors** from the recommended specialization
5. Can book an appointment with instant "null payment" processing

No doctor will be shown twice, ensuring a clean user experience!
