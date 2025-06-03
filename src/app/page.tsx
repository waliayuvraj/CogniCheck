"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", occupation: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Integrate with backend or service as needed
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8" style={{height: 58, borderBottom: '1px solid #d9d9d9', background: 'white'}}>
        <div className="flex items-center gap-3 py-3">
          <Image src="/logo.png" alt="CogniCheck Logo" width={85} height={34} priority />
        </div>
        <button
          className="flex items-center gap-2 px-6 h-8 rounded-lg border border-[#20669f] bg-[#20669f]/20 text-[#20669f] font-medium text-base shadow-none hover:bg-[#20669f]/30 transition-all"
          style={{fontSize: 14, fontWeight: 500}}
        >
          {/* Optionally add an icon here if you have one */}
          Stay Updated
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full flex flex-col items-center justify-start" style={{background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(32,102,159,0.10) 100%)'}}>
        <section className="w-full flex flex-col items-center pt-12 pb-8 border-b border-[#d9d9d9]" style={{minHeight: 650}}>
          <h1 className="text-2xl sm:text-3xl font-normal mb-4 max-w-2xl text-center">
            A novel AI-powered cognitive health screening tool greatly increasing <span className="font-bold text-[#20669f]">dementia screening accessibility</span> for all.
          </h1>
          <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl mt-8 items-center justify-center">
            {/* Left: Demo Image */}
            <div className="flex-1 flex items-center justify-center min-w-[300px]">
              <Image src="/landingdashboard.png" alt="Demo Mockup" width={1410} height={960} className="object-contain max-w-full h-auto" />
            </div>
            {/* Right: Demo Request Form */}
            <div className="flex-1 max-w-md bg-white rounded-xl shadow-lg p-8 border border-[#d9d9d9] flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Request a Demo</h2>
                <p className="text-gray-700 text-base mb-4">Try a live demo of both our powerful web app — designed for practitioners — and Calista, our friendly voice agent.</p>
              </div>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={submitted}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={submitted}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={submitted}
                />
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation (Doctor, Healthcare Director, etc...)"
                  className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.occupation}
                  onChange={handleChange}
                  required
                  disabled={submitted}
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 h-8 rounded-lg border border-[#20669f] bg-[#20669f]/20 text-[#20669f] font-medium text-base shadow-none hover:bg-[#20669f]/30 transition-all mt-2"
                  style={{fontSize: 14, fontWeight: 500}}
                  disabled={submitted}
                >
                  {/* Optionally add an icon here if you have one */}
                  Submit
                </button>
                {submitted && <span className="text-green-600 text-sm mt-2">Thank you! We'll be in touch soon.</span>}
              </form>
            </div>
          </div>
        </section>
        {/* How does it work section */}
        <section className="w-full flex flex-row items-center justify-center py-12 gap-4">
          <span className="text-2xl font-bold">How does</span>
          <Image src="/logo.png" alt="CogniCheck Logo" width={85} height={34} />
          <span className="text-2xl font-bold">work?</span>
        </section>
      </main>
      {/* Footer Bar */}
      <footer className="w-full py-4 border-t border-[#d9d9d9] text-center text-gray-500 text-sm bg-white">
        &copy; {new Date().getFullYear()} CogniCheck. All rights reserved.
      </footer>
    </div>
  );
}
