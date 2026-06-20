import { useState, useEffect } from "react";
import { StrategicAnswers, LandingPageCopy, StrategicScorecard, InquiryLog } from "./types";
import { StrategicWizard } from "./components/StrategicWizard";
import { CopywriteArchitect } from "./components/CopywriteArchitect";
import { LandingPagePreview } from "./components/LandingPagePreview";
import { Sparkles, FileText, Settings, Heart, ClipboardCheck, ArrowLeftRight, HelpCircle, Monitor, Sun, Moon, LogOut, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import base images + newly generated high-fidelity context assets
import salon1ImgOriginal from "./assets/images/luxury_ballroom_1781820673552.jpg";
import salon2ImgOriginal from "./assets/images/garden_terrace_1781820688543.jpg";
import glassWeddingImg from "./assets/images/glass_ballroom_wedding_1781821867279.jpg";
import terraceSunsetImg from "./assets/images/minimalist_terrace_sunset_1781821882621.jpg";

const initialCopy: LandingPageCopy = {
  heroTitle: "Salon Germany: Tu Espacio Perfecto para Eventos",
  heroSubtitle: "Un lugar versátil para celebrar momentos inolvidables. Cotiza en línea y ven a conocerlo sin compromiso.",
  comparativeHook: "", // Eliminamos porque es un solo salón
  salon1HeroCopy: "Espacio acogedor y completo para tu evento",
  salon1Description: "Salon Germany es el lugar ideal para tus celebraciones. Contamos con todo lo necesario para que tu evento sea un éxito, desde mobiliario completo hasta amenidades exclusivas.",
  salon1Packages: [
    {
      name: "Paquete Semanal (Lunes-Viernes)",
      price: "$3,500 MXN",
      inclusions: [
        "Uso del salón de 10:00am a 10:00pm",
        "5 mesas y 50 sillas incluidas",
        "2 baños (hombre y mujer)",
        "Regadera y agua climatizada"
      ]
    },
    {
      name: "Paquete Fin de Semana (Sábado-Domingo)",
      price: "$4,000 MXN",
      inclusions: [
        "Uso del salón de 10:00am a 12:00pm (medianoche)",
        "5 mesas y 50 sillas incluidas",
        "2 baños (hombre y mujer)",
        "Regadera y agua climatizada"
      ]
    }
  ],
  salon2HeroCopy: "", // Eliminamos el segundo salón
  salon2Description: "",
  salon2Packages: [],
  recommendedTestimonials: [
    {
      author: "María Fernanda",
      eventType: "Cumpleaños de 15 años",
      content: "Celebramos mi hija en Salon Germany y fue perfecto! El espacio es muy acogedor y las amenidades son excelentes. ¡Recomendado 100%!",
      rating: 5
    },
    {
      author: "Equipo de Empresa XYZ",
      eventType: "Reunión Corporativa",
      content: "Excelente lugar para eventos empresariales. El mobiliario es cómodo y la ubicación es muy conveniente. ¡Volveremos!",
      rating: 5
    }
  ]
};

// Componente de Login simple
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciales de demostración (se pueden cambiar)
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[130px] bg-indigo-600/20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[130px] bg-emerald-600/15"></div>
      </div>

      <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <img
            src="/images/logo salones.png"
            alt="Logo Salon Germany"
            className="w-24 h-24 object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-extrabold text-white">Panel de Administración</h1>
          <p className="text-slate-400 text-sm mt-2">Salon Germany - Eventos Exclusivos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Credenciales incorrectas. Intenta de nuevo.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:opacity-95 text-white font-semibold rounded-lg shadow-md shadow-indigo-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">
            Credenciales de demostración: <span className="text-slate-400 font-mono">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    name: "Salon Germany",
    style: "Espacio Versátil para Eventos",
    capacity: 80,
    basePrice: 3500,
    amenities: ["5 mesas", "50 sillas", "2 baños (Hombre y Mujer)", "Regadera", "Agua climatizada"],
    imageUrl: salon1ImgOriginal,
    location: "Calle Tepeyac, Col. Cerrito de Guadalupe, Num. 18"
  });

  // Eliminamos el segundo salón (lo mantenemos por compatibilidad pero con datos vacíos)
  const [salon2Details, setSalon2Details] = useState({
    name: "",
    style: "",
    capacity: 0,
    basePrice: 0,
    amenities: [],
    imageUrl: ""
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

  // Si NO está autenticado: Mostrar login o landing pública
  if (!isAuthenticated) {
    // Chequeamos si la URL tiene ?admin para mostrar el login, sino mostramos la landing pública
    const isAdminUrl = window.location.search.includes("admin");
    
    if (isAdminUrl) {
      return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
    }

    // Landing PÚBLICA para usuarios normales: Mostrar solo la landing page sin frames ni panel
    return (
      <div className="w-full min-h-screen">
        <LandingPagePreview
          answers={answers}
          salon1Details={salon1Details}
          salon2Details={salon2Details}
          landingCopy={landingCopy}
          onMetricIncrement={handleMetricIncrement}
          inquiryLogs={inquiryLogs}
          setInquiryLogs={setInquiryLogs}
        />
        
        {/* Botón secreto para acceder al login (solo para demo, se puede quitar en producción) */}
        <button
          onClick={() => window.location.search = "?admin"}
          className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-700/70 text-slate-400 flex items-center justify-center transition-all text-xs cursor-pointer border border-slate-700/30 backdrop-blur-sm"
          title="Acceso Admin"
        >
          ⚙️
        </button>
      </div>
    );
  }

  // Si SÍ está autenticado: Mostrar la app completa con panel de administración
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
          <img
            src="/images/logo salones.png"
            alt="Logo Salon Germany"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 label-adaptive">
              Panel de Administración
              <span className="text-[10px] bg-white/10 text-indigo-300 font-mono py-0.5 px-2 rounded-full font-bold border border-white/10">
                Salon Germany
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-sans description-adaptive">
              Diseño, CRO y gestión de leads con IA Gemini
            </p>
          </div>
        </div>

        {/* Fullscreen Toggle, Theme & Logout */}
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
            <span className="hidden sm:inline">{fullPreviewMode ? "Mostrar Panel" : "Ver Landing"}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              setIsAuthenticated(false);
              window.location.search = "";
            }}
            className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
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
                  <span>2. Contenido</span>
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
                  <span>3. Leads</span>
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
                          Bandeja de Leads
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-sans">
                          Gestiona las cotizaciones que los clientes envían desde la landing page.
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
                Vista previa de la Landing Page
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-sans bg-indigo-950/40 py-0.5 px-2.5 rounded-full border border-indigo-900/25">
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sincronización en vivo</span>
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
