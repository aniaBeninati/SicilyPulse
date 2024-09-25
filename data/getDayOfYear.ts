export const getDayOfYear = (dateStr: string): number => {
    const [day, month, year] = dateStr.split('-').map(Number);// Parsing della stringa data

    // Crea una data a partire dall'anno, mese e giorno (l'anno è completo, per esempio 2024)
    const date = new Date(year, month - 1, day); // JavaScript usa 0-based per i mesi

    // Calcola il giorno dell'anno
    const start = new Date(date.getFullYear(), 0, 0); // Inizio dell'anno
    const diff = date.getTime() - start.getTime(); // Differenza in millisecondi
    const oneDay = 1000 * 60 * 60 * 24; // Millisecondi in un giorno
    const dayOfYear = Math.floor(diff / oneDay);

    return dayOfYear;
};
