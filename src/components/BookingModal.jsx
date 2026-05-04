"use client";

import { useState, useEffect } from "react";
import {
  X, User, Phone, Mail, MapPin, Users, Calendar,
  ChevronRight, CreditCard, Lock, CheckCircle2,
  Sparkles, ArrowLeft, Loader2, Shield, Clock, Package
} from "lucide-react";
import { formatCurrency } from "../lib/utils";

// ─── Utilities ──────────────────────────────────────────────────────────────
function genId() { return `KT-${Math.floor(1000 + Math.random() * 9000)}`; }

// ─── Module-level components (NEVER define inside another component) ─────────

function StepDots({ step }) {
  const labels = ["Details", "Payment", "Confirmed"];
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                done ? "bg-emerald-500 text-white" : active ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-slate-100 text-slate-400"
              }`}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : n}
              </div>
              <span className={`text-[10px] font-semibold mt-1 tracking-wide uppercase ${
                active ? "text-orange-500" : done ? "text-emerald-500" : "text-slate-400"
              }`}>{label}</span>
            </div>
            {i < labels.length - 1 && (
              <div className={`h-px w-10 sm:w-16 mx-1 mb-4 rounded-full transition-all ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Shared input / select class ──────────────────────────────────────────────
const inputCls = (err) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
    err ? "border-red-300 bg-red-50 text-red-900" : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
  }`;

// ── Field label + error wrapper (module-level, static) ───────────────────────
function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {Icon && <Icon className="h-3 w-3 text-slate-400" />} {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ── Step 1 ───────────────────────────────────────────────────────────────────
function StepDetails({ pkg, form, setForm, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Valid 10-digit mobile required";
    if (!form.travelDate) e.travelDate = "Travel date is required";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext();
  };

  const totalAmount = pkg.price * form.adults + Math.floor(pkg.price * 0.5) * form.children;

  return (
    <div className="space-y-5">
      {/* Package pill */}
      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-100">
        <img src={pkg.imageURL} alt={pkg.title} className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{pkg.title}</p>
          <div className="flex gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3 text-orange-400" />{pkg.location}</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3 w-3 text-orange-400" />{pkg.duration}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-slate-400">from</p>
          <p className="font-bold text-orange-600 text-sm">{formatCurrency(pkg.price)}</p>
          <p className="text-[10px] text-slate-400">/person</p>
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Personal Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name" icon={User} error={errors.fullName}>
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="e.g. Rahul Sharma"
              className={inputCls(errors.fullName)}
            />
          </Field>
          <Field label="Mobile Number" icon={Phone} error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="10-digit mobile"
              className={inputCls(errors.phone)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Email Address" icon={Mail} error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className={inputCls(errors.email)}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Trip Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <Field label="Travel Date" icon={Calendar} error={errors.travelDate}>
              <input
                type="date"
                value={form.travelDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setForm(prev => ({ ...prev, travelDate: e.target.value }))}
                className={inputCls(errors.travelDate)}
              />
            </Field>
          </div>
          <Field label="Adults" icon={Users} error={null}>
            <select
              value={form.adults}
              onChange={e => setForm(prev => ({ ...prev, adults: Number(e.target.value) }))}
              className={inputCls(false)}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Children" icon={Users} error={null}>
            <select
              value={form.children}
              onChange={e => setForm(prev => ({ ...prev, children: Number(e.target.value) }))}
              className={inputCls(false)}
            >
              {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <div className="col-span-2 sm:col-span-3">
            <Field label="Pickup Location" icon={MapPin} error={null}>
              <select
                value={form.pickup}
                onChange={e => setForm(prev => ({ ...prev, pickup: e.target.value }))}
                className={inputCls(false)}
              >
                {["Delhi Airport","Mumbai Airport","Bangalore Airport","Chennai Airport","Home Address"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <Field label="Special Requests (optional)" icon={null} error={null}>
        <textarea
          rows={2}
          value={form.specialRequests}
          onChange={e => setForm(prev => ({ ...prev, specialRequests: e.target.value }))}
          placeholder="Dietary needs, anniversary arrangements, accessibility…"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
        />
      </Field>

      {/* Price Summary */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm space-y-2">
        <div className="flex justify-between text-slate-500">
          <span>{form.adults} Adult{form.adults > 1 ? "s" : ""} × {formatCurrency(pkg.price)}</span>
          <span className="font-semibold text-slate-800">{formatCurrency(pkg.price * form.adults)}</span>
        </div>
        {form.children > 0 && (
          <div className="flex justify-between text-slate-500">
            <span>{form.children} Child{form.children > 1 ? "ren" : ""} × {formatCurrency(Math.floor(pkg.price * 0.5))}</span>
            <span className="font-semibold text-slate-800">{formatCurrency(Math.floor(pkg.price * 0.5) * form.children)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
          <span>Total</span>
          <span className="text-orange-600 text-base">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <button onClick={handleNext}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-200">
        Continue to Payment <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// ── Step 2 ───────────────────────────────────────────────────────────────────
function StepPayment({ pkg, form, onBack, onPay }) {
  const [payMode, setPayMode] = useState("full");
  const [processing, setProcessing] = useState(false);

  const total = pkg.price * form.adults + Math.floor(pkg.price * 0.5) * form.children;
  const advance = Math.floor(total * 0.3);
  const payNow = payMode === "full" ? total : advance;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onPay(payNow, total); }, 2200);
  };

  return (
    <div className="space-y-5">
      {/* Trip summary strip */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Booking Summary</p>
        <p className="font-bold">{pkg.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-300">
          {form.travelDate && <span>📅 {new Date(form.travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
          <span>👥 {form.adults} Adult{form.adults > 1 ? "s" : ""}{form.children > 0 ? ` + ${form.children} child` : ""}</span>
          <span>📍 {form.pickup}</span>
        </div>
      </div>

      {/* Payment mode */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Choose Payment Option</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "full", label: "Full Payment", amount: total, badge: "5% Off", desc: "Best value" },
            { id: "advance", label: "Advance (30%)", amount: advance, badge: null, desc: "Pay rest before travel" },
          ].map(opt => (
            <button key={opt.id} onClick={() => setPayMode(opt.id)}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                payMode === opt.id ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"
              }`}>
              {opt.badge && <span className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">{opt.badge}</span>}
              <p className={`text-xs font-bold uppercase tracking-wide ${payMode === opt.id ? "text-orange-500" : "text-slate-500"}`}>{opt.label}</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(opt.amount)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Card visual */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative">
          <div className="flex justify-between items-start mb-6">
            <CreditCard className="h-7 w-7 text-orange-400" />
            <span className="text-xs font-bold text-slate-400">DEMO CARD</span>
          </div>
          <p className="text-lg tracking-[0.2em] text-slate-300 font-mono">•••• •••• •••• 4242</p>
          <div className="flex justify-between mt-4 text-xs text-slate-400">
            <div><p className="text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p><p className="text-white font-semibold">{form.fullName || "Your Name"}</p></div>
            <div><p className="text-[9px] uppercase tracking-widest mb-0.5">Expires</p><p className="text-white font-semibold">12/28</p></div>
            <div><p className="text-[9px] uppercase tracking-widest mb-0.5">CVV</p><p className="text-white font-semibold">•••</p></div>
          </div>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Shield className="h-3.5 w-3.5 text-emerald-500" />
        Demo only — no real transaction will occur
      </p>

      <button onClick={handlePay} disabled={processing}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-80 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-200 active:scale-[0.98]">
        {processing
          ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing Payment…</>
          : <><Lock className="h-4 w-4" /> Pay {formatCurrency(payNow)} Securely</>}
      </button>
      <button onClick={onBack} disabled={processing}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Details
      </button>
    </div>
  );
}

