import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client strictly adhering to modern @google/genai guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint to generate copywriting based on salon characteristics and target audience
app.post("/api/gemini/copywrite", async (req, res) => {
  try {
    const {
      salon1Name,
      salon1Style,
      salon1Features,
      salon2Name,
      salon2Style,
      salon2Features,
      targetAudience,
      promoVibe
    } = req.body;

    const prompt = `
      Eres un diseñador UX y redactor publicitario estrella (copywriter) para salones de fiestas y espacios corporativos.
      Genera contenido comercial persuasivo, transparente y de conversión rápida para una landing page de dos salones de eventos que se rentan.
      
      Información de entrada:
      - Salón 1: Nombre "${salon1Name || 'Salón Elegance'}", Estilo/Concepto "${salon1Style || 'Clásico de Lujo'}", Características principales: ${JSON.stringify(salon1Features || [])}.
      - Salón 2: Nombre "${salon2Name || 'Terraza Sunset'}", Estilo/Concepto "${salon2Style || 'Moderno y Desenfadado al aire libre'}", Características principales: ${JSON.stringify(salon2Features || [])}.
      - Público Objetivo Principal: "${targetAudience || 'Bodas, Graduaciones y Eventos Corporativos'}".
      - Tono/Vibe de la Campaña: "${promoVibe || 'Elegante y Sofisticado'}".

      Genera una respuesta en formato JSON estrictamente estructurado según el siguiente esquema de campos:
      - heroTitle: Título principal impactante que capture la esencia de ambos salones (en tono "${promoVibe}").
      - heroSubtitle: Subtítulo convincente que llame a la acción e invite a reservar o cotizar.
      - salon1HeroCopy: Una frase de gancho comercial de una línea para el Salón 1.
      - salon1Description: Descripción detallada y atractiva de 2 a 3 oraciones para el Salón 1, resaltando sus ventajas competitivas.
      - salon1Packages: Un arreglo de 2 paquetes sugeridos (ej. Plata, Oro) para el Salón 1. Cada paquete debe tener:
        - name: Nombre del paquete.
        - price: Precio aproximado o formato de precio sugerido (ej. "$25,000 MXN", "$1,200 USD").
        - inclusions: Arreglo de 4 inclusiones o amenidades de alta gama (ej. Banquetes, Iluminación, Coordinador).
      - salon2HeroCopy: Una frase de gancho comercial de una línea para el Salón 2.
      - salon2Description: Descripción detallada y atractiva de 2 a 3 oraciones para el Salón 2, resaltando su vibra única.
      - salon2Packages: Un arreglo de 2 paquetes sugeridos para el Salón 2, estructurado igual que el del Salón 1.
      - comparativeHook: Una frase breve que ayude a comparar inteligentemente ambos espacios (por ejemplo, "Lujo en interiores vs. Frescura al aire libre").
      - recommendedTestimonials: Un arreglo de 2 testimonios realistas pero ficticios con nombres de clientes y tipos de eventos previos.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "heroTitle",
            "heroSubtitle",
            "salon1HeroCopy",
            "salon1Description",
            "salon1Packages",
            "salon2HeroCopy",
            "salon2Description",
            "salon2Packages",
            "comparativeHook",
            "recommendedTestimonials"
          ],
          properties: {
            heroTitle: { type: Type.STRING },
            heroSubtitle: { type: Type.STRING },
            salon1HeroCopy: { type: Type.STRING },
            salon1Description: { type: Type.STRING },
            salon1Packages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "price", "inclusions"],
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.STRING },
                  inclusions: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            salon2HeroCopy: { type: Type.STRING },
            salon2Description: { type: Type.STRING },
            salon2Packages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "price", "inclusions"],
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.STRING },
                  inclusions: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            comparativeHook: { type: Type.STRING },
            recommendedTestimonials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["author", "eventType", "content", "rating"],
                properties: {
                  author: { type: Type.STRING },
                  eventType: { type: Type.STRING },
                  content: { type: Type.STRING },
                  rating: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    });

    const textResponse = response.text;
    res.json(JSON.parse(textResponse || "{}"));
  } catch (error: any) {
    console.error("Error in copywriting endpoint:", error);
    res.status(500).json({ error: error.message || "Error al generar la redacción publicitaria." });
  }
});

// Endpoint to provide expert UX feedback and strategic planning advice based on the user's questionnaire choices
app.post("/api/gemini/strategic-advice", async (req, res) => {
  try {
    const { answers } = req.body;

    const prompt = `
      Eres un asesor estratégico sénior de marketing digital y diseño de experiencia de usuario (UX).
      El usuario ha completado un cuestionario interactivo de planificación para la landing page de sus dos salones de eventos.
      
      Aquí están sus respuestas a las preguntas de exploración clave:
      1. Decisiones de Arquitectura de Información (¿Cómo organizar la comparación de los salones?):
         "${answers.architecture || 'No especificado'}"
      
      2. Funcionalidad de Disponibilidad y Reservas (¿Qué tipo de pasarela, calendario o flujo de registro usar?):
         "${answers.bookingStrategy || 'No especificado'}"
      
      3. Ubicación y flujo de Llamadas a Acción (CTA) en el viaje del usuario:
         "${answers.ctaStrategy || 'No especificado'}"
      
      4. Diferenciación Competitiva (¿Qué hace única a cada sala para no confundir al cliente?):
         "${answers.differentiation || 'No especificado'}"
      
      5. Prueba Social y Elementos de Confianza (Reseñas, fotos reales, videos de eventos previos):
         "${answers.socialProof || 'No especificado'}"
         
      6. Lo que define el "ÉXITO" de esta landing page (Métricas clave):
         "${answers.successDefinition || 'No especificado'}"

      Por favor, genera un informe estratégico sumamente profesional, didáctico y enriquecedor estructurado en Markdown. Debe incluir:
      - **Análisis de Decisiones**: Validación de sus respuestas con pros y contras de la arquitectura elegida.
      - **Estrategia de Optimización de Conversión (CRO)**: Recomendaciones específicas para elevar las tasas de reservas directas.
      - **Definición Clara del "Éxito"**: Dashboard de métricas recomendado (ej. Tasa de conversión de formulario, CTR en el calendario de disponibilidad, abandonos).
      - **Plan de Ejecución Ágil**: Un checklist paso a paso ordenado por prioridades (Fase 1: Configuración, Fase 2: Lanzamiento de Mockup, Fase 3: Integración Técnica).

      Habla en un tono amigable, inspirador y directo en español. Trata al usuario como tu socio de negocios.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("Error in strategic-advice endpoint:", error);
    res.status(500).json({ error: error.message || "Error al generar la consultoría estratégica." });
  }
});

// Serve web workspace layout
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite as a middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
