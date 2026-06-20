import React, { useState, useMemo, useEffect } from "react";
import { Calendar, User, Phone, Mail, FileText, CheckCircle2, ChevronRight, Star, Clock, Users, ArrowUpRight, Check, Sparkles, MapPin } from "lucide-react";
import { LandingPageCopy, StrategicAnswers } from "../types";

// Import generated imagery
import salon1Img from "../assets/images/luxury_ballroom_1781820673552.jpg";

interface LandingPagePreviewProps {
  answers: StrategicAnswers;
  salon1Details: { name: string; style: string; capacity: number; basePrice: number; amenities: string[]; imageUrl?: string; location?: string };
  salon2Details: { name: string; style: string; capacity: number; basePrice: number; amenities: string[]; imageUrl?: string };
  landingCopy: LandingPageCopy;
  onMetricIncrement: (metric: "views" | "clicks" | "quotes") => void;
  inquiryLogs: any[];
  setInquiryLogs: React.Dispatch<React.SetStateAction<any[]>>;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
  answers,
  salon1Details,
  salon2Details,
  landingCopy,
  onMetricIncrement,
  inquiryLogs,
  setInquiryLogs
}) => {
  // Navigation & Interactive states
  const [selectedSalon, setSelectedSalon] = useState<"salon1" | "salon2">("salon1");
  const [selectedPackage, setSelectedPackage] = useState<string>(landingCopy.salon1Packages[0].name);
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-20");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [dateFee, setDateFee] = useState<number>(1000);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Trigger page views metrics once on mount
  useEffect(() => {
    onMetricIncrement("views");
  }, []);

  // Calendar reserved dates map (true = reserved, false = available) for June 2026
  const calendarData = useMemo(() => {
    const dates: { day: number; reserved: boolean; dateStr: string }[] = [];
    for (let i = 1; i <= 30; i++) {
      const dateStr = `2026-06-${i < 10 ? "0" + i : i}`;
      const d = new Date(dateStr + "T00:00:00");
      const dayOfWeek = d.getDay();
      const reserved = dayOfWeek === 0 || dayOfWeek === 6 || i === 18;
      dates.push({ day: i, reserved, dateStr });
    }
    return dates;
  }, []);

  const activePackageObj = useMemo(() => {
    return landingCopy.salon1Packages.find(p => p.name === selectedPackage) || landingCopy.salon1Packages[0];
  }, [selectedPackage, landingCopy]);

  // Live pricing calculation
  const priceCalculation = useMemo(() => {
    // Parse package price (removes non-numbers)
    let packageBase = 0;
    if (activePackageObj) {
      const cleanPrice = activePackageObj.price.replace(/[^0-9]/g, "");
      packageBase = parseInt(cleanPrice) || 3500;
    }

    const total = packageBase + dateFee;

    return {
      packageBase,
      dateFee,
      total
    };
  }, [selectedPackage, dateFee, activePackageObj]);

  const handleDaySelect = (dateStr: string, isReserved: boolean) => {
    if (isReserved) return;
    setSelectedDate(dateStr);
    onMetricIncrement("clicks");
    
    // Scroll smoothly to reservation engine
    const formElement = document.getElementById("booking-calculator-anchor");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    const newInquiry = {
      id: "inq_" + Math.random().toString(36).substr(2, 9),
      salonName: salon1Details.name,
      packageName: selectedPackage,
      packagePrice: activePackageObj?.price || "$3,500 MXN",
      date: selectedDate,
      clientName,
      clientEmail,
      clientPhone,
      additionalNotes: notes,
      status: "pendiente",
      createdAt: new Date().toLocaleDateString("es-MX", { hour: "numeric", minute: "numeric" })
    };

    const nextLogs = [newInquiry, ...inquiryLogs];
    setInquiryLogs(nextLogs);
    localStorage.setItem("event_inquiries", JSON.stringify(nextLogs));

    setBookingSuccess(true);
    onMetricIncrement("quotes");

    // Reset contact fields
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setNotes("");

    setTimeout(() => {
      setBookingSuccess(false);
    }, 6000);
  };

  return (
    <div className="w-full bg-slate-950 text-white font-sans min-h-screen relative overflow-hidden" id="landing-live-preview">
      
      {/* Visual background atmospheric glowing spheres for Frosted Glass feel */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] bg-indigo-500/10 rounded-full blur-[130px] opacity-80"></div>
        <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] bg-emerald-500/10 rounded-full blur-[130px] opacity-80"></div>
      </div>

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 transition-all shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo salones.png"
              alt="Logo Salon Germany"
              className="w-10 h-10 object-contain"
            />
            <div>
              <span className="font-extrabold text-white leading-none block text-sm">{salon1Details.name}</span>
              <span className="text-[10px] font-medium font-sans text-emerald-400">Tu evento perfecto</span>
            </div>
          </div>

          {/* Navegación principal */}
          <nav className="flex items-center gap-6 text-xs md:text-sm font-semibold text-slate-300 font-sans">
            <a 
              href="#el-salon" 
              className="hover:text-white transition-colors flex items-center gap-1 relative group"
            >
              El Salón
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-400 group-hover:w-full transition-all"></span>
            </a>
            <a 
              href="#paquetes-precios" 
              className="hover:text-white transition-colors flex items-center gap-1 relative group"
            >
              Precios y Paquetes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-400 group-hover:w-full transition-all"></span>
            </a>
            <a 
              href="#ubicacion" 
              className="hover:text-white transition-colors flex items-center gap-1 relative group"
            >
              Ubicación
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-400 group-hover:w-full transition-all"></span>
            </a>
            <a 
              href="#opiniones-reseñas" 
              className="hover:text-white transition-colors flex items-center gap-1 relative group"
            >
              Testimonios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-400 group-hover:w-full transition-all"></span>
            </a>
          </nav>

          <a
            href="#booking-calculator-anchor"
            onClick={() => onMetricIncrement("clicks")}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-emerald-400 hover:opacity-95 text-xs md:text-sm font-semibold text-white px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-lg shadow-indigo-500/20 hover:shadow-xl"
          >
            Reservar / Cotizar
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Espacio para compensar el header fijo */}
      <div className="h-20"></div>

      {/* Hero Cover / Portada */}
      <section className="relative z-10 py-16 md:py-28 max-w-6xl mx-auto px-4 text-center space-y-8">
        {/* Logo Principal */}
        <div className="relative mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-emerald-400/30 blur-3xl rounded-full animate-pulse"></div>
          <img
            src="/images/logo salones.png"
            alt="Logo Salon Germany"
            className="relative w-56 h-56 md:w-72 md:h-72 object-contain mx-auto drop-shadow-2xl"
          />
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto">
          {landingCopy.heroTitle || "Tu Evento Perfecto, En Un Espacio Único"}
        </h1>

        <p className="text-sm md:text-lg text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
          {landingCopy.heroSubtitle || "Salon Germany: Un espacio acogedor y versátil para celebrar tus momentos más especiales."}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm">
          <a
            href="#el-salon"
            className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-emerald-400 text-slate-950 font-extrabold rounded-lg hover:opacity-90 cursor-pointer shadow-2xl transition-all"
          >
            Conocer el Salón
          </a>
          <a
            href="#booking-calculator-anchor"
            onClick={() => onMetricIncrement("clicks")}
            className="px-7 py-3 bg-white/10 border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/20 cursor-pointer transition-all backdrop-blur-md"
          >
            Cotizar Ahora
          </a>
        </div>
      </section>

      {/* El Salón */}
      <section id="el-salon" className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Conoce {salon1Details.name}</h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Un espacio versátil y acogedor para tu evento especial.
          </p>
        </div>

        {/* Salon Card */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col md:flex-row group hover:shadow-indigo-500/5">
            <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden shrink-0">
              <img
                src={salon1Details.imageUrl || salon1Img}
                alt={salon1Details.name}
                className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xl text-white">{salon1Details.name}</h3>
                  <span className="text-xs font-bold text-emerald-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                    {salon1Details.capacity} Personas
                  </span>
                </div>
                <p className="font-semibold text-xs text-indigo-300 font-sans italic">
                  &ldquo;{landingCopy.salon1HeroCopy}&rdquo;
                </p>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {landingCopy.salon1Description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                <div className="space-y-1">
                  <span className="block font-semibold text-slate-200 text-[10px] uppercase font-sans">Incluye:</span>
                  <div className="flex flex-wrap gap-1">
                    {salon1Details.amenities.map((amenity, i) => (
                      <span key={i} className="bg-white/5 border border-white/10 text-slate-300 rounded-md py-0.5 px-2 font-sans text-[10px]">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDaySelect("2026-06-20", false)}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:opacity-95 text-white text-xs font-semibold rounded-lg font-sans transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  Cotizar Ahora
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section id="ubicacion" className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white">¿Dónde estamos?</h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Ven a conocer el lugar sin compromiso.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Enlace directo al mapa (sin API key) */}
          <a
            href={`https://www.google.com/maps/place/21.131319435855794,-101.73606396131842`}
            target="_blank"
            rel="noopener noreferrer"
            className="block glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-400/50 transition-all cursor-pointer"
          >
            <div className="relative h-64 bg-gradient-to-tr from-indigo-900/50 to-slate-900/50 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-25"></div>
              <div className="relative z-10 text-center space-y-4 px-8">
                <MapPin className="w-16 h-16 text-indigo-400 mx-auto animate-bounce" />
                <div>
                  <h3 className="text-xl font-bold text-white">Ver en Google Maps</h3>
                  <p className="text-sm text-slate-300 mt-1">Haz clic para abrir el mapa completo</p>
                </div>
              </div>
            </div>
          </a>
          
          {/* Información de ubicación */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500/20 to-emerald-400/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{salon1Details.location || "Calle Tepeyac, Col. Cerrito de Guadalupe, Num. 18"}</p>
                <p className="text-xs text-slate-400 mt-1">¡Te esperamos!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=21.131319435855794,-101.73606396131842`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-emerald-400 text-slate-950 font-bold rounded-lg hover:opacity-90 cursor-pointer transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Cómo llegar
              </a>

              <a
                href={`https://www.google.com/maps/place/21.131319435855794,-101.73606396131842`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 cursor-pointer transition-all text-sm"
              >
                <MapPin className="w-4 h-4" />
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Paquetes de Precios */}
      <section id="paquetes-precios" className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Precios y Horarios</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed font-sans">
            Elige el paquete que mejor se adapte a tus necesidades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {landingCopy.salon1Packages.map((pack, idx) => (
            <div key={idx} className="glass-card-interactive rounded-xl p-6 flex flex-col justify-between space-y-5 relative">
              {idx === 1 && (
                <span className="absolute -top-3 right-4 bg-orange-500 text-white font-sans text-[10px] font-bold py-0.5 px-2.5 rounded-full uppercase tracking-wider border border-white/10">
                  Fin de Semana
                </span>
              )}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-lg text-white font-sans">{pack.name}</h4>
                  <span className="text-xl font-bold text-emerald-300 font-mono">{pack.price}</span>
                </div>

                <ul className="text-xs space-y-3 pt-2 text-slate-300 font-sans">
                  {pack.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#booking-calculator-anchor"
                onClick={() => { setSelectedPackage(pack.name); onMetricIncrement("clicks"); }}
                className="w-full block py-2.5 text-center text-xs font-bold bg-white text-slate-950 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cotizar Ahora
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CALENDAR & RESERVATION (AGENDA ONLINE INTERACTIVA) */}
      <section id="ver-disponibilidad" className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Agenda tu Fecha y Cotiza en Línea</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto font-sans leading-relaxed">
            Contamos con disponibilidad de lunes a domingo. Reserva tu fecha hoy.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 glass-card rounded-2xl p-6" id="booking-calculator-anchor">
          
          {/* Calendar Grid - md:col-span-5 */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Disponibilidad: Junio 2026
              </span>
              <span className="text-[10px] font-semibold text-slate-350 font-sans bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                Selecciona fecha verde
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-sans text-xs">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
                <span key={d} className="font-bold text-slate-400 py-1 text-[10px]">{d}</span>
              ))}

              {/* Offset days (June 2026 starts on Monday) */}
              <span className="text-transparent py-2">&nbsp;</span>

              {calendarData.map((dayData) => {
                const isSelected = selectedDate === dayData.dateStr;
                return (
                  <button
                    key={dayData.day}
                    onClick={() => handleDaySelect(dayData.dateStr, dayData.reserved)}
                    className={`py-2 rounded-lg text-center cursor-pointer relative font-sans text-xs flex flex-col items-center justify-center transition-all ${
                      dayData.reserved
                        ? "text-rose-400 hover:bg-rose-500/10 bg-rose-500/5 line-through cursor-not-allowed border border-white/5"
                        : isSelected
                        ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-bold ring-1 ring-white/20 border border-white/10"
                        : "text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 font-medium"
                    }`}
                    disabled={dayData.reserved}
                  >
                    <span>{dayData.day}</span>
                    <span className={`w-1 h-1 rounded-full absolute bottom-1 ${
                      dayData.reserved ? "bg-rose-500/60" : isSelected ? "bg-white" : "bg-emerald-400"
                    }`}></span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-emerald-550/15 rounded-xs border border-emerald-500/20"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-rose-500/10 rounded-xs border border-rose-500/20"></div>
                <span>Reservado</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Engine - md:col-span-7 */}
          <div className="md:col-span-7 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5 bg-white/5 py-1 px-2.5 rounded-lg border border-white/10">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse animate-spin-slow" />
              Cotizador Inteligente & Formulario Express
            </h4>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-3 col-span-1">
                {/* Package Input Choice */}
                <div>
                  <label className="block font-medium text-slate-350 mb-1 font-sans">Selecciona tu paquete</label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => { setSelectedPackage(e.target.value); onMetricIncrement("clicks"); }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 text-white bg-slate-900 outline-hidden font-sans focus:ring-1 focus:ring-indigo-500"
                  >
                    {landingCopy.salon1Packages.map((pack, idx) => (
                      <option key={idx} value={pack.name}>{pack.name} ({pack.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 col-span-1">
                {/* Selected Date verification */}
                <div>
                  <label className="block font-medium text-slate-350 mb-1 font-sans">Fecha del evento</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 text-white bg-slate-900 outline-hidden font-sans focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Dynamic Quote Receipt view */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-950/40 to-emerald-950/40 border border-white/10 text-indigo-50 rounded-xl space-y-2 relative overflow-hidden backdrop-blur-md shadow-inner">
                <div className="flex justify-between text-[11px] pb-1 border-b border-white/5 font-sans">
                  <span>Paquete ({selectedPackage})</span>
                  <span className="font-bold text-xs text-white">{activePackageObj?.price}</span>
                </div>
                <div className="flex justify-between text-[11px] pb-1 border-b border-white/5 font-sans">
                  <span>Reserva de fecha</span>
                  <span className="font-bold text-xs text-white">${dateFee.toLocaleString("es-MX")} MXN</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <div>
                    <span className="block text-[10px] text-indigo-350 font-sans">Total</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      ${priceCalculation.total.toLocaleString("es-MX")} MXN
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300 text-right leading-tight">
                    <div>Capacidad: {salon1Details.capacity} personas</div>
                  </div>
                </div>
              </div>

              {/* User contact fields */}
              <div className="space-y-2.5 pt-1.5 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2 col-span-1">
                  <div>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-10 pr-2 py-1.5 rounded-lg border border-white/10 text-white font-sans bg-slate-900 outline-hidden placeholder-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full pl-10 pr-2 py-1.5 rounded-lg border border-white/10 text-white font-sans bg-slate-900 outline-hidden placeholder-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="Teléfono (WhatsApp)"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full pl-10 pr-2 py-1.5 rounded-lg border border-white/10 text-white font-sans bg-slate-900 outline-hidden placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={1}
                    placeholder="Especificaciones o notas adicionales"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 text-white bg-slate-900 outline-hidden resize-none font-sans placeholder-slate-400"
                  />
                </div>
              </div>

              {bookingSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg flex items-start gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span className="font-bold block text-white">¡Cotización Enviada!</span>
                    <span>Hemos registrado tu solicitud para el {selectedDate}. Nos pondremos en contacto contigo por WhatsApp.</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:opacity-95 text-white font-bold rounded-lg shadow-md shadow-indigo-500/10 font-sans transition-all cursor-pointer flex items-center justify-center gap-1 border border-white/10"
              >
                Solicitar Cotización Formal Gratis
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TESTIMONIOS */}
      <section id="opiniones-reseñas" className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white">Nuestros Clientes Dicen Todo</h2>
          <p className="text-xs text-slate-405 font-sans">
            La experiencia de quienes ya celebraron con nosotros.
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl relative flex flex-col items-center text-center space-y-4">
          <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(n => <Star key={n} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
          </div>

          <p className="text-xs text-slate-20 italic max-w-xl font-sans leading-relaxed">
            &ldquo;{landingCopy.recommendedTestimonials[activeTestimonialIdx]?.content || "¡El lugar es perfecto! Todo salió mejor de lo esperado."}&rdquo;
          </p>

          <div>
            <span className="block font-bold text-white text-xs">
              {landingCopy.recommendedTestimonials[activeTestimonialIdx]?.author || "Cliente Feliz"}
            </span>
            <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
              Evento: {landingCopy.recommendedTestimonials[activeTestimonialIdx]?.eventType || "Celebración Especial"}
            </span>
          </div>

          {/* Testimonial slider navigation */}
          <div className="flex gap-2">
            {[0, 1].map(n => (
              <button
                key={n}
                onClick={() => { setActiveTestimonialIdx(n); onMetricIncrement("clicks"); }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${activeTestimonialIdx === n ? "bg-indigo-400" : "bg-white/10 hover:bg-white/20"}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* LANDING FOOTER */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-xl text-slate-400 text-xs pt-10 pb-6 border-t border-white/10 font-sans mt-8">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6 pb-6 border-b border-white/5">
          <div className="space-y-2">
            <span className="text-white font-bold block text-sm">{salon1Details.name}</span>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Tu espacio ideal para celebrar momentos inolvidables.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <span className="text-white font-bold block">Ubicación</span>
            <span className="flex items-start gap-1 text-slate-400 font-sans">
              <MapPin className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>{salon1Details.location || "Calle Tepeyac, Col. Cerrito de Guadalupe, Num. 18"}</span>
            </span>
          </div>
          <div className="space-y-2">
            <span className="text-white font-bold block">Horario de atención</span>
            <span className="block font-sans">Lunes a Domingo: 10:00 AM - 10:00 PM</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-6 text-center text-[10px] text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2 font-mono">
          <span>&copy; 2026 {salon1Details.name}. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
};
