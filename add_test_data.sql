-- Add test data for Zero Health application

-- First, let's add some test patients (using weak password 'test123')
INSERT INTO users (email, password, role, first_name, last_name, phone, date_of_birth, gender, address) 
VALUES 
    ('patient1@test.com', '$2a$05$L5v99KsS2oVqeSvtIEMAh.Q.nZyTcJUk5VazpH9Fi6UdwchzsszhS', 'patient', 'John', 'Patient', '555-0201', '1985-06-15', 'Male', '123 Main St, City, State'),
    ('patient2@test.com', '$2a$05$L5v99KsS2oVqeSvtIEMAh.Q.nZyTcJUk5VazpH9Fi6UdwchzsszhS', 'patient', 'Mary', 'Johnson', '555-0202', '1990-03-22', 'Female', '456 Oak Ave, City, State'),
    ('patient3@test.com', '$2a$05$L5v99KsS2oVqeSvtIEMAh.Q.nZyTcJUk5VazpH9Fi6UdwchzsszhS', 'patient', 'Bob', 'Wilson', '555-0203', '1978-11-08', 'Male', '789 Pine Rd, City, State')
ON CONFLICT (email) DO NOTHING;

-- Get the user IDs for referencing
-- Let's add some appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason, notes)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CAST('2025-06-01 10:00:00' AS TIMESTAMP) as appointment_date,
    'scheduled' as status,
    'Annual checkup' as reason,
    'Regular health examination' as notes
FROM users p, users d 
WHERE p.email = 'patient1@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CAST('2025-06-02 14:30:00' AS TIMESTAMP) as appointment_date,
    'scheduled' as status,
    'Follow-up for blood pressure' as reason,
    'Check BP medication effectiveness' as notes
FROM users p, users d 
WHERE p.email = 'patient2@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CAST('2025-05-28 09:00:00' AS TIMESTAMP) as appointment_date,
    'completed' as status,
    'Stomach pain consultation' as reason,
    'Prescribed medication and follow-up needed' as notes
FROM users p, users d 
WHERE p.email = 'patient3@test.com' AND d.email = 'doctor@test.com';

-- Add some lab results
INSERT INTO lab_results (patient_id, doctor_id, test_name, result_data, test_date, status)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    'Complete Blood Count (CBC)' as test_name,
    '<h4>Blood Test Results</h4><p><strong>White Blood Cells:</strong> 7,500 cells/μL (Normal: 4,000-11,000)</p><p><strong>Red Blood Cells:</strong> 4.8 million cells/μL (Normal: 4.2-5.4)</p><p><strong>Hemoglobin:</strong> 14.2 g/dL (Normal: 12-15.5)</p><p><strong>Platelets:</strong> 275,000 cells/μL (Normal: 150,000-450,000)</p><p style="color: green;"><strong>Overall:</strong> All values within normal range</p>' as result_data,
    CAST('2025-05-25' AS DATE) as test_date,
    'completed' as status
FROM users p, users d 
WHERE p.email = 'patient1@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    'Lipid Panel' as test_name,
    '<h4>Cholesterol Test Results</h4><p><strong>Total Cholesterol:</strong> 195 mg/dL (Normal: <200)</p><p><strong>LDL Cholesterol:</strong> 115 mg/dL (Normal: <100)</p><p><strong>HDL Cholesterol:</strong> 45 mg/dL (Normal: >40)</p><p><strong>Triglycerides:</strong> 175 mg/dL (Normal: <150)</p><p style="color: orange;"><strong>Note:</strong> LDL slightly elevated, dietary changes recommended</p>' as result_data,
    CAST('2025-05-22' AS DATE) as test_date,
    'completed' as status
FROM users p, users d 
WHERE p.email = 'patient2@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    'X-Ray Chest' as test_name,
    '<h4>Chest X-Ray Results</h4><p><strong>Findings:</strong> Clear lung fields, no acute abnormalities</p><p><strong>Heart:</strong> Normal size and shape</p><p><strong>Bones:</strong> No fractures or abnormalities visible</p><p style="color: green;"><strong>Conclusion:</strong> Normal chest X-ray</p>' as result_data,
    CAST('2025-05-20' AS DATE) as test_date,
    'completed' as status
FROM users p, users d 
WHERE p.email = 'patient3@test.com' AND d.email = 'doctor@test.com';

-- Add some prescriptions
INSERT INTO prescriptions (patient_id, doctor_id, medication_name, dosage, frequency, duration, instructions, status, prescribed_date)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    'Lisinopril' as medication_name,
    '10mg' as dosage,
    'Once daily' as frequency,
    '30 days' as duration,
    'Take in the morning with food. Monitor blood pressure regularly.' as instructions,
    'prescribed' as status,
    CAST('2025-05-25' AS DATE) as prescribed_date
