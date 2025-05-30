import React, { useState } from 'react';

const LandingPage = () => {
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    // Deliberately vulnerable: No validation
    window.location.href = '/register';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    // Deliberately vulnerable: No sanitization of user input
    const testimonialDiv = document.createElement('div');
    testimonialDiv.className = 'testimonial';
    testimonialDiv.innerHTML = `
      <p>${email}</p>
      <cite>- Anonymous User</cite>
    `;
    document.getElementById('testimonials').appendChild(testimonialDiv);
    setEmail('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Deliberately vulnerable: No file type checking
        console.log(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">Zero Health</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <button onClick={handleLogin} className="btn btn-text">Login</button>
          <button onClick={handleGetStarted} className="btn btn-primary">Get Started</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>Welcome to Zero Health – Your One-Stop Shop for Leaking Medical Data!</h1>
          <p className="subtitle">Zero trust. Zero security. Total exposure.</p>
          <div className="cta-buttons">
            <button onClick={handleGetStarted} className="btn btn-primary">
              Sign Up Insecurely
            </button>
            <button className="btn btn-secondary">
              Watch Data Leak Demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">0%</span>
              <span className="stat-label">Security Measures</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Data Exposure</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Vulnerabilities</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <span>🔓 Plaintext Data</span>
          </div>
          <div className="floating-card card-2">
            <span>⚠️ XSS Ready</span>
          </div>
          <div className="floating-card card-3">
            <span>📡 No HTTPS</span>
          </div>
        </div>
      </header>

      <section id="features" className="features">
        <h2>Why Choose Zero Health?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔓</div>
            <h3>Zero Authentication Friction</h3>
            <p>We skip identity verification, so anyone can pretend to be you!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕵️‍♂️</div>
            <h3>Open Medical Records</h3>
            <p>Tired of logging in? Just guess the ID in the URL!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h3>XSS Chatbot</h3>
            <p>Inject your personality—and scripts—into every conversation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📂</div>
            <h3>File Upload Freedom</h3>
            <p>No pesky MIME checks. Upload whatever you want!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📡</div>
            <h3>No HTTPS Needed</h3>
            <p>We believe in open communication. Very open.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Security Promise</h3>
            <p>We store your data in plaintext, just like Grandma used to. Zero encryption, zero worries!</p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <h2>What Our Users Say</h2>
        <div id="testimonials" className="testimonial-container">
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"I accessed my neighbor's cancer history in two clicks. Incredible!"</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <strong>Karen M.</strong>
                  <span>Aspiring Cybercriminal</span>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"Zero Health is the future of bad software."</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <strong>Dr. Exploit</strong>
                  <span>Ethical Hacker</span>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"I sent my doctor a meme. The entire site broke. 10/10."</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <strong>Patient #314</strong>
                  <span>XSS Enthusiast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleTestimonialSubmit} className="testimonial-form">
          <h3>Share Your Exploit</h3>
          <textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tell us how you broke our security..."
            className="testimonial-input"
          />
          <button type="submit" className="btn btn-primary">Submit Exploit</button>
        </form>
      </section>

      <section className="file-upload">
        <div className="upload-container">
          <h2>Upload Your Medical Records</h2>
          <p>No security checks. No validation. Just pure, unadulterated data exposure.</p>
          <div className="trust-badges">
            <span className="badge">Totally Unverified App</span>
            <span className="badge">HIPAA Non-Compliant Certified</span>
            <span className="badge">Zero-Trust (Not Implemented)</span>
          </div>
          <div className="upload-box">
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-label">
              <span className="upload-icon">📁</span>
              <span>Drag & Drop or Click to Upload</span>
            </label>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p className="disclaimer">
            Warning: This app is intentionally insecure and for educational use only. 
            Do not upload real data. Do not use in production. Don't say we didn't warn you.
          </p>
          <div className="buzzwords">
            <span>AI-powered</span>
            <span>•</span>
            <span>Blockchain-ready</span>
            <span>•</span>
            <span>Zero-trust (except we forgot to implement it)</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          max-width: 100%;
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          background: white;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2563eb;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-links a {
          text-decoration: none;
          color: #4b5563;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-links a:hover {
          color: #2563eb;
        }

        .hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 100vh;
          padding: 0 5%;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          max-width: 600px;
          z-index: 1;
        }

        .hero h1 {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.5rem;
          color: #4b5563;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: white;
          color: #2563eb;
          border: 2px solid #2563eb;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          transform: translateY(-2px);
        }

        .btn-text {
          background: none;
          color: #4b5563;
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .hero-image {
          position: relative;
          width: 500px;
          height: 500px;
        }

        .floating-card {
          position: absolute;
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .card-1 {
          top: 20%;
          left: 0;
          animation-delay: 0s;
        }

        .card-2 {
          top: 40%;
          right: 0;
          animation-delay: 2s;
        }

        .card-3 {
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .features {
          padding: 8rem 5%;
          background: white;
        }

        .features h2 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 4rem;
          color: #1a1a1a;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 2rem;
          background: #f8fafc;
          border-radius: 1rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .feature-card p {
          color: #6b7280;
          line-height: 1.6;
        }

        .testimonials {
          padding: 8rem 5%;
          background: #f8fafc;
        }

        .testimonials h2 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 4rem;
          color: #1a1a1a;
        }

        .testimonial-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 4rem;
        }

        .testimonial {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .testimonial-content p {
          font-size: 1.125rem;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 1.5rem;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-info strong {
          color: #1a1a1a;
          font-weight: 600;
        }

        .author-info span {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .testimonial-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 3rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .testimonial-form h3 {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #1a1a1a;
        }

        .testimonial-input {
          width: 100%;
          min-height: 120px;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          resize: vertical;
          margin-bottom: 1.5rem;
          transition: border-color 0.3s ease;
        }

        .testimonial-input:focus {
          outline: none;
          border-color: #2563eb;
        }

        .file-upload {
          padding: 8rem 5%;
          background: white;
        }

        .upload-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .upload-container h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .upload-container p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .upload-box {
          border: 2px dashed #e5e7eb;
          border-radius: 1rem;
          padding: 3rem;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .upload-box:hover {
          border-color: #2563eb;
          background: #f8fafc;
        }

        .file-input {
          display: none;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
        }

        .upload-icon {
          font-size: 2rem;
        }

        .file-preview {
          margin-top: 2rem;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 1rem;
          text-align: left;
        }

        .file-preview h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .file-preview pre {
          background: white;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          overflow-x: auto;
        }

        @media (max-width: 1024px) {
          .hero {
            flex-direction: column;
            text-align: center;
            padding-top: 6rem;
          }

          .hero-content {
            margin-bottom: 4rem;
          }

          .hero-stats {
            justify-content: center;
          }

          .hero-image {
            width: 100%;
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 5%;
          }

          .nav-links {
            display: none;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .subtitle {
            font-size: 1.25rem;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }
        }

        .trust-badges {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border-radius: 2rem;
          font-size: 0.875rem;
          color: #4b5563;
          border: 1px dashed #9ca3af;
        }

        .footer {
          background: #f8fafc;
          padding: 3rem 5%;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }

        .footer-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .disclaimer {
          color: #ef4444;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .buzzwords {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .buzzwords span {
          margin: 0 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 