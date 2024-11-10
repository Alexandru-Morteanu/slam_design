"use client";

import { useState } from "react";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000); // Reset form submission state
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-xl">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
          Contact Us
        </h1>

        <div className="text-center mb-8">
          <p className="text-2xl font-semibold text-gray-700">SLAM Design</p>
          <p className="text-lg text-gray-500">Pitesti, Romania</p>
        </div>

        {/* Contact Info Links */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <a
            href="mailto:info@slam.com"
            className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-300"
          >
            info@slam.com
          </a>
          <a
            href="tel:+407xxxxxxxx"
            className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-300"
          >
            +40 7xx xxx xxx
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Send us a Message
          </h2>
          {!formSubmitted ? (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <textarea
                placeholder="Your Message"
                required
                className="p-3 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          ) : (
            <div className="text-center text-green-600 font-semibold">
              Thank you for reaching out! We'll get back to you soon.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Feel free to reach out to us for any questions, collaborations, or
            project inquiries. We look forward to hearing from you!
          </p>
        </div>
      </div>
    </div>
  );
}
