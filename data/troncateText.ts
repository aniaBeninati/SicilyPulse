export function truncateText(text: string, maxWords: number): string {

    // Dividi il testo in un array di parole
    const words = text.split(' ');

    // Controlla se il numero di parole supera maxWords
    if (words.length > maxWords) {
        // Troncate l'array alle prime maxWords parole
        const truncatedWords = words.slice(0, maxWords);

        // Ricostruisci la stringa e aggiungi i puntini di sospensione
        return truncatedWords.join(' ') + '[...]';
    } else {
        // Se non supera maxWords, restituisci il testo originale
        return text;
    }
}

