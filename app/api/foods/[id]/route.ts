import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Event, { IEvent } from "@/app/(models)/Event";

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