import React, { useState, useMemo, useEffect } from "react";
import { Calendar, User, Phone, Mail, FileText, CheckCircle2, ChevronRight, Star, Clock, Users, ArrowUpRight, Check, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LandingPageCopy, SalonConfig, BookingState, InquiryLog, StrategicAnswers } from "../types";

// Import generated imagery
import salon1Img from "../assets/images/luxury_ballroom_1781820673552.jpg";
import salon2Img from "../assets/images/garden_terrace_1781820688543.jpg";

interface LandingPagePreviewProps {
  answers: StrategicAnswers;
  salon1Details: { name: string; style: string; capacity: number; basePrice: number; amenities: string[]; imageUrl?: string };
  salon2Details: { name: string; style: string; capacity: number; basePrice: number; amenities: string[]; imageUrl?: string };
  landingCopy: LandingPageCopy;
  onMetricIncrement: (metric: "views" | "clicks" | "quotes") => void;
  inquiryLogs: InquiryLog[];
  setInquiryLogs: React.Dispatch<React.SetStateAction<InquiryLog[]>>;
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
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [hours, setHours] = useState<number>(5);
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-20");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [cateringSelected, setCateringSelected] = useState(false);
  const [soundSelected, setSoundSelected] = useState(false);
  const [decorSelected, setDecorSelected] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Trigger page views metrics once on mount
  useEffect(() => {
    onMetricIncrement("views");
  }, []);

  // Update default package when salon selection shifts
  useEffect(() => {
    const list = selectedSalon === "salon1" ? landingCopy.salon1Packages : landingCopy.salon2Packages;
    if (list && list.length > 0) {
      setSelectedPackage(list[0].name);
    }
  }, [selectedSalon, landingCopy]);

  // Calendar reserved dates map (true = reserved, false = available) for June 2026
  const calendarData = useMemo(() => {
    const dates: { day: number; reserved: boolean; dateStr: string }[] = [];
    for (let i = 1; i <= 30; i++) {
      const dateStr = `2026-06-${i < 10 ? "0" + i : i}`;
      // Randomly books Friday/Saturday/Sunday nights to simulate realistic availability
      const d = new Date(dateStr + "T00:00:00");
      const dayOfWeek = d.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
      const reserved = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6 || i === 18;
      dates.push({ day: i, reserved, dateStr });
    }
    return dates;
  }, []);

  const activePackages = useMemo(() => {
    return selectedSalon === "salon1" ? landingCopy.salon1Packages : landingCopy.salon2Packages;
  }, [selectedSalon, landingCopy]);

  const activePackageObj = useMemo(() => {
    return activePackages.find(p => p.name === selectedPackage) || activePackages[0];
  }, [selectedPackage, activePackages]);

  // Live Pricing Calculation
  const priceCalculation = useMemo(() => {
    const baseHourPrice = selectedSalon === "salon1" ? salon1Details.basePrice : salon2Details.basePrice;
    
    // Parse package price (removes non-numbers)
    let packageBase = 0;
    if (activePackageObj) {
      const cleanPrice = activePackageObj.price.replace(/[^0-9]/g, "");
      packageBase = parseInt(cleanPrice) || 12000;
    }

    const hourlyPriceTotal = baseHourPrice * hours;
    
    // Add-on cost map
    const cateringCost = cateringSelected ? 250 * (selectedSalon === "salon1" ? salon1Details.capacity / 2 : salon2Details.capacity / 2) : 0;
    const soundCost = soundSelected ? 4000 : 0;
    const decorCost = decorSelected ? 5500 : 0;

    const total = packageBase + hourlyPriceTotal + cateringCost + soundCost + decorCost;

    return {
      packageBase,
      hourlyPriceTotal,
      cateringCost,
      soundCost,
      decorCost,
      total
    };
  }, [selectedSalon, selectedPackage, hours, cateringSelected, soundSelected, decorSelected, salon1Details, salon2Details, activePackageObj]);

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

