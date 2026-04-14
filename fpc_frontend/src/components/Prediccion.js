import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Prediccion = () => {
    const [equipos, setEquipos] = useState([]);
    const [local, setLocal] = useState('');
    const [visitante, setVisitante] = useState('');
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);

    //de que se encarga useEffect? useEffect es un hook de React que se utiliza para manejar efectos secundarios en componentes funcionales. La función dentro de useEffect hace una solicitud GET a la API para obtener los equipos y luego actualiza el estado con los datos recibidos. Si hay un error durante la carga, se captura y se muestra en la consola.
    useEffect(() => {
        axios.get('https://fpc-backend-devfelipe.onrender.com/api/equipos/')
            .then(res => setEquipos(res.data))
            .catch(err => console.error(err));
    }, []);

    const manejarPrediccion = () => {
        if (!local || !visitante) return alert("Selecciona ambos equipos");
        if (local === visitante) return alert("Los equipos no pueden ser iguales");
        setLoading(true);
        axios.get(`https://fpc-backend-devfelipe.onrender.com/api/prediccion/?local=${local}&visitante=${visitante}`)
            .then(res => {
                setResultado(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const FilaStatStitch = ({ etiqueta, valorLocal, valorVisitante }) => {
        const nL = parseFloat(valorLocal) || 0;
        const nV = parseFloat(valorVisitante) || 0;
        const total = nL + nV;
        const perc = total === 0 ? 50 : (nL / total) * 100;

        return (
            <div className="mb-6">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center mb-2">{etiqueta}</p>
                <div className="flex items-center gap-4">
                    <span className="text-blue-400 font-bold w-12 text-right">{nL}</span>
                    <div className="flex-grow h-2 bg-white/5 rounded-full overflow-hidden flex">
                        <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${perc}%` }} />
                        <div className="bg-green-500 h-full flex-grow" />
                    </div>
                    <span className="text-green-400 font-bold w-12 text-left">{nV}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="stitch-theme min-h-screen bg-[#0e0e0e] text-white p-4 md:p-8 lg:pl-72 lg:pt-60 font-['Inter']">
            {/* INYECTOR DE ESTILOS CSS PERSONALIZADOS */}
            <style>{`
                .stitch-theme .glass { background: rgba(38, 38, 38, 0.6); backdrop-filter: blur(24px); }
                .stitch-theme select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; }
            `}</style>

            <div className="max-w-4xl mx-auto glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {/* HEADER */}
                <div className="p-8 border-b border-white/5 bg-gradient-to-b from-blue-900/20 to-transparent">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-400">psychology</span>
                        <h2 className="text-3xl font-bold tracking-tighter uppercase font-['Space_Grotesk'] italic">
                            Predicción <span className="text-blue-500">IA Live</span>
                        </h2>
                    </div>
                </div>

                {/* SELECTORES */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Local</label>
                        <select 
                            value={local} 
                            onChange={(e) => setLocal(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                        >
                            <option value="">Seleccionar Equipo</option>
                            {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre_equipo}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2 text-center text-gray-600 font-bold italic text-2xl">VS</div>

                    <div className="md:col-span-5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Visitante</label>
                        <select 
                            value={visitante} 
                            onChange={(e) => setVisitante(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                        >
                            <option value="">Seleccionar Equipo</option>
                            {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre_equipo}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-12 mt-4">
                        <button 
                            onClick={manejarPrediccion}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-900/20"
                        >
                            {loading ? 'Analizando con IA...' : 'Calcular Probabilidades'}
                        </button>
                    </div>
                </div>

                {/* RESULTADOS */}
                {resultado && (
                    <div className="p-8 bg-[#131313] border-t border-white/5">
                        <div className="text-center mb-10">
                            <p className="text-green-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-2">Veredicto Final</p>
                            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase font-['Space_Grotesk'] leading-none">
                                {resultado.prediccion}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                            <FilaStatStitch etiqueta="Victoria (%)" valorLocal={resultado.probabilidad_local} valorVisitante={resultado.probabilidad_visitante} />
                            <FilaStatStitch etiqueta="Goles Esperados" valorLocal={resultado.goles_exp_local} valorVisitante={resultado.goles_exp_visitante} />
                            <FilaStatStitch etiqueta="Vallas Invictas" valorLocal={resultado.vallas_local} valorVisitante={resultado.vallas_visitante} />
                            <FilaStatStitch etiqueta="Historial Directo" valorLocal={resultado.historial_local} valorVisitante={resultado.historial_visitante} />
                        </div>

                        {/* JUGADORES CLAVE */}
                        <div className="grid grid-cols-2 gap-4 mt-8 border-t border-white/5 pt-8">
                            <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                                <p className="text-[10px] text-blue-400 font-bold uppercase mb-2">Goleador Local</p>
                                <p className="text-lg font-bold font-['Space_Grotesk']">{resultado.goleador_local.nombre}</p>
                                <p className="text-xs text-gray-500">{resultado.goleador_local.goles} Goles</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                                <p className="text-[10px] text-green-400 font-bold uppercase mb-2">Goleador Visitante</p>
                                <p className="text-lg font-bold font-['Space_Grotesk']">{resultado.goleador_visitante.nombre}</p>
                                <p className="text-xs text-gray-500">{resultado.goleador_visitante.goles} Goles</p>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-900/10 rounded-2xl border border-blue-500/20 text-center text-sm text-blue-300">
                            Probabilidad de empate: <span className="font-bold">{resultado.probabilidad_empate}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prediccion;