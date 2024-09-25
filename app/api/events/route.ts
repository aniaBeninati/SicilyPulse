import { NextResponse } from "next/server";
import Event, { IEvent } from '../../(models)/Event'


export async function GET() {
    try {
        const events: IEvent[] = await Event.find();
        return NextResponse.json({ events }, { status: 200 }); // Restituisce un oggetto con l'array di eventi

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}
export async function POST(req: Request) {
    try {
        // Parsing del body della richiesta
        const body: IEvent = await req.json();

        // Estrai i dati necessari dal body, incluso l'articolo
        const { title, image, tag, description, dateStart, dateEnd, price, location, color, article, /* arrayImageArticle */ } = body;

        // Creazione di un nuovo evento con i dati ricevuti, incluso l'articolo
        const newEvent = new Event({
            title,
            image,
            tag,
            description,
            dateStart,
            dateEnd,
            price,
            location,
            color,
            article,  // Aggiungi l'articolo nel documento
            reviewed: false,  // Assicuriamoci che reviewed sia false alla creazione
/*             arrayImageArticle
 */        });
        console.log(newEvent)

        // Salva il nuovo evento nel database
        await newEvent.save();

        // Restituisci la risposta di successo con il nuovo evento creato
        return NextResponse.json({ event: newEvent }, { status: 201 });

    } catch (error) {
        // Gestione degli errori con log e risposta JSON    
        console.log(error);
        return NextResponse.json({ error: 'Failed to create event', details: error }, { status: 500 });
    }
}