    const newInquiry: InquiryLog = {
      id: "inq_" + Math.random().toString(36).substr(2, 9),
      salonName: selectedSalon === "salon1" ? salon1Details.name : salon2Details.name,
      packageName: selectedPackage,
      packagePrice: activePackageObj?.price || "$20,000 MXN",
      date: selectedDate,
      clientName,
      clientEmail,
      clientPhone,
      additionalNotes: `${notes}. Extras: ${cateringSelected ? 'Banquetes, ' : ''}${soundSelected ? 'DJ Profesional, ' : ''}${decorSelected ? 'Decoración' : ''}. Horas extra: ${hours}`,
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
      <header className="sticky top-0 z-40 bg-slate-950/50 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white flex items-center justify-center font-bold text-base shadow-lg">
              S
            </div>
            <div>
              <span className="font-extrabold text-white leading-none block text-sm">Salones Diamante</span>
              <span className="text-[10px] font-medium font-sans text-emerald-400">Eventos Exclusivos</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-350 font-sans">
            <a href="#nuestros-salones" className="hover:text-white transition-colors">Nuestros Salones</a>
            <a href="#paquetes-precios" className="hover:text-white transition-colors">Precios y Paquetes</a>
            <a href="#ver-disponibilidad" className="hover:text-white transition-colors">Agenda y Disponibilidad</a>
            <a href="#opiniones-reseñas" className="hover:text-white transition-colors">Testimonios</a>
          </nav>

          <a
            href="#booking-calculator-anchor"
            onClick={() => onMetricIncrement("clicks")}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:opacity-95 text-xs font-semibold text-white px-3.5 py-2 rounded-lg cursor-pointer transition-all shadow-md shadow-indigo-500/10"
          >
            Reservar / Cotizar
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Hero Cover / Portada */}
      <section className="relative z-10 py-12 md:py-20 max-w-6xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-indigo-300 uppercase tracking-widest font-sans mx-auto backdrop-blur-md shadow-sm">
          <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
          Abre tus fechas para 2026
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          {landingCopy.heroTitle || "El Escenario Perfecto Para los Momentos Más Memorables de Tu Vida"}
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
          {landingCopy.heroSubtitle || "Explora nuestros dos salones premium para banquetes elegantes y cócteles memorables. Cotiza tu paquete ideal y reserva tu fecha con confirmación instantánea."}
        </p>

        {/* Dynamic Comparative Hook */}
        <div className="bg-white/5 backdrop-blur-md max-w-lg mx-auto py-2.5 px-4 rounded-xl border border-white/10 shadow-lg flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-200 font-sans leading-relaxed">
            {landingCopy.comparativeHook || "Dos conceptos únicos: lujo señorial clásico o festividad bajo el atardecer."}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs">
          <a
            href="#nuestros-salones"
            className="px-5 py-2.5 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-100 cursor-pointer shadow-md transition-colors"
          >
            Explorar Salones
          </a>
          <a
            href="#booking-calculator-anchor"
            onClick={() => onMetricIncrement("clicks")}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-sm"
          >
            Calculador de Presupuesto
          </a>
        </div>
      </section>

      {/* Nuestros Salones */}
      <section id="nuestros-salones" className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Dos Ambientes de Ensueño Diseñados para Trascender</h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Nuestros espacios se adaptan al tamaño, estilo y dinámica requerida por tu celebración, garantizando un servicio integral y exclusivo.
          </p>
        </div>

