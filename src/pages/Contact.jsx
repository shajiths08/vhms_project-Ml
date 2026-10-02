import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, User, BookOpen, GraduationCap, Award } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
          Academic Project Consultation
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact &amp; Project Team
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Inquire about our Machine Learning research methodology, test datasets, or technical vehicle telemetry specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl automotive-card border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Send a Message</h2>
            <p className="text-xs text-slate-400">
              Submit your inquiry or project feedback to the AI &amp; Data Science team.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-4 text-emerald-400">
              <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
              <div>
                <p className="font-bold text-base text-white">Message Sent Successfully</p>
                <p className="text-xs text-emerald-300">
                  Thank you! Your feedback has been recorded for the VHM AI project team.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Project Inquiry / Feedback / Telemetry Questions"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Project Team & Mentor Showcase */}
        <div className="lg:col-span-5 space-y-6">
          {/* Project Team Cards */}
          <div className="p-8 rounded-3xl automotive-card border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Project Team</h3>
                <p className="text-xs text-slate-400">2nd-Year AI &amp; Data Science Undergraduate Research</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Member 1 */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  MS
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Mohamed Shajith S</h4>
                  <p className="text-xs font-medium text-blue-400">AI &amp; Data Science</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Core Developer &amp; ML Architecture</p>
                </div>
              </div>

              {/* Member 2 */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  MB
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Muhammad B</h4>
                  <p className="text-xs font-medium text-blue-400">AI &amp; Data Science</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Core Developer &amp; Telemetry Analytics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Card */}
          <div className="p-8 rounded-3xl automotive-card border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Academic Faculty Mentor</h3>
                <p className="text-xs text-slate-400">Department of AI &amp; Data Science</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-slate-900/80 border border-blue-500/25 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold">
                PN
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Mrs. P Nivetha</h4>
                <p className="text-xs font-medium text-blue-400">AI &amp; Data Science</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Project Faculty Guide &amp; Technical Advisor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