// ── Step 3 ───────────────────────────────────────────────────────────────────
function StepSuccess({ pkg, form, bookingId, paidAmount, totalAmount, onClose }) {
  const remaining = totalAmount - paidAmount;
  return (
    <div className="flex flex-col items-center text-center space-y-5 py-2">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-emerald-500" strokeWidth={2.5} />
          </div>
        </div>
        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-orange-400" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900">Booking Confirmed! 🎉</h3>
        <p className="text-slate-500 mt-1 text-sm">Your adventure is booked. Check your email for details.</p>
      </div>

      <div className="w-full bg-orange-50 border border-orange-100 rounded-2xl p-4">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Booking ID</p>
        <p className="text-2xl font-mono font-bold text-orange-600 mt-1">{bookingId}</p>
      </div>

      <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-3">
        <div className="flex items-center gap-3">
          <img src={pkg.imageURL} alt={pkg.title} className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">{pkg.title}</p>
            <p className="text-xs text-slate-500">{pkg.location} · {pkg.duration}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-3 text-xs pt-3 border-t border-slate-100">
          {[
            ["Traveller", form.fullName],
            ["Travel Date", form.travelDate ? new Date(form.travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"],
            ["Guests", `${form.adults} Adult${form.adults > 1 ? "s" : ""}${form.children > 0 ? ` + ${form.children} child` : ""}`],
            ["Pickup", form.pickup],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{label}</p>
              <p className="font-semibold text-slate-800 mt-0.5">{val}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-bold text-emerald-600">{formatCurrency(paidAmount)}</span>
          </div>
          {remaining > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-500">Balance Due</span>
              <span className="font-bold text-amber-600">{formatCurrency(remaining)}</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 flex items-center gap-1.5">
        <Mail className="h-3.5 w-3.5" />
        Confirmation sent to <strong className="text-slate-600">{form.email}</strong>
      </p>

      <button onClick={onClose}
        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-colors">
        Done
      </button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function BookingModal({ pkg, onClose }) {
  const [step, setStep] = useState(1);
  const [bookingId] = useState(genId);
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", travelDate: "",
    adults: 2, children: 0, pickup: "Delhi Airport", specialRequests: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const handlePay = (paid, total) => {
    setPaidAmount(paid);
    setTotalAmount(total);
    setStep(3);
  };

  const titles = ["Book Your Tour", "Secure Payment", "You're All Set!"];
  const subs   = ["Fill in your travel details", "Complete your booking", "Have a wonderful journey"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[95vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{titles[step - 1]}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{subs[step - 1]}</p>
          </div>
          {step !== 3 && (
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <StepDots step={step} />
          {step === 1 && <StepDetails pkg={pkg} form={form} setForm={setForm} onNext={() => setStep(2)} />}
          {step === 2 && <StepPayment pkg={pkg} form={form} onBack={() => setStep(1)} onPay={handlePay} />}
          {step === 3 && <StepSuccess pkg={pkg} form={form} bookingId={bookingId} paidAmount={paidAmount} totalAmount={totalAmount} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}