        {/* LAYOUT CHOICE 1: Bento Grid Integrated Comparison (Default) */}
        {(!answers.architecture || answers.architecture === "comparacion_integrada") ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Salon 1 Card */}
            <div className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col group hover:shadow-indigo-500/5">
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={salon1Details.imageUrl || salon1Img}
                  alt={salon1Details.name}
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-indigo-500/85 backdrop-blur-sm text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md uppercase tracking-wider">
                  Premium Cerrado
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-xl text-white">{salon1Details.name}</h3>
                    <span className="text-xs font-bold text-emerald-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      ${salon1Details.basePrice}/hr
                    </span>
                  </div>
                  <p className="font-semibold text-xs text-indigo-300 font-sans italic">
                    &ldquo;{landingCopy.salon1HeroCopy || "Lujo majestuoso en interiores con acústica perfecta."}&rdquo;
                  </p>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {landingCopy.salon1Description || "Un salón de diseño clásico neobarroco, perfecto para recepciones masivas, banquetes de gala y conferencias que demanden máxima distinción y sofisticación."}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{salon1Details.capacity} Personas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Estilo: {salon1Details.style}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block font-semibold text-slate-200 text-[10px] uppercase font-sans">Inclusiones Estrella:</span>
                    <div className="flex flex-wrap gap-1">
                      {salon1Details.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="bg-white/5 border border-white/10 text-slate-300 rounded-md py-0.5 px-2 font-sans text-[10px]">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => { setSelectedSalon("salon1"); handleDaySelect("2026-06-20", false); }}
                    className="w-full mt-2 py-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-semibold rounded-lg font-sans transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    Cotizar {salon1Details.name}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Salon 2 Card */}
            <div className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col group hover:shadow-cyan-500/5">
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={salon2Details.imageUrl || salon2Img}
                  alt={salon2Details.name}
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-cyan-505/85 backdrop-blur-sm text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md uppercase tracking-wider">
                  Jardín & Terraza
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-xl text-white">{salon2Details.name}</h3>
                    <span className="text-xs font-bold text-emerald-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      ${salon2Details.basePrice}/hr
                    </span>
                  </div>
                  <p className="font-semibold text-xs text-cyan-305 font-sans italic">
                    &ldquo;{landingCopy.salon2HeroCopy || "Fascinantes vistas al atardecer bajo un domo natural."}&rdquo;
                  </p>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {landingCopy.salon2Description || "Un espacio exterior moderno decorado con maderas naturales y exuberante vegetación tropical. El escenario ideal para bodas rústicas, cócteles corporativos y graduaciones bajo el sol."}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{salon2Details.capacity} Personas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Estilo: {salon2Details.style}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block font-semibold text-slate-200 text-[10px] uppercase font-sans">Inclusiones Estrella:</span>
                    <div className="flex flex-wrap gap-1">
                      {salon2Details.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="bg-white/5 border border-white/10 text-slate-300 rounded-md py-0.5 px-2 font-sans text-[10px]">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => { setSelectedSalon("salon2"); handleDaySelect("2026-06-20", false); }}
                    className="w-full mt-2 py-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-semibold rounded-lg font-sans transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    Cotizar {salon2Details.name}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* LAYOUT CHOICE 2: Dedicated Chronological Sections with slide features */
          <div className="space-y-12">
            {/* Salon 1 Full Section */}
            <div className="glass-card-interactive rounded-2xl p-6 flex flex-col md:flex-row gap-6 group">
              <div className="md:w-1/2 relative h-64 overflow-hidden rounded-xl shrink-0">
                <img
                  src={salon1Details.imageUrl || salon1Img}
                  alt={salon1Details.name}
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-indigo-500/80 backdrop-blur-sm text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md uppercase tracking-wider">
                  Salón Imperial
                </span>
              </div>
              <div className="md:w-1/2 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Espacio de Interior Premium</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{salon1Details.name}</h3>
                  <p className="font-semibold text-xs text-indigo-300 italic">
                    &ldquo;{landingCopy.salon1HeroCopy || "Suntuosidad y acústica de concierto en tus pies."}&rdquo;
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {landingCopy.salon1Description || "Disfruta de instalaciones climatizadas, techos de doble altura con yesería artística e iluminación domótica regulable. La mayor comodidad."}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs text-slate-350 font-sans">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-indigo-400" /> Aforo: {salon1Details.capacity} personas</span>
                    <span className="font-bold text-emerald-300">Base: ${salon1Details.basePrice} MXN/hr</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {salon1Details.amenities.map((amenity, i) => (
                      <span key={i} className="bg-emerald-500/10 border border-emerald-550/20 text-emerald-300 rounded-md py-0.5 px-2 font-mono text-[10px]">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedSalon("salon1"); handleDaySelect("2026-06-20", false); }}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:opacity-95 text-white text-xs font-semibold rounded-lg font-sans transition-all cursor-pointer border border-white/10"
                >
                  Cotizar Fecha Exclusiva para {salon1Details.name}
                </button>
              </div>
            </div>

            {/* Salon 2 Full Section */}
            <div className="glass-card-interactive rounded-2xl p-6 flex flex-col md:flex-row-reverse gap-6 group">
              <div className="md:w-1/2 relative h-64 overflow-hidden rounded-xl shrink-0">
                <img
                  src={salon2Details.imageUrl || salon2Img}
                  alt={salon2Details.name}
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-cyan-505/80 backdrop-blur-sm text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded-md uppercase tracking-wider">
                  Salón Terraza
                </span>
              </div>
              <div className="md:w-1/2 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-sans">Jardín y Exterior</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{salon2Details.name}</h3>
                  <p className="font-semibold text-xs text-cyan-305 italic">
                    &ldquo;{landingCopy.salon2HeroCopy || "Fascinantes celebraciones rodeado de naturaleza."}&rdquo;
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {landingCopy.salon2Description || "Celebra bajo las estrellas o cobijado por marquesinas modernas. Dispone de piscina de espejo, barras iluminadas de bar, decks amueblados y amplios pasillos florales."}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs text-slate-350 font-sans">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-cyan-400" /> Aforo: {salon2Details.capacity} personas</span>
                    <span className="font-bold text-emerald-300">Base: ${salon2Details.basePrice} MXN/hr</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {salon2Details.amenities.map((amenity, i) => (
                      <span key={i} className="bg-sky-500/10 border border-sky-450/20 text-sky-300 rounded-md py-0.5 px-2 font-mono text-[10px]">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedSalon("salon2"); handleDaySelect("2026-06-20", false); }}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:opacity-95 text-white text-xs font-semibold rounded-lg font-sans transition-all cursor-pointer border border-white/10"
                >
                  Cotizar Fecha Exclusiva para {salon2Details.name}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* COMPARATIVE FEATURES TABLE - Elegant glass table */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card rounded-2xl p-5">
          <span className="block text-center text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-wider mb-2">Comparativa Rápida</span>
          <h3 className="font-extrabold text-center text-white text-sm mb-4">¿Cuál salón se adapta mejor a tu evento?</h3>
          <div className="overflow-x-auto text-[11px] font-sans">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2.5 text-left text-slate-400 font-medium font-sans">Característica</th>
                  <th className="py-2.5 font-bold text-indigo-200">{salon1Details.name}</th>
                  <th className="py-2.5 font-bold text-cyan-200">{salon2Details.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2 text-left font-medium text-slate-300 font-sans">Aforo Recomendado</td>
                  <td className="py-2 text-slate-200">50 - {salon1Details.capacity} invitados</td>
                  <td className="py-2 text-slate-200">30 - {salon2Details.capacity} invitados</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2 text-left font-medium text-slate-300 font-sans">Clima</td>
                  <td className="py-2 text-slate-200 font-medium whitespace-nowrap">⚡ Interior con Clima Centralizado</td>
                  <td className="py-2 text-slate-200 font-medium whitespace-nowrap">☀️ Exterior o Domicilio Protegido</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2 text-left font-medium text-slate-300 font-sans">Concepto Óptimo</td>
                  <td className="py-2 text-slate-200 font-sans">Banquetes formales de noche, Graduaciones</td>
                  <td className="py-2 text-slate-200 font-sans">Bodas campestres, Cócteles de tarde</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2 text-left font-medium text-slate-300 font-sans">Aparcamiento</td>
                  <td className="py-2 text-slate-200">Valet Parking en Sótano</td>
                  <td className="py-2 text-slate-200">Estacionamiento Privado Subterráneo</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 text-left font-medium text-slate-300 font-sans">Precio Base por Hora</td>
                  <td className="py-2 text-emerald-300 font-bold">${salon1Details.basePrice} MXN</td>
                  <td className="py-2 text-emerald-300 font-bold">${salon2Details.basePrice} MXN</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Dynamic pricing packages */}
      <section id="paquetes-precios" className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Paquetes de Servicios Integrales Diseñados para Ti</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed font-sans">
            Olvídate del estrés. Elige uno de nuestros paquetes y deja que nos encarguemos de la gastronomía, sonido profesional, mobiliario y coordinación completa.
          </p>
        </div>

        {/* Dynamic packages presentation depending on active salon selected above */}
        <div className="flex justify-center gap-2 text-xs font-semibold pb-4">
          <button
            onClick={() => { setSelectedSalon("salon1"); onMetricIncrement("clicks"); }}
            className={`px-4 py-1.5 rounded-lg border transition-all cursor-pointer ${selectedSalon === "salon1" ? "bg-gradient-to-r from-indigo-500 to-emerald-500 border-white/10 text-white" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
          >
            Paquetes {salon1Details.name}
          </button>
          <button
            onClick={() => { setSelectedSalon("salon2"); onMetricIncrement("clicks"); }}
            className={`px-4 py-1.5 rounded-lg border transition-all cursor-pointer ${selectedSalon === "salon2" ? "bg-gradient-to-r from-indigo-500 to-emerald-500 border-white/10 text-white" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
          >
            Paquetes {salon2Details.name}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {activePackages.map((pack, idx) => (
            <div key={idx} className="glass-card-interactive rounded-xl p-6 flex flex-col justify-between space-y-5 relative">
              {idx === 1 && (
                <span className="absolute -top-3 right-4 bg-orange-500 text-white font-sans text-[10px] font-bold py-0.5 px-2.5 rounded-full uppercase tracking-wider border border-white/10">
                  Sugerido
                </span>
              )}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-lg text-white font-sans">{pack.name}</h4>
                  <span className="text-xl font-bold text-emerald-300 font-mono">{pack.price}</span>
                </div>

                <p className="text-xs text-slate-300 leading-snug font-sans">
                  El paquete estrella que cubre todos los servicios indispensables de tu evento para el salón seleccionado.
                </p>

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
                Seleccionar {pack.name} en el Cotizador
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
            Nuestros salones operan bajo reserva estricta. Utiliza nuestro calendario interactivo de disponibilidad para junio de 2026 y cotiza de manera automatizada.
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
              <div className="grid grid-cols-2 gap-3 col-span-1">
                {/* Salon Input choice */}
                <div>
                  <label className="block font-medium text-slate-350 mb-1 font-sans">Selecciona el Salón</label>
                  <select
                    value={selectedSalon}
                    onChange={(e) => { setSelectedSalon(e.target.value as "salon1" | "salon2"); onMetricIncrement("clicks"); }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 text-white bg-slate-900 outline-hidden font-sans focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="salon1">{salon1Details.name} (Interior premium)</option>
                    <option value="salon2">{salon2Details.name} (Moderna Exterior)</option>
                  </select>
                </div>

                {/* Package Input Choice */}
                <div>
                  <label className="block font-medium text-slate-350 mb-1 font-sans">Paquete de Nivel</label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => { setSelectedPackage(e.target.value); onMetricIncrement("clicks"); }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 text-white bg-slate-900 outline-hidden font-sans focus:ring-1 focus:ring-indigo-500"
                  >
                    {activePackages.map((p, idx) => (
                      <option key={idx} value={p.name}>{p.name} ({p.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 col-span-1">
                {/* Extra Hours slider */}
                <div>
                  <label className="block font-medium text-slate-350 mb-1 font-sans">Tiempo de Renta ({hours} horas)</label>
                  <input
                    type="range"
                    min={4}
                    max={12}
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-850 rounded-lg cursor-pointer accent-indigo-500 mt-2"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                    <span>Mín: 4h</span>
                    <span>Máx: 12h</span>
                  </div>
                </div>

                {/* Selected Date verification */}
                <div>
                  <label className="block font-medium text-slate-350 mb-1 font-sans">Fecha Solicitada</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 text-white bg-slate-900 outline-hidden font-sans focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Extras Multi-select details */}
              <div className="space-y-1.5">
                <span className="block font-semibold text-slate-200 text-[10px] uppercase font-sans">Complementos recomendados:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setCateringSelected(!cateringSelected); onMetricIncrement("clicks"); }}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer font-sans text-[10px] ${
                      cateringSelected ? "bg-indigo-505/20 border-indigo-400 text-indigo-300 font-bold" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    Banquetes (+250g/pers)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSoundSelected(!soundSelected); onMetricIncrement("clicks"); }}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer font-sans text-[10px] ${
                      soundSelected ? "bg-indigo-505/20 border-indigo-400 text-indigo-300 font-bold" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    Sonido & DJ (+4000)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDecorSelected(!decorSelected); onMetricIncrement("clicks"); }}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer font-sans text-[10px] ${
                      decorSelected ? "bg-indigo-505/20 border-indigo-400 text-indigo-300 font-bold" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    Mobiliario (+5500)
                  </button>
                </div>
              </div>

              {/* Dynamic Quote Receipt view */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-950/40 to-emerald-950/40 border border-white/10 text-indigo-50 rounded-xl space-y-2 relative overflow-hidden backdrop-blur-md shadow-inner">
                <div className="flex justify-between text-[11px] pb-1 border-b border-white/5 font-sans">
                  <span>Presupuesto Estimado ({selectedPackage}):</span>
                  <span className="font-bold text-xs text-white">{activePackageObj?.price}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="block text-[10px] text-indigo-350 font-sans">Total aproximado con extras:</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      ${priceCalculation.total.toLocaleString("es-MX")} MXN
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-indigo-300 text-right leading-tight">
                    <div>Capacidad: {selectedSalon === "salon1" ? salon1Details.capacity : salon2Details.capacity} pers</div>
                    <div>Horas: {hours} horas</div>
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
                        className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-white/10 text-white font-sans bg-slate-900 outline-hidden placeholder-slate-400"
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
                        className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-white/10 text-white font-sans bg-slate-900 outline-hidden placeholder-slate-400"
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
                        className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-white/10 text-white font-sans bg-slate-900 outline-hidden placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={1}
                    placeholder="Especificaciones o notas adicionales (ej. Graduación universitaria, tipo de banquete)"
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
                    <span>Hemos registrado tu solicitud para el **{selectedDate}**. Nos pondremos en contacto contigo por WhatsApp en un instante con tu cotización membretada.</span>
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
      <section id="opiniones-reseñas" className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white">Nuestros Clientes Dicen Todo</h2>
          <p className="text-xs text-slate-405 font-sans">
            La prueba social de matrimonios, familias y organizaciones corporativas que han confiado en nosotros.
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl relative flex flex-col items-center text-center space-y-4">
          <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(n => <Star key={n} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
          </div>

          <p className="text-xs text-slate-202 italic max-w-xl font-sans leading-relaxed">
            &ldquo;{landingCopy.recommendedTestimonials[activeTestimonialIdx]?.content || "Quedamos maravillados con la organización y el banquete. El Salón Imperial lució espectacular, mejor que en las fotografías de la galería. Todos los detalles de sonido y luces funcionaron a la perfección."}&rdquo;
          </p>

          <div>
            <span className="block font-bold text-white text-xs">
              {landingCopy.recommendedTestimonials[activeTestimonialIdx]?.author || "Sofía & Alejandro"}
            </span>
            <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
              Evento: {landingCopy.recommendedTestimonials[activeTestimonialIdx]?.eventType || "Boda Elegante"}
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
            <span className="text-white font-bold block text-sm">Salones Diamante</span>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Dos salones de eventos exclusivos diseñados con la excelencia de primera clase. Convertimos tus sueños en experiencias inolvidables.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <span className="text-white font-bold block">Ubicaciones</span>
            <span className="flex items-start gap-1 text-slate-400 font-sans">
              <MapPin className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>Av. de las Lomas #520, Lomas de Chapultepec, CDMX, México.</span>
            </span>
          </div>
          <div className="space-y-2">
            <span className="text-white font-bold block">Servicio al Cliente</span>
            <span className="block font-sans">Lunes a Domingo: 9:00 AM - 8:00 PM</span>
            <span className="block text-indigo-300 font-sans">reservas@salonesdiamante.com</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-6 text-center text-[10px] text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2 font-mono">
          <span>&copy; 2026 Salones Diamante. Todos los derechos reservados.</span>
          <span>Desarrollado en colaboración con el Copiloto de IA Gemini.</span>
        </div>
      </footer>
    </div>
  );
};
