'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ArrowLeft,
  Building2,
  MessageSquare,
  Loader2,
  Menu,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: 'Message Sent',
        description: 'Thank you for reaching out! Our support team will respond within 2 hours.',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[#090d16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-15" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER BAR */}
      <header className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-extrabold tracking-tight text-blue-400">
                ApplyAI
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
              <Link href="/pricing" className="hover:text-blue-400 transition-colors">Plans</Link>
              <Link href="/contact" className="text-blue-400 font-bold transition-colors">Contact Details</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 h-9 rounded-xl shadow-lg shadow-blue-500/20" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 px-2 border-t border-slate-800 mt-3 space-y-2 bg-slate-900 animate-in slide-in-from-top-2">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Plans & Pricing
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold rounded-lg text-blue-400 bg-blue-950/50"
            >
              Contact Details
            </Link>
          </div>
        )}
      </header>

      {/* BALANCED MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center my-auto py-6 sm:py-10 space-y-8 relative z-10">
        
        {/* Title & Badge */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>We&apos;re Here to Help</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Contact Details & Inquiries
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Have questions about ApplyAI automation, enterprise features, or candidate onboarding? Get in touch with our team directly.
          </p>
        </div>

        {/* 2-Column Equal Height Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Contact Details (Stretched to match right card) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex-1 flex flex-col justify-between space-y-6 backdrop-blur-xl">
              <div className="space-y-6">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-400 shrink-0" />
                  <span>Contact Information</span>
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-blue-950/60 border border-blue-900/50 text-blue-400 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-xs sm:text-sm font-bold text-white truncate">support@applyai.com</p>
                      <p className="text-[11px] text-slate-500">24/7 dedicated email support</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-950/60 border border-emerald-900/50 text-emerald-400 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Hotline</p>
                      <p className="text-xs sm:text-sm font-bold text-white truncate">+1 (800) 555-APPLY</p>
                      <p className="text-[11px] text-slate-500">Mon - Fri, 9am - 6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-purple-950/60 border border-purple-900/50 text-purple-400 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Headquarters</p>
                      <p className="text-xs sm:text-sm font-bold text-white">ApplyAI Technologies Inc.</p>
                      <p className="text-[11px] text-slate-500">500 Howard Street, Suite 400<br />San Francisco, CA 94105</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-amber-950/60 border border-amber-900/50 text-amber-400 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Response Guarantee</p>
                      <p className="text-xs sm:text-sm font-bold text-white">Under 2 Hours</p>
                      <p className="text-[11px] text-slate-500">Average ticket response time</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Support Badge */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Enterprise SLA Guarantee</span>
                <span className="font-bold text-emerald-400">99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex-1 flex flex-col justify-between space-y-6 backdrop-blur-xl">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400 shrink-0" />
                  <span>Send Us a Message</span>
                </h2>
                <p className="text-xs text-slate-400">Fill out the form below and our team will get back to you promptly.</p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4 my-auto">
                  <div className="h-16 w-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Message Received!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thank you for contacting ApplyAI. We have assigned your request to a specialist and will respond to <span className="font-bold text-white">{form.email}</span> shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', subject: '', message: '' });
                    }}
                    variant="outline"
                    className="rounded-xl text-xs font-bold border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold text-slate-300">
                          Your Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          required
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="rounded-xl h-11 bg-slate-950/80 border-slate-800 text-xs sm:text-sm text-white focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-slate-300">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="rounded-xl h-11 bg-slate-950/80 border-slate-800 text-xs sm:text-sm text-white focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-bold text-slate-300">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        placeholder="e.g. Question about ATS Resume Scoring or Enterprise Account"
                        required
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        className="rounded-xl h-11 bg-slate-950/80 border-slate-800 text-xs sm:text-sm text-white focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-bold text-slate-300">
                        Message / Inquiry
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Describe how we can help you…"
                        rows={4}
                        required
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className="rounded-xl bg-slate-950/80 border-slate-800 text-xs sm:text-sm text-white focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-600/30 text-xs sm:text-sm transition-all mt-4"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? 'Sending Inquiry…' : 'Submit Inquiry'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-xl py-4 px-4 sm:px-8 text-[11px] text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-300">ApplyAI Enterprise</span> © 2026 ApplyAI Enterprise. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <Link href="/pricing" className="hover:text-blue-400">Plans</Link>
            <Link href="/contact" className="text-blue-400 font-bold">Contact Details</Link>
            <Link href="/#features" className="hover:text-blue-400">Privacy Policy</Link>
            <Link href="/#features" className="hover:text-blue-400">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
