import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SimuladorIA = () => {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);

    const ejecutarSimulacion = ()=> {
        //setLoading es un estado que se utiliza para indicar si la aplicación está cargando datos o no. En este caso, se establece en true antes de hacer la solicitud a la API para indicar que se está cargando la simulación. 
        // Luego, cuando se reciben los datos de la simulación, se actualiza el estado con los datos recibidos y se establece loading en false para indicar que la carga ha finalizado.
        setLoading(true);
        axios.get('https://fpc-backend-devfelipe.onrender.com/api/simulacion/')
            .then(res => {
                //setDatos es un estado que se utiliza para almacenar los datos de la simulación recibidos de la API. En este caso, se actualiza el estado con los datos de la simulación utilizando
                //setDatos(res.data.simulacion), lo que permite que la aplicación tenga acceso a esos datos para su posterior uso o visualización.
                setDatos(res.data.simulacion);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error en la simulacion: ", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        ejecutarSimulacion();
    }, []);

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white font-['Inter']">
            <main className="pt-24 pb-24 md:pl-72 md:pr-8 px-6 bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0e0e0e_100%)]">
                
                {/* Header del Módulo */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full mb-4 border border-blue-500/20">
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Monte Carlo Engine V1.0</span>
                    </div>
                    <h1 className="text-5xl font-black font-['Space_Grotesk'] uppercase tracking-tighter">
                        Simulador <span className="text-blue-500">Camino a la Gloria</span>
                    </h1>
                    <p className="text-gray-400 mt-2 italic">Análisis predictivo basado en 1,000 iteraciones de los Playoffs.</p>
                </div>

                {/* Grid de Resultados */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    
                    {/* Lista de Probabilidades */}
                    <div className="bg-[#131313] rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-['Space_Grotesk'] text-xl font-bold uppercase">Ranking de Favoritos</h3>
                            <button 
                                onClick={ejecutarSimulacion}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span> Recalcular
                            </button>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="py-20 text-center">
                                    <span className="material-symbols-outlined animate-spin text-4xl text-blue-500">autorenew</span>
                                    <p className="text-gray-500 text-xs mt-4 uppercase tracking-widest">Procesando 1,000 torneos...</p>
                                </div>
                            ) : (
                                datos.map((item, index) => (
                                    <div key={index} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-black/40 rounded-xl p-2 flex items-center justify-center">
                                                <img src={item.escudo || "https://ui-avatars.com/api/?name=FPC"} alt={item.equipo} className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold uppercase font-['Space_Grotesk'] text-lg">{item.equipo}</h4>
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Probabilidad de Título</p>
                                            </div>
                                            <div className="ml-auto text-3xl font-black text-[#2ff801] font-['Space_Grotesk']">
                                                {item.prob_campeon}%
                                            </div>
                                        </div>
                                        
                                        {/* Barras de Progreso */}
                                        <div className="space-y-3">
                                            <ProbBar label="Avanzar a Semis" value={item.prob_semis} color="bg-blue-500" />
                                            <ProbBar label="Llegar a la Final" value={item.prob_final} color="bg-indigo-500" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Explicación IA */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-gradient-to-br from-blue-900/20 to-transparent p-8 rounded-[2rem] border border-blue-500/10">
                            <h3 className="font-['Space_Grotesk'] text-xl font-bold mb-4 uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#2ff801]">info</span>
                                ¿Cómo decide la IA?
                            </h3>
                            <ul className="space-y-4 text-gray-400 text-sm leading-relaxed">
                                <li className="flex gap-3">
                                    <span className="text-[#2ff801] font-bold">01.</span>
                                    La IA toma el <b>Rating de Poder</b> de cada equipo y simula los 180 minutos de cada llave.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-[#2ff801] font-bold">02.</span>
                                    Introduce un factor de <b>Entropía del 10%</b> para considerar lesiones, errores arbitrales o "suerte del campeón".
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-[#2ff801] font-bold">03.</span>
                                    En caso de empate global tras la simulación, se define mediante una <b>tanda de penaltis estocástica</b>.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const ProbBar = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest mb-1 text-gray-500">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div 
                className={`h-full ${color} transition-all duration-1000 ease-out`} 
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

export default SimuladorIA;