import { NextRequest, NextResponse } from "next/server";
import Profile, { IProfile } from "../../(models)/Profile";
import { IEvent } from "@/app/(models)/Event";

export async function GET(req: NextRequest) {
    try {
        // Estrai l'email dai parametri della query
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
        }

        // Cerca il profilo basato sull'email
        const profile = await Profile.findOne({ mail: email });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }
        // Restituisci il profilo trovato
        return NextResponse.json({ profile }, { status: 200 });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: IProfile = await req.json();
        const { mail, events } = body;

        if (!mail || !events || events.length === 0) {
            throw new Error("Missing userEmail or event in request body");
        }

        // Trova il documento esistente per l'email dell'utente
        let profile = await Profile.findOne({ mail });

        if (profile) {
            if (!profile.events) {
                profile.events = []; // Inizializza `events` se non esiste
            }

            const newEvent = events[0]; // Supponiamo che stai inviando un solo evento
            const eventIndex = profile.events.findIndex((e: IEvent) => e.title === newEvent.title);

            if (eventIndex !== -1) {
                // Se l'evento esiste, rimuovilo dall'array
                profile.events.splice(eventIndex, 1);
                await profile.save();
                return NextResponse.json({ message: "Event removed from favorites", profile }, { status: 200 });
            } else {
                // Aggiungi il nuovo evento se non è già presente
                profile.events.push(newEvent);
                await profile.save();
                return NextResponse.json({ message: "Event added to favorites", profile }, { status: 200 });
            }
        } else {
            // Se il profilo non esiste, creane uno nuovo con l'array `events`
            profile = new Profile({ mail, events: events }); // Aggiungi direttamente l'array di eventi
            await profile.save();
            return NextResponse.json({ profile }, { status: 201 });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to create or update profile" }, { status: 500 });
    }
}




