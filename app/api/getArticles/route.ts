// /app/api/getArticles/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, location, description, category } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Parametri mancanti. Assicurati che tutti i campi siano forniti.",
        },
        { status: 400 }
      );
    }
    const prompt = `
    Scrivi due articoli giornalistici dettagliati con la seguente struttura in formato JSON:

    Articolo 1:
    { "title": "Esplorazione di ${location}", "introduction": "Introduzione alla località.", "sections": [ { "subtitle": "Aspetti naturalistici", "content": "Descrivi gli aspetti naturalistici della località." }, { "subtitle": "Storia", "content": "Descrivi la storia della località." }, { "subtitle": "Punti di interesse", "content": "Descrivi i punti di interesse culturale e paesaggistico." }, { "subtitle": "Attività all'aperto", "content": "Descrivi le attività all'aperto." } ], "thesis": "Riflessione sul valore del territorio.", "conclusion": "Conclusione sull'importanza di preservare il patrimonio naturale e culturale." }

    Articolo 2:
    { "title": "${title}", "introduction": "Introduzione all'evento {title}.", "sections": [ { "subtitle": "Descrizione dell'evento", "content": "{description}" }, { "subtitle": "Dettagli principali", "content": "Data inizio: {dateStart}, Data fine: {dateEnd}, Categoria: {category}." } ], "thesis": "Impatto dell'evento sulla comunità.", "conclusion": "Conclusione sull'importanza dell'evento." }

    Genera questi due articoli nel formato indicato.
    `;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
    if (!apiKey) {
      throw new Error("Chiave API mancante.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const output = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (output) {
      return NextResponse.json({ ok: true, article: output });
    } else {
      throw new Error("Nessun articolo generato.");
    }
  } catch (error: unknown) {
    console.error("Errore API:", (error as Error).message || error);
    return NextResponse.json(
      { ok: false, message: (error as Error).message || "Errore interno del server." },
      { status: 500 }
    );
  }
}