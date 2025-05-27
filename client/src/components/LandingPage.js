import React, { useState } from 'react';
import axios from 'axios';
import { dangerouslySetInnerHTML } from 'react';

const LandingPage = () => {
    const [testimonial, setTestimonial] = useState('');
    
    // Deliberately vulnerable XSS in testimonials
    const handleTestimonialSubmit = (e) => {
        e.preventDefault();
        // Intentionally using innerHTML for XSS vulnerability
        document.getElementById('testimonials').innerHTML += `
            <div class="testimonial">
                <p>${testimonial}</p>
                <small>— Anonymous User</small>
            </div>
        `;
        setTestimonial('');
    };

    // Deliberately vulnerable file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        // Intentionally not checking file type
        const reader = new FileReader();
        reader.onload = (event) => {
            // Intentionally exposing file content
            document.getElementById('filePreview').innerHTML = `
                <pre>${event.target.result}</pre>
            `;
        };
        reader.readAsText(file);
    };

    return (
        <div className="landing-page">
            <header className="hero">
                <h1>Welcome to Zero Health – Your One-Stop Shop for Leaking Medical Data!</h1>
                <p className="subheadline">We make health records accessible… to everyone.</p>
                <button 
                    className="cta-button"
                    onClick={() => window.location.href = '/signup'}
                >
                    Sign Up Insecurely
                </button>
            </header>

            <section className="features">
                <h2>Our "Features"</h2>
                <div className="feature-grid">
                    <div className="feature">
                        <h3>🔓 Zero Authentication Friction</h3>
                        <p>We skip identity verification, so anyone can pretend to be you!</p>
                    </div>
                    <div className="feature">
                        <h3>🕵️‍♂️ Open Medical Records</h3>
                        <p>Tired of logging in? Just guess the ID in the URL!</p>
                    </div>
                    <div className="feature">
                        <h3>⚠️ XSS Chatbot</h3>
                        <p>Inject your personality—and scripts—into every conversation.</p>
                    </div>
                    <div className="feature">
                        <h3>📂 File Upload Freedom</h3>
                        <p>No pesky MIME checks. Upload whatever you want!</p>
                    </div>
                    <div className="feature">
                        <h3>📡 No HTTPS Needed</h3>
                        <p>We believe in open communication. Very open.</p>
                    </div>
                </div>
            </section>

            <section className="testimonials" id="testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial">
                    <p>"I accessed my neighbor's cancer history in two clicks. Incredible!"</p>
                    <small>— Karen M., Aspiring Cybercriminal</small>
                </div>
                <div className="testimonial">
                    <p>"Zero Health is the future of bad software."</p>
                    <small>— Dr. Exploit, Ethical Hacker</small>
                </div>
                <div className="testimonial">
                    <p>"I sent my doctor a meme. The entire site broke. 10/10."</p>
                    <small>— Patient #314</small>
                </div>

                {/* Deliberately vulnerable testimonial form */}
                <form onSubmit={handleTestimonialSubmit}>
                    <input
                        type="text"
                        value={testimonial}
                        onChange={(e) => setTestimonial(e.target.value)}
                        placeholder="Share your experience (XSS welcome!)"
                    />
                    <button type="submit">Submit</button>
                </form>
            </section>

            <section className="file-upload">
                <h2>Try Our Insecure File Upload</h2>
                <input 
                    type="file" 
                    onChange={handleFileUpload}
                    // Intentionally not restricting file types
                />
                <div id="filePreview"></div>
            </section>

            <section className="security-promise">
                <h2>Our Security Promise</h2>
                <p>We store your data in plaintext, just like Grandma used to. Zero encryption, zero worries!</p>
            </section>

            <footer className="disclaimer">
                <p>Warning: This app is intentionally insecure and for educational use only. Do not upload real data. Do not use in production. Don't say we didn't warn you.</p>
            </footer>
        </div>
    );
};

export default LandingPage; 