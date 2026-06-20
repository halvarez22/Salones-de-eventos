import { useState, useEffect } from "react";
import { StrategicAnswers, LandingPageCopy, StrategicScorecard, InquiryLog } from "./types";
import { StrategicWizard } from "./components/StrategicWizard";
import { CopywriteArchitect } from "./components/CopywriteArchitect";
import { LandingPagePreview } from "./components/LandingPagePreview";
import { Sparkles, FileText, Settings, Heart, ClipboardCheck, ArrowLeftRight, HelpCircle, Monitor, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import base images + newly generated high-fidelity context assets
import salon1ImgOriginal from "./assets/images/luxury_ballroom_1781820673552.jpg";
import salon2ImgOriginal from "./assets/images/garden_terrace_1781820688543.jpg";
import glassWeddingImg from "./assets/images/glass_ballroom_wedding_1781821867279.jpg";
import terraceSunsetImg from "./assets/images/minimalist_terrace_sunset_1781821882621.jpg";

const initialCopy: LandingPageCopy = {
  heroTitle: "El Escenario Perfecto Para tu Próximo Evento Inolvidable",
  heroSubtitle: "Explora nuestros dos exclusivos salones de eventos premium. Visualiza el estilo ideal, consulta fechas disponibles y cotiza en línea al instante sin compromisos.",
  comparativeHook: "La distinción majestuosa en interiores solemnes frente a la frescura contemporánea al aire libre.",
  salon1HeroCopy: "Lujo majestuoso de interiores con acústica impecable",
  salon1Description: "Un majestuoso salón climatizado de doble altura, decorado con candelabros de cristal austriaco y finas maderas. Diseñado exprofeso para banquetes solemnes, galas presidenciales y bodas de época.",
  salon1Packages: [
    {
      name: "Paquete Diamante Platino",
      price: "$28,500 MXN",
      inclusions: [
        "Uso del salón por 5 horas de evento",
        "Mobiliario de diseño Tiffany y mantelería fina",
        "Capitán de meseros y personal de servicio premier",
        "Coordinador de evento y montaje técnico"
      ]
    },
    {
      name: "Gala Imperial Platino Exclusivo",
      price: "$55,000 MXN",
      inclusions: [
        "Uso de salón por 6 horas continuas",
        "Catering de alta cocina de 3 tiempos",
        "Iluminación robótica y audio Bose profesional",
        "Pistas de baile de madera y brindis de bienvenida"
      ]
    }
  ],
  salon2HeroCopy: "Terraza panorámica y jardines flotantes mágicos",
  salon2Description: "Un oasis contemporáneo al aire libre rodeado de flora exótica y decorado con decks de maderas naturales sostenidas y festones LED cálidos. El escenario ideal para cócteles modernos, graduaciones y bodas rústicas chic.",
  salon2Packages: [
    {
      name: "Paquete Terraza Lounge",
      price: "$24,500 MXN",
      inclusions: [
        "Uso de la terraza por 5 horas continuas",
        "Mobiliario de lounge iluminado y barras de bar",
        "Iluminación ambiental decorativa (Festones LED)",
        "DJ residente y cabina de audio integrada"
      ]
    },
    {
      name: "Sunset Mixología Gourmet",
      price: "$46,000 MXN",
      inclusions: [
        "Uso de la terraza y piscina por 6 horas",
        "Barra libre nacional y mixología de autor (4h)",
        "Buffet internacional de canapés gourmet",
        "Pista de cristal templado iluminada"
      ]
    }
  ],
  recommendedTestimonials: [
    {
      author: "Verónica & Santiago",
      eventType: "Boda de Gala",
      content: "Nuestra boda en el Salón Imperial superó toda expectativa. El servicio de banquetes fue impecable y las luces robóticas crearon una atmósfera palaciega inolvidable. ¡Nuestros invitados siguen hablando de ello!",
      rating: 5
    },
    {
      author: "Director de Eventos - Financiera Atlas",
      eventType: "Cóctel Corporativo de Fin de Año",
      content: "La Terraza Sunset fue el lugar perfecto para nuestra gala anual. Los invitados se maravillaron con el atardecer y las luces LED. El motor de reserva agilizó toda la cotización.",
      rating: 5
    }
  ]
};

export default function App() {
  // Global States
  const [answers, setAnswers] = useState<StrategicAnswers>({
    architecture: "comparacion_integrada",
    bookingStrategy: "cotizador_autocalculo",
    ctaStrategy: "omnipresente",
    differentiation: "comparativo_visual",
    socialProof: "historias_exito",
    successDefinition: "leads_cotizacion"
  });

  const [salon1Details, setSalon1Details] = useState({
    name: "Salón Imperial",
    style: "Clásico Europeo",
    capacity: 250,
    basePrice: 4200,
    amenities: ["Aire Acondicionado Central", "Cocina Industrial de Apoyo", "Vestíbulo de Recepción", "Pórtico Fotográfico", "Escenarios Ajustable"],
    imageUrl: salon1ImgOriginal
  });

  const [salon2Details, setSalon2Details] = useState({
    name: "Terraza Sunset CDMX",
    style: "Boho-Chic Contemporáneo",
    capacity: 180,
    basePrice: 3500,
    amenities: ["Alberca de Espejo Decorativa", "Decks de Madera de Teca", "Barra Principal Iluminada", "Fogata Inteligente de Gas", "Domo Retráctil Inteligente"],
    imageUrl: salon2ImgOriginal
  });

  const [landingCopy, setLandingCopy] = useState<LandingPageCopy>(initialCopy);
  const [sidebarTab, setSidebarTab] = useState<"questions" | "content" | "crm">("questions");
  const [fullPreviewMode, setFullPreviewMode] = useState<boolean>(false);

  const [scorecard, setScorecard] = useState<StrategicScorecard>({
    questionsAnswered: 6,
    scorecardReady: false,
    scoreExplanation: "",
    registeredViews: 0,
    registeredClicks: 0,
    registeredQuotes: 0
  });

  const [inquiryLogs, setInquiryLogs] = useState<InquiryLog[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Load Sim Logs from localStorage
  useEffect(() => {
    const cached = localStorage.getItem("event_inquiries");
    if (cached) {
      try {
        setInquiryLogs(JSON.parse(cached));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleMetricIncrement = (metric: "views" | "clicks" | "quotes") => {
    setScorecard(prev => {
      const updated = { ...prev };
      if (metric === "views") updated.registeredViews += 1;
      if (metric === "clicks") updated.registeredClicks += 1;
      if (metric === "quotes") updated.registeredQuotes += 1;
      return updated;
    });
  };

  const handleInquiryStatusChange = (id: string, nextStatus: "pendiente" | "contactado" | "confirmado") => {
    const list = inquiryLogs.map(item => item.id === id ? { ...item, status: nextStatus } : item);
    setInquiryLogs(list);
    localStorage.setItem("event_inquiries", JSON.stringify(list));
  };

  const clearAllInquiries = () => {
    setInquiryLogs([]);
    localStorage.removeItem("event_inquiries");
  };

  const notifyCopyGenerated = () => {
    // Show a small bounce transition or metric trigger
    setScorecard(prev => ({ ...prev, registeredViews: prev.registeredViews + 1 }));
  };

  return (
    <div className={`w-full min-h-screen flex flex-col font-sans antialiased relative overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 text-slate-100 theme-dark' : 'bg-slate-50 text-slate-800 theme-light'}`} id="main-co-pilot-root">
      
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[130px] transition-all duration-300 ${theme === 'dark' ? 'bg-indigo-600/20' : 'bg-indigo-400/10'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[130px] transition-all duration-300 ${theme === 'dark' ? 'bg-emerald-600/15' : 'bg-emerald-400/10'}`}></div>
      </div>

      {/* Top App Bar / Control Console */}
      <header className="relative z-50 backdrop-blur-md bg-white/5 border-b border-white/10 px-5 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg text-white font-extrabold text-lg">
            G
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 label-adaptive">
              Co-piloto y Landing Page de Salones de Eventos
              <span className="text-[10px] bg-white/10 text-indigo-300 font-mono py-0.5 px-2 rounded-full font-bold border border-white/10">
                ESTADO: CONCEPTUALIZACIÓN Activa
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-sans description-adaptive">
              Plataforma Colaborativa de Diseño, CRO y Redacción Creativa con IA Gemini
            </p>
          </div>
        </div>

        {/* Fullscreen Toggle & View Status */}
        <div className="flex items-center gap-2">
          {/* Theme Switch Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title={theme === "dark" ? "Alternar a tema claro (Light Glass)" : "Alternar a tema oscuro (Frosted Glass)"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Tema Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Tema Oscuro</span>
              </>
            )}
          </button>

          <button
            onClick={() => setFullPreviewMode(!fullPreviewMode)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              fullPreviewMode 
                ? "bg-gradient-to-r from-indigo-550 to-emerald-550 hover:opacity-90 text-white border-white/20" 
                : "bg-white/5 hover:bg-white/10 text-slate-200 border-white/10"
            }`}
            title="Ocultar co-piloto para ver vista previa a pantalla completa"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">{fullPreviewMode ? "Mostrar Co-piloto" : "Ver Pantalla Completa"}</span>
          </button>
        </div>
      </header>

      {/* Workspace Area: Left Panel Strategy Control vs Right Panel Active Landing Preview */}
      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden z-10" id="workspace-layout-canvas">
        
        {/* Left Side: Strategic Planning Control Panel (Visible only if fullPreviewMode is false) */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className={`relative z-10 flex flex-col bg-white/[0.02] backdrop-blur-md h-auto lg:h-[calc(100vh-68px)] shrink-0 overflow-hidden ${
            fullPreviewMode 
              ? "w-0 opacity-0 pointer-events-none border-r-0" 
              : "w-full lg:w-[42%] opacity-100 border-r border-white/10"
          }`}
        >
          {!fullPreviewMode && (
            <div className="flex flex-col h-full w-full min-w-[320px] lg:min-w-[400px] overflow-hidden">
              {/* Tab Nav Header */}
              <div className="bg-white/5 p-2 border-b border-white/10 flex gap-1 font-sans text-xs">
                <button
                  onClick={() => setSidebarTab("questions")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 font-semibold cursor-pointer transition-all ${
                    sidebarTab === "questions"
                      ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-sm shadow-indigo-500/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>1. Planificación</span>
                </button>

                <button
                  onClick={() => setSidebarTab("content")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 font-semibold cursor-pointer transition-all ${
                    sidebarTab === "content"
                      ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-sm shadow-indigo-500/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Copias e IA</span>
                </button>

                <button
                  onClick={() => setSidebarTab("crm")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 font-semibold cursor-pointer transition-all relative ${
                    sidebarTab === "crm"
                      ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-sm shadow-indigo-500/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>3. Leads Recibidos</span>
                  {inquiryLogs.length > 0 && (
                    <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                      {inquiryLogs.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Scrollable Dashboard Panel Contents */}
              <div className="flex-1 p-5 overflow-y-auto space-y-6">
                
                <AnimatePresence mode="wait">
                  {sidebarTab === "questions" && (
                    <motion.div
                      key="questions-tab"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <StrategicWizard
                        answers={answers}
                        setAnswers={setAnswers}
                        scorecard={scorecard}
                        setScorecard={setScorecard}
                      />
                    </motion.div>
                  )}

                  {sidebarTab === "content" && (
                    <motion.div
                      key="content-tab"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <CopywriteArchitect
                        salon1Details={salon1Details}
                        setSalon1Details={setSalon1Details}
                        salon2Details={salon2Details}
                        setSalon2Details={setSalon2Details}
                        landingCopy={landingCopy}
                        setLandingCopy={setLandingCopy}
                        onAutoGenerated={notifyCopyGenerated}
                      />
                    </motion.div>
                  )}

                  {sidebarTab === "crm" && (
                    <motion.div
                      key="crm-tab"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-xl glass-card text-xs space-y-2">
                        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-sm">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          CRM Co-piloto (Bandeja de Leads)
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-sans">
                          Aquí se almacenan los prospectos que cotizan en la Landing Page de simulación a la derecha. Puedes simular el flujo comercial como si fueras el administrador real del salón.
                        </p>
                        {inquiryLogs.length > 0 && (
                          <button
                            onClick={clearAllInquiries}
                            className="px-2.5 py-1 text-[10px] bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/30 text-rose-300 font-semibold rounded-md transition-all cursor-pointer"
                          >
                            Limpiar bandeja
                          </button>
                        )}
                      </div>

                      {inquiryLogs.length === 0 ? (
                        <div className="bg-white/[0.02] p-12 text-center rounded-xl border border-white/10 border-dashed text-xs text-slate-400 font-sans">
                          No hay cotizaciones enviadas todavía. 
                          Llena el cotizador en la vista previa del salón a la derecha para ver cómo ingresan los leads.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {inquiryLogs.map(item => (
                            <div key={item.id} className="p-4 glass-card rounded-xl space-y-3 text-xs font-sans relative">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="block font-bold text-white">{item.clientName}</span>
                                  <span className="text-[10px] text-slate-300 block mt-0.5">{item.clientEmail} | {item.clientPhone}</span>
                                </div>
                                <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                                  item.status === "confirmado" 
                                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                                    : item.status === "contactado"
                                    ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-300"
                                    : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                                }`}>
                                  {item.status}
                                </span>
                              </div>

                              <div className="text-[10px] bg-black/20 p-2 rounded-lg border border-white/5 text-slate-200 space-y-1">
                                <div><strong className="text-slate-400 font-sans">Salón:</strong> {item.salonName}</div>
                                <div><strong className="text-slate-400 font-sans">Paquete:</strong> {item.packageName} ({item.packagePrice})</div>
                                <div><strong className="text-slate-400 font-sans">Fecha solicitada:</strong> {item.date}</div>
                                <div className="text-[9px] text-slate-300 italic pt-1 border-t border-white/5 mt-1 max-h-12 overflow-y-auto">
                                  &ldquo;{item.additionalNotes}&rdquo;
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 pt-1 text-[10px]">
                                <span className="text-slate-400">Estatus comercial:</span>
                                <button
                                  onClick={() => handleInquiryStatusChange(item.id, "contactado")}
                                  className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 cursor-pointer"
                                >
                                  Contactar
                                </button>
                                <button
                                  onClick={() => handleInquiryStatusChange(item.id, "confirmado")}
                                  className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded border border-emerald-500/40 cursor-pointer"
                                >
                                  Confirmar fecha
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

                {/* Bottom Credit brand */}
                <div className="bg-slate-950 p-3 border-t border-slate-850 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
                  <span>Socio Estratégico impulsado por Gemini 3.5</span>
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                </div>
              </div>
            )}
          </motion.div>

        {/* Right Side: W widescreen live-updating responsive browser mockup of the custom Landing Page */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className={`flex-grow h-auto lg:h-[calc(100vh-68px)] flex flex-col bg-slate-900 overflow-hidden ${
            fullPreviewMode ? "w-full" : "w-full lg:w-[58%]"
          }`}
          id="live-mockup-frame"
        >
          <div className="bg-slate-950 border-b border-indigo-950/40 px-4 py-2 flex items-center justify-between text-xs font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-slate-400 font-sans text-[11px] ml-1 bg-slate-900 py-0.5 px-3 rounded-md max-w-xs md:max-w-md truncate">
                https://salonesdiamante.com/promocion2026?vibe={encodeURIComponent(landingCopy.heroTitle ? 'ia_personalized' : 'standard')}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-sans bg-indigo-950/40 py-0.5 px-2.5 rounded-full border border-indigo-900/25">
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sincronización en vivo activa</span>
            </div>
          </div>

          {/* Interactive mock browser wrapper */}
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            <LandingPagePreview
              answers={answers}
              salon1Details={salon1Details}
              salon2Details={salon2Details}
              landingCopy={landingCopy}
              onMetricIncrement={handleMetricIncrement}
              inquiryLogs={inquiryLogs}
              setInquiryLogs={setInquiryLogs}
            />
          </div>
        </motion.div>

      </main>

    </div>
  );
}
