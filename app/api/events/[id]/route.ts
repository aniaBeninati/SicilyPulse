import mongoose from "mongoose";
import Event, { IEvent } from "@/app/(models)/Event";
import { NextRequest, NextResponse } from "next/server";

// GET: Recupera un evento specifico per ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verifica che l'ID sia valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("ID non valido:", id);
      return NextResponse.json({ error: "ID non valido" }, { status: 400 });
    }

    const event: IEvent | null = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { error: "Evento non trovato" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Errore nella richiesta:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}

// PUT: Aggiorna un evento specifico impostando 'reviewed' su true
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verifica che l'ID sia valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("ID non valido:", id);
      return NextResponse.json({ error: "ID non valido" }, { status: 400 });
    }

    // Aggiorna l'evento impostando 'reviewed' su true
    const result = await Event.updateOne({ _id: id }, { reviewed: true });

    if (result.modifiedCount === 0) { // Usa modifiedCount per controllare se l'evento è stato aggiornato
      return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Evento pubblicato con successo' }, { status: 200 });
  } catch (error) {
    console.error("Errore nella richiesta:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}

// DELETE: Elimina un evento specifico per ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verifica che l'ID sia valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("ID non valido:", id);
      return NextResponse.json({ error: "ID non valido" }, { status: 400 });
    }

    // Rimuovi l'evento dal database
    const result = await Event.deleteOne({ _id: id });

    if (result.deletedCount === 0) { // Usa deletedCount per controllare se l'evento è stato trovato
      return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Evento rimosso con successo' }, { status: 200 });
  } catch (error) {
    console.error("Errore nella richiesta:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
