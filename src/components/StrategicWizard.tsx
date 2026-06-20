import React, { useState } from "react";
import { ListChecks, AlertCircle, FileSpreadsheet, PlayCircle, BarChart3, HelpCircle, GraduationCap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { StrategicAnswers, StrategicScorecard } from "../types";

interface StrategicWizardProps {
  answers: StrategicAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<StrategicAnswers>>;
  scorecard: StrategicScorecard;
  setScorecard: React.Dispatch<React.SetStateAction<StrategicScorecard>>;
}

export const StrategicWizard: React.FC<StrategicWizardProps> = ({
  answers,
  setAnswers,
  scorecard,
  setScorecard
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = [
    {
      id: "architecture",
      title: "1. Estructura y Arquitectura de la Landing Page",
      description: "¿Cómo organizamos la información de tus 2 salones?",
      options: [
        {
          value: "comparacion_integrada",
          label: "Comparación Integrada (Bento Grid)",
          desc: "Los salones se muestran codo a codo desde el inicio en una grilla unificada, facilitando la comparación inmediata de capacidades y amenidades."
        },
        {
          value: "secciones_individuales",
          label: "Secciones Individuales Secuenciales",
          desc: "Se dedica una sección completa y exclusiva con deslizadores para cada salón antes de pasar a la comparación o precios."
        }
      ]
    },
    {
      id: "bookingStrategy",
      title: "2. Canales de Disponibilidad y Reserva",
      description: "¿Qué tan automatizado debe ser el sistema de rentas?",
      options: [
        {
          value: "cotizador_autocalculo",
          label: "Calendario Interactivo con Cotizador Automático",
          desc: "El usuario selecciona fechas, cantidad de horas, salón, y ve un presupuesto estimado al instante con un botón para enviar solicitud."
        },
        {
          value: "formulario_tradicional",
          label: "Formulario de Contacto Tradicional",
          desc: "Flujo offline: El usuario simplemente llena nombre y fecha, y un asesor lo contacta para cotizar a la medida por WhatsApp o correo."
        }
      ]
    },
    {
      id: "ctaStrategy",
      title: "3. Momentos Críticos de Llamada a la Acción (CTA)",
      description: "¿Dónde impulsamos al visitante a realizar la cotización?",
      options: [
        {
          value: "omnipresente",
          label: "Estrategia Omnipresente (Alta Conversión)",
          desc: "Botones de reserva flotantes en cabecera, junto a cada salón, dentro de la calculadora de precios y al final del sitio."
        },
        {
          value: "conservador",
          label: "Estrategia Sutil y Natural",
          desc: "Botón únicamente al final de la descripción completa de los salones para evitar saturar visualmente al usuario."
        }
      ]
    },
    {
      id: "differentiation",
      title: "4. Diferenciación y Propuesta de Valor",
      description: "¿Cómo evitamos que se confundan los 2 salones?",
      options: [
        {
          value: "comparativo_visual",
          label: "Enfoque en Casos de Uso y Clientes Meta",
          desc: "Destacar claramente en etiquetas: 'Ideal para banquetes elegantes' vs. 'Ideal para cócteles y cumpleaños de tarde'."
        },
        {
          value: "detalles_tecnicos",
          label: "Enfoque en Fichas Técnicas",
          desc: "Diferenciar únicamente mediante la lista de metros cuadrados, capacidad física de personas y precio por hora."
        }
      ]
    },
    {
      id: "socialProof",
      title: "5. Prueba Social y Credibilidad",
      description: "¿Qué elementos de confianza usaremos para validar la calidad?",
      options: [
        {
          value: "historias_exito",
          label: "Testimonios Detallados con fotografias",
          desc: "Reseñas reales de novios y organizadores detallando el excelente servicio del coordinador del salón."
        },
        {
          value: "contador_eventos",
          label: "Métricas y Logros Generales",
          desc: "Un contador dinámico mostrando: '+500 eventos exitosos', 'Calificación 4.9 estrellas en Google Maps'."
        }
      ]
    },
    {
      id: "successDefinition",
      title: "6. Indicador Clave de Éxito (KPI Principal)",
      description: "¿Cómo definiremos que la landing page está triunfando?",
      options: [
        {
          value: "leads_cotizacion",
          label: "Volumen de Cotizaciones Recibidas",
          desc: "Medir cuántas personas usan el cotizador y envían su información de contacto (Enfoque en leads calificados)."
        },
        {
          value: "clics_disponibilidad",
          label: "Clicks en Verificar Fechas",
          desc: "Medir el nivel de interés preliminar evaluando cuántas personas exploran el calendario interactivo."
        }
      ]
    }
  ];

  const handleSelectOption = (questionId: keyof StrategicAnswers, val: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));

    // Count how many questions are answered now
    const nextAnswers = { ...answers, [questionId]: val };
    const answeredCount = Object.values(nextAnswers).filter(x => x !== "").length;

    setScorecard(prev => ({
      ...prev,
      questionsAnswered: answeredCount
    }));
  };

  const handleGetStrategicAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/strategic-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta del motor estratégico.");
      }

      const data = await response.json();
      setScorecard(prev => ({
        ...prev,
        scorecardReady: true,
        scoreExplanation: data.advice
      }));
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al contactar al asesor virtual.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="strategic-wizard-wrapper">
      {/* Consulting banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-white/10 text-sm text-indigo-200 leading-relaxed backdrop-blur-md">
        <h4 className="font-semibold flex items-center gap-1.5 mb-1 text-white">
          <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
          Socio de Pensamiento Estratégico (Cuestionario de Planificación)
        </h4>
        <p className="text-slate-300">
          Responde estas 6 preguntas clave para guiar el diseño y comportamiento de la landing page. Al terminar, la **IA de Gemini** analizará tus decisiones y te entregará una consultoría completa de conversión (CRO) y un mapa de ruta.
        </p>
      </div>

      {/* Steps list */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const currentVal = answers[q.id as keyof StrategicAnswers];
          return (
            <div key={q.id} className="p-4 glass-card rounded-xl space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="p-1 rounded-md bg-white/5 text-slate-300 hover:text-white">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                </span>
                <div>
                  <h4 className="font-semibold text-white text-sm">{q.title}</h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">{q.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-2 text-xs pt-1 col-span-1">
                {q.options.map(opt => {
                  const isSelected = currentVal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectOption(q.id as keyof StrategicAnswers, opt.value)}
                      className={`p-3 text-left rounded-lg border font-sans cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-indigo-500/20 border-indigo-400/80 ring-1 ring-indigo-500/40"
                          : "bg-white/[0.02] border-white/10 hover:bg-white/10/70 hover:border-white/20 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-indigo-400 bg-indigo-500" : "border-slate-500 bg-white/5"
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        <span className={`font-semibold ${isSelected ? "text-white" : "text-slate-200"}`}>
                          {opt.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory activation */}
      <div className="p-5 glass-card rounded-xl space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Progreso del taller estratégico:</span>
          <span className="font-semibold text-indigo-350 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
            {scorecard.questionsAnswered} de 6 Respondidas
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 rounded-lg flex items-start gap-1.5 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 mt-px text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGetStrategicAdvice}
          disabled={loading || scorecard.questionsAnswered === 0}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:opacity-90 text-white rounded-xl shadow-md shadow-indigo-500/10 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all border border-white/10"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analizando respuestas con IA Gemini...</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              <span>Generar Informe de Consultoría y CRO</span>
            </>
          )}
        </button>
      </div>

      {/* Advisory report output */}
      {scorecard.scorecardReady && scorecard.scoreExplanation && (
        <div className="p-5 glass-card rounded-xl space-y-3" id="strategic-report-box">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-sm">Informe Estratégico y Plan de Acción (CRO)</h3>
          </div>
          <div className="prose prose-sm prose-invert max-w-none text-xs text-slate-300 font-sans leading-relaxed space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            <ReactMarkdown>{scorecard.scoreExplanation}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Live Dashboard of Metrics of Success */}
      <div className="p-5 glass-card rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-sm text-white">Dashboard de Métricas de ÉXITO (Simuladas en vivo)</h3>
          </div>
          <span className="text-[10px] bg-white/5 border border-white/10 font-mono text-slate-300 px-2 py-0.5 rounded-full">Objetivo: {answers.successDefinition === "leads_cotizacion" ? "Cotizaciones" : "Clicks"}</span>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Tus métricas de éxito se incrementan en tiempo real mientras interactúas y completas cotizaciones simuladas en la **Vista Previa de la Landing Page** a la derecha.
        </p>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-white/[0.02] p-3 rounded-lg border border-white/10">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono">Visitas</span>
            <span className="block text-xl font-bold font-mono text-white mt-0.5">{scorecard.registeredViews}</span>
          </div>

          <div className="bg-white/[0.02] p-3 rounded-lg border border-white/10">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono">Clicks Disp.</span>
            <span className="block text-xl font-bold font-mono text-cyan-400 mt-0.5">{scorecard.registeredClicks}</span>
            <span className="text-[9px] text-slate-400 block font-sans">CTR: {scorecard.registeredViews > 0 ? ((scorecard.registeredClicks / scorecard.registeredViews) * 100).toFixed(1) : "0.0"}%</span>
          </div>

          <div className="bg-white/[0.02] p-3 rounded-lg border border-white/10">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono">Cotizaciones</span>
            <span className="block text-xl font-bold font-mono text-emerald-400 mt-0.5">{scorecard.registeredQuotes}</span>
            <span className="text-[9px] text-slate-400 block font-sans">Conv: {scorecard.registeredViews > 0 ? ((scorecard.registeredQuotes / scorecard.registeredViews) * 100).toFixed(1) : "0.0"}%</span>
          </div>
        </div>

        {/* Dynamic score summary */}
        <div className="text-[11px] bg-black/20 p-2.5 rounded-lg border border-white/5 flex justify-between items-center text-slate-300">
          <span>Tasa de Conversión de la Sesión:</span>
          <span className="font-bold text-emerald-400 font-mono">
            {scorecard.registeredViews > 0 ? ((scorecard.registeredQuotes / scorecard.registeredViews) * 100).toFixed(1) : "0.0"}%
          </span>
        </div>
      </div>
    </div>
  );
};
