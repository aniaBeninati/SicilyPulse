'use client';

export default function AboutPage() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 px-4">
      <div className="p-8">
        <h1 className="text-4xl font-titolo mb-4 text-rosso text-left">Chi siamo</h1>
        <p className="mt-6 text-lg text-black max-w-2xl text-justify">
          <strong>SicilyPulse</strong> è la piattaforma digitale che fa vivere il battito culturale della Sicilia, unendo tradizione e innovazione per far scoprire ogni angolo di questa terra unica. Con noi, esplorare eventi locali diventa semplice e intuitivo, permettendo agli utenti di scoprire ciò che accade intorno a loro in base ai propri interessi.<br/><br/>
          <strong>SicilyPulse</strong> nasce con l’obiettivo di essere un punto di riferimento per chi desidera vivere appieno la ricchezza culturale siciliana. Offriamo un accesso dinamico e interattivo agli eventi locali, creando una connessione profonda tra il pubblico e la vibrante vita sociale dell’isola.<br/><br/>
          Unisciti a <strong>SicilyPulse</strong> e lasciati guidare dal ritmo inarrestabile della cultura siciliana!
        </p>

        <h2 className="mt-10 text-2xl font-titolo mb-2 text-rosso text-left">Redazione</h2>
        <p className="text-lg text-black max-w-2xl text-justify">
          Adriana Piccione <br/>
          <a href="https://www.linkedin.com/in/adriana-piccione-86288b114/" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            LinkedIn
          </a>
          <a href="https://github.com/Adriana1206" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            GitHub
          </a>
          <br/>
          Luca Ferraresso <br/>
          <a href="https://www.linkedin.com/in/luca-ferraresso/" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            LinkedIn
          </a>
          <a href="https://github.com/LucaFerraresso" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            GitHub
          </a>
          <br/>
          Mariadomenica Scibilia <br/>
          <a href="https://www.linkedin.com/in/mariadomenica-scibilia-a1361b2b3/" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            LinkedIn
          </a>
          <a href="https://github.com/Maryscib1997" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            GitHub
          </a>
          <a href="https://www.behance.net/maryscibilia" target="_blank" className="text-sm text-gray-500 mb-2 inline-block">
            Behance
          </a>
          <br/>
          Nunzio Basciano <br/>
          <a href="https://www.linkedin.com/in/nunzio-basciano/" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            LinkedIn
          </a>
          <a href="https://github.com/NunzioBasciano" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            GitHub
          </a>
          <br/>
          Stefania Beninati <br/>
          <a href="https://www.linkedin.com/in/stefania-beninati-208577202/" target="_blank" className="text-sm text-gray-500 mr-4 mb-2 inline-block">
            LinkedIn
          </a>
          <a href="https://github.com/aniaBeninati" target="_blank" className="text-sm text-gray-500 mb-2 inline-block">
            GitHub
          </a>
          <br/>
        </p>
      </div>
    </div>
  );
}