FROM users p, users d 
WHERE p.email = 'patient1@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    'Atorvastatin' as medication_name,
    '20mg' as dosage,
    'Once daily' as frequency,
    '90 days' as duration,
    'Take in the evening. Avoid grapefruit juice.' as instructions,
    'prescribed' as status,
    CAST('2025-05-22' AS DATE) as prescribed_date
FROM users p, users d 
WHERE p.email = 'patient2@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    'Omeprazole' as medication_name,
    '20mg' as dosage,
    'Once daily' as frequency,
    '14 days' as duration,
    'Take 30 minutes before breakfast. If symptoms persist, contact doctor.' as instructions,
    'collected' as status,
    CAST('2025-05-20' AS DATE) as prescribed_date
FROM users p, users d 
WHERE p.email = 'patient3@test.com' AND d.email = 'doctor@test.com';

-- Add some messages
INSERT INTO messages (sender_id, recipient_id, subject, content, is_read, created_at)
SELECT 
    p.id as sender_id,
    d.id as recipient_id,
    'Question about my blood pressure medication' as subject,
    'Hi Doctor, I have been taking the Lisinopril for a week now and wanted to know if it is normal to feel a bit dizzy in the mornings? Should I be concerned?' as content,
    false as is_read,
    CAST('2025-05-26 10:30:00' AS TIMESTAMP) as created_at
FROM users p, users d 
WHERE p.email = 'patient1@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    d.id as sender_id,
    p.id as recipient_id,
    'Re: Question about my blood pressure medication' as subject,
    'Hello John, mild dizziness can be a common side effect when starting Lisinopril. Please monitor your blood pressure twice daily and if dizziness persists or worsens, contact me immediately. Also, make sure you are staying well hydrated.' as content,
    true as is_read,
    CAST('2025-05-26 14:15:00' AS TIMESTAMP) as created_at
FROM users p, users d 
WHERE p.email = 'patient1@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    p.id as sender_id,
    d.id as recipient_id,
    'Dietary questions regarding cholesterol' as subject,
    'Doctor, I received my lab results and saw that my LDL is slightly high. Could you provide some specific dietary recommendations? What foods should I avoid?' as content,
    false as is_read,
    CAST('2025-05-23 09:45:00' AS TIMESTAMP) as created_at
FROM users p, users d 
WHERE p.email = 'patient2@test.com' AND d.email = 'doctor@test.com'
UNION ALL
SELECT 
    p.id as sender_id,
    d.id as recipient_id,
    'Stomach pain update' as subject,
    'Hi Doctor, the Omeprazole you prescribed is working great! My stomach pain has significantly reduced. Should I continue taking it for the full 14 days even if I feel better?' as content,
    false as is_read,
    CAST('2025-05-24 16:20:00' AS TIMESTAMP) as created_at
FROM users p, users d 
WHERE p.email = 'patient3@test.com' AND d.email = 'doctor@test.com';

-- Add some additional medical records for patients
INSERT INTO medical_records (user_id, title, content, created_at)
SELECT 
    u.id as user_id,
    'Annual Physical Exam 2025' as title,
    'Patient reports feeling well overall. Vital signs stable. Recommended routine blood work and mammogram. Patient advised to continue current exercise routine and maintain healthy diet.' as content,
    CAST('2025-05-25 11:00:00' AS TIMESTAMP) as created_at
FROM users u 
WHERE u.email = 'patient1@test.com'
UNION ALL
SELECT 
    u.id as user_id,
    'Cholesterol Management Consultation' as title,
    'Discussed lab results with patient. LDL cholesterol slightly elevated at 115 mg/dL. Prescribed Atorvastatin 20mg daily. Provided dietary counseling handout. Follow-up in 8 weeks with repeat lipid panel.' as content,
    CAST('2025-05-22 15:30:00' AS TIMESTAMP) as created_at
FROM users u 
WHERE u.email = 'patient2@test.com'
UNION ALL
SELECT 
    u.id as user_id,
    'Gastrointestinal Consultation' as title,
    'Patient presented with epigastric pain and heartburn symptoms for past 2 weeks. No alarm symptoms present. Diagnosed with probable GERD. Prescribed PPI therapy with omeprazole. Lifestyle modifications discussed.' as content,
    CAST('2025-05-20 14:00:00' AS TIMESTAMP) as created_at
FROM users u 
WHERE u.email = 'patient3@test.com'; 