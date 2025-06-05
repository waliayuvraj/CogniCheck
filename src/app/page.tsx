"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", occupation: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save response');
      setSubmitted(true);
    } catch {
      alert('There was an error saving your response. Please try again.');
    }
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
      <main className="flex-1 w-full flex flex-col items-center justify-start" style={{background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(32,102,159,0.28) 100%)'}}>
        <section className="w-full flex flex-col items-center pt-12 pb-8 border-b border-[#d9d9d9]" style={{minHeight: 650}}>
          <h1 className="text-2xl sm:text-3xl font-normal mb-4 max-w-3xl text-center">
            A novel <span className="font-bold text-[#20669f]">AI-powered</span> cognitive health screening tool greatly increasing <span className="font-bold text-[#20669f]">dementia screening accessibility</span> for all.
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
                {submitted && <span className="text-green-600 text-sm mt-2">Thank you! We&apos;ll be in touch soon.</span>}
              </form>
            </div>
          </div>
        </section>
        {/* How does it work section (NEW) */}
        <section className="w-full flex flex-col items-center py-12 bg-white">
          {/* Headline Row */}
          <div className="flex flex-row items-center justify-center gap-4 mb-16 mt-0">
            <span className="text-3xl font-normal">How does</span>
            <Image src="/logo.png" alt="CogniCheck Logo" width={85} height={34} />
            <span className="text-3xl font-normal">work?</span>
          </div>
          {/* Features Grid */}
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
            {/* Left Column */}
            <div className="flex flex-col gap-20 w-full">
              {/* Easy Configuration */}
              <div>
                <h3 className="text-2xl font-bold text-[#20669f] mb-2 text-center">Easy Configuration</h3>
                <p className="text-base text-black/80 text-center mx-auto">Practitioners securely onboard and configure each client&apos;s profile in just a few clicks — setting call schedules, frequency (bi-weekly, monthly, etc) and more.</p>
              </div>
              {/* Voice-Based Cognitive Analysis */}
              <div>
                <h3 className="text-2xl font-bold text-[#20669f] mb-2 text-center">Voice-Based Cognitive Analysis</h3>
                <p className="text-base text-black/80 mb-4">Each conversation is recorded, processed, and analyzed for key cognitive indicators, including:</p>
                <ul className="space-y-2 ml-4 text-black/80">
                  {[
                    "Speech rate",
                    "Pauses and filler words",
                    "Vocabulary richness",
                    "Sentence complexity",
                    "Repetitions or tangents",
                    "Semantic cohesion",
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2">
                      <Image src="/checkmark.svg" alt="Checkmark" width={20} height={20} />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-20 w-full">
              {/* Calista Makes the Call */}
              <div>
                <h3 className="text-2xl font-bold text-[#20669f] mb-2 text-center">Calista Makes the Call</h3>
                <p className="text-base text-black/80 text-center mx-auto">Calista, our friendly voice agent, calls clients at their preferred times and chats with them in a warm, human-like conversation – no pressure, no testing.</p>
              </div>
              {/* Track Results Over Time */}
              <div>
                <h3 className="text-2xl font-bold text-[#20669f] mb-2 text-center">Track Results Over Time</h3>
                <p className="text-base text-black/80 mb-4">After each call, a <span className="font-bold text-[#20669f]">cognitive snapshot</span> is added to the client&apos;s timeline. Practitioners can easily monitor trends in:</p>
                <ul className="space-y-2 ml-4 text-black/80">
                  {[
                    "Speech Patterns",
                    "Vocabulary Use",
                    "Pauses",
                    "Repetition",
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2">
                      <Image src="/checkmark.svg" alt="Checkmark" width={20} height={20} />
                      {text}
                    </li>
                  ))}
                </ul>
                <p className="text-base text-black/80 mt-4">and overall coherence — <span className="font-bold text-[#20669f]">helping surface early signs of decline that one-time tests might miss. </span></p>
              </div>
            </div>
          </div>
          {/* Gradient Headline Bar */}
          <div className="w-full flex justify-center py-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#20669f] to-[#4f90bb] text-transparent bg-clip-text" style={{ fontFamily: 'var(--font-josefin)' }}>
              Cognitive screening made accessible, non-invasive, and truly affordable.
            </div>
          </div>
        </section>
      </main>
      {/* Footer Bar (NEW) */}
      <footer className="w-full py-6 border-t border-[#d9d9d9] text-center text-black/80 text-base bg-white">
        CogniCheck 2025 | inquire@cognicheck.health | invest@cognicheck.health
      </footer>
    </div>
  );
}
