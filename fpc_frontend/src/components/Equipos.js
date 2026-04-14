import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Equipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('Todos');

    useEffect(() => {
        axios.get('https://fpc-backend-devfelipe.onrender.com/api/equipos/')
            .then(res => setEquipos(res.data))
            .catch(err => console.error("Error cargando equipos:", err));
    }, []);

    const obtenerEquiposFiltrados = () => {
        let resultado = [...equipos];

        if (filtro === 'Top 8') {
            resultado = resultado.sort((a, b) => b.ligas_ganadas - a.ligas_ganadas).slice(0, 8);
        } else if (filtro === 'Historicos') {
            const nombresHistoricos = [
                'Atletico Nacional', 
                'Once Caldas', 
                'America de Cali', 
                'Santa Fe'
            ];
            resultado = resultado.filter(eq => 
                nombresHistoricos.some(h => eq.nombre_equipo.toLowerCase().includes(h.toLowerCase()))
            );
        }

        if (busqueda) {
            resultado = resultado.filter(eq => 
                eq.nombre_equipo.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        return resultado;
    };

    const equiposAMostrar = obtenerEquiposFiltrados();

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white font-['Inter'] selection:bg-blue-500 selection:text-white">
            <style>{`
                .glass-card { 
                    background: rgba(38, 38, 38, 0.4); 
                    backdrop-filter: blur(24px); 
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                /* Ocultar scrollbar en navegadores basados en Webkit (Chrome, Safari, Edge) */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                /* Ocultar scrollbar en Firefox */
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <main className="pt-32 pb-24 lg:pl-72 pr-8 px-6 min-h-screen bg-[radial-gradient(circle_at_top_right,_#1e1b4b_0%,_#0e0e0e_100%)]">
                
                <header className="mb-12 max-w-5xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-1 w-12 bg-[#2ff801] rounded-full"></div>
                        <span className="text-[#2ff801] font-bold uppercase tracking-widest text-sm font-['Space_Grotesk']">
                            Directorio Oficial 2026
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-none font-['Space_Grotesk'] uppercase">
                        Equipos <span className="text-[#95aaff] italic">FPC</span>
                    </h1>
                </header>

                {/* BARRA DE BÚSQUEDA Y FILTROS */}
                <div className="mb-10 flex flex-col xl:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full xl:w-96">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                        <input 
                            type="text"
                            placeholder="Buscar club..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full bg-[#1a1a1a] border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                        />
                    </div>
                    
                    {/* CONTENEDOR DE BOTONES */}
                    <div className="flex gap-2 w-full xl:w-auto justify-start md:justify-end no-scrollbar overflow-x-auto">
                        {['Todos', 'Top 8', 'Historicos'].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFiltro(f)}
                                className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all flex-shrink-0 ${
                                    filtro === f 
                                    ? 'bg-[#2ff801] text-black shadow-lg shadow-[#2ff801]/20 scale-105' 
                                    : 'bg-[#1a1a1a] text-gray-500 hover:text-white border border-white/5'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl">
                    {equiposAMostrar.length > 0 ? (
                        equiposAMostrar.map((equipo, index) => (
                            <div key={equipo.id} className="glass-card rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 relative">
                                <div className="p-8 relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center p-3 border border-white/10 group-hover:border-blue-400/50 transition-colors">
                                            <img 
                                                src={equipo.escudo} 
                                                alt={equipo.nombre_equipo}
                                                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=FPC"; }}
                                            />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Rank</span>
                                            <span className="text-4xl font-black text-blue-400 font-['Space_Grotesk']">
                                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors font-['Space_Grotesk'] uppercase tracking-tighter">
                                        {equipo.nombre_equipo}
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1 mb-8 uppercase tracking-widest">
                                        {equipo.ciudad} • {equipo.nombre_estadio || "Estadio Principal"}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Títulos de Liga</span>
                                            <span className="text-xl font-bold text-[#2ff801]">{equipo.ligas_ganadas}</span>
                                        </div>
                                        
                                        <a href={`/equipos/${equipo.id}`} className="flex items-center gap-2 text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform uppercase tracking-widest">
                                            Detalles
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center opacity-50 uppercase tracking-[0.3em]">
                            No se encontraron clubes que coincidan con tu búsqueda.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Equipos;