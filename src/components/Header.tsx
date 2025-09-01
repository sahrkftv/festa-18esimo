import React from 'react';
import { Camera, Music } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-[#cba281] to-[#ab7951] text-white shadow-lg">
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <img 
              src="https://i.imgur.com/RnDKNXs.png"
              alt="DJ SCMP Logo"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg" 
            />
            <div className="flex flex-col items-center">
              <h1 className="text-5xl font-bold tracking-tight mb-2">18esimo DJ SCMP</h1>
              <div className="flex items-center gap-2">
                <Music className="w-6 h-6" />
                <Camera className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-3">
              🎉 Benvenuti nella pagina ufficiale del 18esimo di DJ SCMP!
            </h2>
            <p className="text-lg leading-relaxed opacity-95 mb-3">
              Qui raccogliamo tutti i ricordi e i sorrisi che vogliamo conservare per sempre.
            </p>
            <p className="text-base mt-3 opacity-90">
              Questa pagina è pensata per essere il nostro album digitale condiviso: ognuno può caricare i propri scatti e video e rivedere quelli degli altri, creando insieme di emozioni che raccontano la serata.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;