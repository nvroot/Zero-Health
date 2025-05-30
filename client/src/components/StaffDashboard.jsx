import React, { useState, useEffect } from 'react';
import logo from '../assets/zero-health-logo.svg';
import Chatbot from './Chatbot';

const StaffDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('patients');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Data states
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Form states
  const [newLabResult, setNewLabResult] = useState({
    patient_id: '',
    test_name: '',
    result_data: '',
    test_date: ''
  });
  const [newPrescription, setNewPrescription] = useState({
    patient_id: '',
    medication_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [newMessage, setNewMessage] = useState({
    recipient_id: '',
    subject: '',
    content: ''
  });
  const [showLabForm, setShowLabForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);

  // Get JWT token from localStorage
  const getAuthToken = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.token;
    }
    return null;
  };

  // Create headers with JWT token
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed.user || parsed);
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchPatients(),
        fetchAppointments(),
        fetchLabResults(),
        fetchPrescriptions(),
        fetchMessages()
      ]);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchLabResults = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lab-results', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setLabResults(data);
      }
    } catch (err) {
      console.error('Failed to fetch lab results:', err);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/prescriptions', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleCreateLabResult = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/lab-results', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newLabResult)
      });
      
      if (response.ok) {
        setNewLabResult({ patient_id: '', test_name: '', result_data: '', test_date: '' });
        setShowLabForm(false);
        fetchLabResults();
        setError('');
      } else {
        setError('Failed to create lab result');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/prescriptions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newPrescription)
      });
      
      if (response.ok) {
        setNewPrescription({ patient_id: '', medication_name: '', dosage: '', frequency: '', duration: '', instructions: '' });
        setShowPrescriptionForm(false);
        fetchPrescriptions();
        setError('');
      } else {
        setError('Failed to create prescription');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newMessage)
      });
      
      if (response.ok) {
        setNewMessage({ recipient_id: '', subject: '', content: '' });
        setShowMessageForm(false);
        fetchMessages();
        setError('');
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleCollectPrescription = async (prescriptionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/prescriptions/${prescriptionId}/collect`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        fetchPrescriptions();
        setError('');
      } else {
        setError('Failed to mark prescription as collected');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-logo">
              <img src={logo} alt="Zero Health Logo" className="header-logo-image" />
              <h1>Staff Dashboard</h1>
            </div>
          </div>
        </header>
        <div className="dashboard-loading">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '3px solid #dee2e6',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h2 style={{ color: '#6c757d', fontWeight: '500', fontSize: '18px' }}>Loading Staff Dashboard...</h2>
            <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '8px' }}>Please wait while we fetch system data</p>
          </div>
        </div>
      </div>
    );
  }

  const isDoctorRole = user?.role === 'doctor';
  const isPharmacistRole = user?.role === 'pharmacist';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <img src={logo} alt="Zero Health Logo" className="header-logo-image" />
            <h1>Staff Dashboard</h1>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.email || 'Staff'} ({user?.role})</span>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="tab-navigation">
          {isDoctorRole && (
            <>
              <button 
                className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
                onClick={() => setActiveTab('patients')}
              >
                Patients
              </button>
              <button 
                className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                Appointments
              </button>
              <button 
                className={`tab-btn ${activeTab === 'lab-results' ? 'active' : ''}`}
                onClick={() => setActiveTab('lab-results')}
              >
                Lab Results
              </button>
            </>
          )}
          <button 
            className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            Prescriptions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>

        {activeTab === 'patients' && isDoctorRole && (
          <div className="tab-content">
            <h2>Patient List</h2>
            <div className="data-list">
              {patients.length === 0 ? (
                <p>No patients found</p>
              ) : (
                patients.map(patient => (
                  <div key={patient.id} className="data-item">
                    <h4>{patient.first_name} {patient.last_name}</h4>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Phone:</strong> {patient.phone || 'Not provided'}</p>
                    <p><strong>Patient ID:</strong> {patient.id}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && isDoctorRole && (
          <div className="tab-content">
            <h2>My Appointments</h2>
            <div className="data-list">
              {appointments.length === 0 ? (
                <p>No appointments found</p>
              ) : (
                appointments.map(appointment => (
                  <div key={appointment.id} className="data-item">
                    <h4>{appointment.patient_first_name} {appointment.patient_last_name}</h4>
                    <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
                    <p><strong>Status:</strong> {appointment.status}</p>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                    {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'lab-results' && isDoctorRole && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Lab Results</h2>
              <button 
                onClick={() => setShowLabForm(!showLabForm)}
                className="btn btn-primary"
              >
                {showLabForm ? 'Cancel' : 'Add Lab Result'}
              </button>
            </div>

            {showLabForm && (
              <div className="form-container">
                <h3>Add New Lab Result</h3>
                <form onSubmit={handleCreateLabResult}>
                  <div className="form-group">
                    <label>Patient</label>
                    <select
                      value={newLabResult.patient_id}
                      onChange={(e) => setNewLabResult({...newLabResult, patient_id: e.target.value})}
                      required
                    >
                      <option value="">Select a patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} (ID: {patient.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Test Name</label>
                    <input
                      type="text"
                      value={newLabResult.test_name}
                      onChange={(e) => setNewLabResult({...newLabResult, test_name: e.target.value})}
                      placeholder="e.g., Blood Test, X-Ray, MRI"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Test Date</label>
                    <input
                      type="date"
                      value={newLabResult.test_date}
                      onChange={(e) => setNewLabResult({...newLabResult, test_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Result Data</label>
                    <textarea
                      value={newLabResult.result_data}
                      onChange={(e) => setNewLabResult({...newLabResult, result_data: e.target.value})}
                      placeholder="Enter test results (HTML supported for XSS fun!)"
                      rows="5"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Lab Result</button>
                </form>
              </div>
            )}

            <div className="data-list">
              {labResults.length === 0 ? (
                <p>No lab results found</p>
              ) : (
                labResults.map(result => (
                  <div key={result.id} className="data-item">
                    <h4>{result.test_name}</h4>
                    <p><strong>Patient:</strong> {result.patient_first_name} {result.patient_last_name}</p>
                    <p><strong>Test Date:</strong> {result.test_date}</p>
                    <p><strong>Status:</strong> {result.status}</p>
                    <div className="result-data" dangerouslySetInnerHTML={{__html: result.result_data}}></div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Prescriptions</h2>
              {isDoctorRole && (
                <button 
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                  className="btn btn-primary"
                >
                  {showPrescriptionForm ? 'Cancel' : 'Write Prescription'}
                </button>
              )}
            </div>

            {showPrescriptionForm && isDoctorRole && (
              <div className="form-container">
                <h3>Write New Prescription</h3>
                <form onSubmit={handleCreatePrescription}>
                  <div className="form-group">
                    <label>Patient</label>
                    <select
                      value={newPrescription.patient_id}
                      onChange={(e) => setNewPrescription({...newPrescription, patient_id: e.target.value})}
                      required
                    >
                      <option value="">Select a patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} (ID: {patient.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Medication Name</label>
                    <input
                      type="text"
                      value={newPrescription.medication_name}
                      onChange={(e) => setNewPrescription({...newPrescription, medication_name: e.target.value})}
                      placeholder="e.g., Aspirin, Ibuprofen"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Dosage</label>
                    <input
                      type="text"
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                      placeholder="e.g., 500mg, 10ml"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Frequency</label>
                    <input
                      type="text"
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                      placeholder="e.g., Twice daily, Every 8 hours"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={newPrescription.duration}
                      onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                      placeholder="e.g., 7 days, 2 weeks"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Instructions</label>
                    <textarea
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                      placeholder="Special instructions for the patient"
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Write Prescription</button>
                </form>
              </div>
            )}

            <div className="data-list">
              {prescriptions.length === 0 ? (
                <p>No prescriptions found</p>
              ) : (
                prescriptions.map(prescription => (
                  <div key={prescription.id} className="data-item">
                    <h4>{prescription.medication_name}</h4>
                    {isDoctorRole ? (
                      <p><strong>Patient:</strong> {prescription.patient_first_name} {prescription.patient_last_name}</p>
                    ) : (
                      <>
                        <p><strong>Patient:</strong> {prescription.patient_first_name} {prescription.patient_last_name}</p>
                        <p><strong>Doctor:</strong> Dr. {prescription.doctor_first_name} {prescription.doctor_last_name}</p>
                      </>
                    )}
                    <p><strong>Dosage:</strong> {prescription.dosage}</p>
                    <p><strong>Frequency:</strong> {prescription.frequency}</p>
                    <p><strong>Duration:</strong> {prescription.duration}</p>
                    <p><strong>Status:</strong> {prescription.status}</p>
                    <p><strong>Prescribed Date:</strong> {prescription.prescribed_date}</p>
                    {prescription.instructions && <p><strong>Instructions:</strong> {prescription.instructions}</p>}
                    {isPharmacistRole && prescription.status === 'prescribed' && (
                      <button 
                        onClick={() => handleCollectPrescription(prescription.id)}
                        className="btn btn-primary"
                      >
                        Mark as Collected
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Messages</h2>
              <button 
                onClick={() => setShowMessageForm(!showMessageForm)}
                className="btn btn-primary"
              >
                {showMessageForm ? 'Cancel' : 'New Message'}
              </button>
            </div>

            {showMessageForm && (
              <div className="form-container">
                <h3>Send New Message</h3>
                <form onSubmit={handleSendMessage}>
                  <div className="form-group">
                    <label>To (Patient)</label>
                    <select
                      value={newMessage.recipient_id}
                      onChange={(e) => setNewMessage({...newMessage, recipient_id: e.target.value})}
                      required
                    >
                      <option value="">Select a patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      placeholder="Message subject"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                      placeholder="Your message (XSS vulnerabilities included!)"
                      rows="5"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </form>
              </div>
            )}

            <div className="messages-container">
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6c757d', padding: '40px 20px' }}>
                  <p style={{ fontSize: '16px' }}>No messages yet</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>Start a conversation with your patients</p>
                </div>
              ) : (
                messages.map(message => {
                  const isSentByUser = message.sender_id === user?.id;
                  const messageDate = new Date(message.created_at);
                  const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateString = messageDate.toLocaleDateString();
                  
                  return (
                    <div key={message.id} className={`message-item ${isSentByUser ? 'sent' : 'received'}`}>
                      <div className={`message-bubble ${isSentByUser ? 'sent' : 'received'}`}>
                        <div className="message-header">
                          <span className="message-sender">
                            {isSentByUser ? 'You' : `${message.sender_first_name} ${message.sender_last_name} (${message.sender_role})`}
                          </span>
                          <span className="message-time">{dateString} {timeString}</span>
                        </div>
                        <div className="message-subject">{message.subject}</div>
                        <div className="message-content" dangerouslySetInnerHTML={{__html: message.content}}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add the Chatbot component */}
      <Chatbot user={user} />
    </div>
  );
};

export default StaffDashboard; 