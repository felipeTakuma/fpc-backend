import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Home = () => {
    // --- ESTADO 1: GOLEADORES DINÁMICOS DEL HERO ---
    const [goleadoresHero, setGoleadoresHero] = useState({ //useState lo que hace es crear un estado local en el componente, en este caso un objeto con dos propiedades: nacional y medellin, cada una con un nombre y goles. Inicialmente, se establece como "Cargando..." y "-" respectivamente, para mostrar algo mientras se cargan los datos reales desde la API.
        nacional: { nombre: "Cargando...", goles: "-" },
        medellin: { nombre: "Cargando...", goles: "-" }
    });

    // --- ESTADO 2: NOTICIAS DINÁMICAS ---
    const [noticias, setNoticias] = useState([]); //useState lo que hace es crear un estado local en el componente, en este caso un array vacío para almacenar las noticias que se cargarán desde la API.
    const [cargandoNoticias, setCargandoNoticias] = useState(true);

    // --- FUNCION MEMORIZADA PARA CARGAR TODO EL CONTENIDO DINÁMICO ---
    // usamos UseCallback para memorizar y que no se vuelva a crear la función cada vez que el componente se renderiza.
    const cargarDatosIniciales = useCallback(async () => {
        try {
            //Realizamos ambas peticiones en paralelo usando Promise.all para optimizar tiempos de carga.
            const [resGoleadores, resNoticias] = await Promise.all([
                axios.get('https://fpc-backend-devfelipe.onrender.com/api/goleadores/'),
                axios.get('https://fpc-backend-devfelipe.onrender.com/api/noticias/')
            ]);

            //procesamos los goleadores
            const goleadores = resGoleadores.data;
            const getTopScorer = (palabraClave) => {
                const equipoGoleadores = goleadores.filter(g =>
                    g.equipo && g.equipo.nombre_equipo.toLowerCase().includes(palabraClave.toLowerCase())
                );
                if (equipoGoleadores.length === 0) return { nombre: "Sin datos", goles: "-" };
                return equipoGoleadores.sort((a, b) => b.goles - a.goles)[0]; // Ordenamos por goles y tomamos el primero (máximo)
            };
            setGoleadoresHero({
                nacional: getTopScorer("nacional"),
                medellin: getTopScorer("medellin")
            });
            //procesamos las noticias
            setNoticias(resNoticias.data);
            setCargandoNoticias(false);

        } catch (error) {
            console.error("Error 429 o de conexion detectado:", error);

            //si el error es 429, el server nos bloqueo.usamos datos de respaldo.
            if (error.response && error.response.status === 429) {
                console.warn("Demasiadas peticiones. Cargando datos de respaldo...");
            }

            //Datos de respaldo
            setGoleadoresHero({
                nacional: { nombre: "E. Cardona", goles: 6},
                medellin: { nombre: "B. Leon", goles: 5 }
            });
            setNoticias([
                { 
                    id: 1, 
                    titulo: "Liga BetPlay: Novedades de la jornada y tabla de posiciones", 
                    resumen: "Un resumen completo de los encuentros más destacados del fin de semana.", 
                    fuente: "FPC News", 
                    tiempo: "Hace 1h", 
                    imagen: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200",
                    url: "#"
                },
                { 
                    id: 2, 
                    titulo: "Mercado de pases al rojo vivo en el fútbol colombiano", 
                    resumen: "Movimientos clave en los equipos élite de cara a los cuadrangulares.", 
                    fuente: "Transfer FPC", 
                    tiempo: "Hace 3h", 
                    imagen: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=200",
                    url: "#"
                },
                { 
                    id: 3, 
                    titulo: "La Inteligencia Artificial revoluciona la táctica en la liga", 
                    resumen: "Cómo los clubes están invirtiendo en ciencia de datos para ganar partidos.", 
                    fuente: "Tech Sports", 
                    tiempo: "Hace 5h", 
                    imagen: "https://images.unsplash.com/photo-1518605368461-1ee7e54c00d4?w=200",
                    url: "#"
                }
            ]);
            setCargandoNoticias(false);
        }
    }, []);

    useEffect(() => {
        cargarDatosIniciales();
    }, [cargarDatosIniciales]); // solo se ejecuta una vez al montar el componente, gracias a la dependencia de cargarDatosIniciales que está memorizado.
    
    return (
        <div className="stitch-theme min-h-screen bg-[#0e0e0e] text-white font-['Inter'] selection:bg-blue-500 selection:text-white">
            {/* INYECTOR DE ESTILOS CSS */}
            <style>{`
                .stitch-theme .glass { 
                    background: rgba(38, 38, 38, 0.6); 
                    backdrop-filter: blur(24px); 
                }
            `}</style>

            <main className="pt-24 pb-24 md:pl-72 md:pr-8 min-h-screen px-4 bg-[radial-gradient(circle_at_top_right,_#1e1b4b_0%,_#0e0e0e_100%)]">
                
                
                <section className="mb-10 relative group">
                    <div className="relative overflow-hidden rounded-3xl h-[420px] bg-[#1a1a1a] border border-white/10 shadow-2xl">
                        {/* Imagen de fondo del estadio */}
                        <div className="absolute inset-0 opacity-20">
                            <img 
                                alt="Stadium" 
                                className="w-full h-full object-cover grayscale" 
                                src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop" 
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/60 to-transparent"></div>
                        
                        {/* Contenido del Hero */}
                        <div className="relative h-full flex flex-col justify-center p-12 max-w-2xl z-10">
                            <div className="inline-flex items-center gap-2 bg-[#106e00]/20 text-[#2ff801] px-3 py-1 rounded-full mb-6 border border-[#2ff801]/20 backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ff801] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ff801]"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest font-['Space_Grotesk']">Live AI Analysis</span>
                            </div>

                            <h1 className="font-['Space_Grotesk'] text-6xl md:text-7xl font-extrabold tracking-tighter mb-4 leading-none uppercase">
                                EL CLÁSICO <br/><span className="text-[#3766ff] italic">PAISA</span>
                            </h1>

                            <div className="flex items-center gap-8 mb-8">
                                <div className="flex flex-col">
                                    <span className="font-['Space_Grotesk'] text-2xl font-bold">NACIONAL</span>
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest">Home</span>
                                </div>
                                <div className="font-['Space_Grotesk'] text-4xl font-light text-blue-500/40 italic">VS</div>
                                <div className="flex flex-col">
                                    <span className="font-['Space_Grotesk'] text-2xl font-bold">MEDELLÍN</span>
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest">Away</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {/* BOTÓN FUNCIONAL: Redirige a /prediccion */}
                                <a 
                                    href="/prediccion" 
                                    className="bg-gradient-to-r from-[#3766ff] to-[#95aaff] text-black font-['Space_Grotesk'] font-bold px-8 py-4 rounded-xl text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/20 inline-block text-center"
                                >
                                    Predict Outcome
                                </a>
                                <div className="glass border border-white/10 px-6 py-4 rounded-xl flex items-center gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">AI Win Prob.</p>
                                        <p className="font-['Space_Grotesk'] text-xl font-bold text-[#2ff801]">64.2%</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Draw Prob.</p>
                                        <p className="font-['Space_Grotesk'] text-xl font-bold text-white">21.5%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TARJETA DINÁMICA DE GOLEADORES */}
                        <div className="hidden lg:block absolute right-12 bottom-12 w-72 glass p-6 rounded-2xl border border-white/5 shadow-2xl">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2ff801] mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">local_fire_department</span>
                                Artilleros del Clásico
                            </p>
                            
                            {/* Goleador Nacional */}
                            <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Nacional</span>
                                    <span className="font-['Space_Grotesk'] text-lg font-bold text-white leading-none">
                                        {goleadoresHero.nacional.nombre}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[#3766ff] font-['Space_Grotesk'] text-2xl font-bold leading-none">
                                        {goleadoresHero.nacional.goles}
                                    </span>
                                    <span className="text-gray-500 text-[9px] uppercase tracking-widest mt-1">Goles</span>
                                </div>
                            </div>

                            {/* Goleador Medellín */}
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Medellín</span>
                                    <span className="font-['Space_Grotesk'] text-lg font-bold text-white leading-none">
                                        {goleadoresHero.medellin.nombre}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[#ff6e84] font-['Space_Grotesk'] text-2xl font-bold leading-none">
                                        {goleadoresHero.medellin.goles}
                                    </span>
                                    <span className="text-gray-500 text-[9px] uppercase tracking-widest mt-1">Goles</span>
                                </div>
                            </div>
                            
                            <p className="mt-5 text-[8px] text-gray-500 italic uppercase text-center tracking-widest">
                                Actualizado en tiempo real
                            </p>
                        </div>
                    </div>
                </section>

                {/* GRID DE ANALÍTICA Y NOTICIAS */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
                    {/* HERRAMIENTAS RÁPIDAS (4 COLS) */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <a href="/prediccion" className="bg-[#20201f] p-6 rounded-3xl border border-white/5 hover:bg-[#2c2c2c] transition-all cursor-pointer group block">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <span className="material-symbols-outlined text-3xl">psychology</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-600 group-hover:text-blue-400 transition-colors text-sm">arrow_forward_ios</span>
                            </div>
                            <h3 className="font-['Space_Grotesk'] text-xl font-bold mb-1 uppercase">AI Toolset</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Deep dive into player stats, historical performance, and neural patterns.</p>
                        </a>

                        <a href="/equipos" className="bg-[#20201f] p-6 rounded-3xl border border-white/5 hover:bg-[#2c2c2c] transition-all cursor-pointer group block">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[#106e00]/20 flex items-center justify-center text-[#2ff801]">
                                    <span className="material-symbols-outlined text-3xl">groups</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-600 group-hover:text-[#2ff801] transition-colors text-sm">arrow_forward_ios</span>
                            </div>
                            <h3 className="font-['Space_Grotesk'] text-xl font-bold mb-1 uppercase">Team Database</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Complete rosters, injury reports, and transfer market insights.</p>
                        </a>
                    </div>

                    {/* NOTICIAS DINÁMICAS (8 COLS) */}
                    <div className="md:col-span-8 bg-[#131313] rounded-3xl border border-white/5 p-8 flex flex-col h-full">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="font-['Space_Grotesk'] text-3xl font-extrabold tracking-tight uppercase italic">Breaking News</h2>
                                <p className="text-gray-500 text-sm">Inside the Colombian Football Ecosystem</p>
                            </div>
                            <button className="text-blue-400 font-bold text-[10px] uppercase tracking-widest hover:underline">Ver todas</button>
                        </div>

                        <div className="space-y-6 flex-grow">
                            {cargandoNoticias ? (
                                <div className="flex flex-col items-center justify-center h-full py-10">
                                    <span className="material-symbols-outlined animate-spin text-blue-500 text-4xl">autorenew</span>
                                    <p className="text-gray-500 text-xs mt-3 uppercase tracking-widest">Sincronizando fuentes...</p>
                                </div>
                            ) : (
                                noticias.slice(0, 3).map((noticia) => (
                                    <a key={noticia.id} href={noticia.url} target="_blank" rel="noreferrer" className="flex gap-6 items-center group cursor-pointer bg-white/[0.02] p-3 rounded-2xl hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-black/50">
                                            <img 
                                                alt="News" 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                src={noticia.imagen || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200"} 
                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200" }}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-[#2ff801] uppercase tracking-widest">{noticia.fuente}</span>
                                                <span className="text-gray-500 text-[10px]">• {noticia.tiempo}</span>
                                            </div>
                                            <h4 className="font-['Space_Grotesk'] text-lg font-bold group-hover:text-blue-400 transition-colors leading-tight uppercase line-clamp-2">
                                                {noticia.titulo}
                                            </h4>
                                            <p className="text-gray-500 text-sm mt-1 line-clamp-1">{noticia.resumen}</p>
                                        </div>
                                    </a>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* MINI INSIGHTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <InsightCard icon="trending_up" label="League Vol." value="$204.85M" color="text-blue-400" />
                    <InsightCard icon="bolt" label="Avg Odds" value="2.14" color="text-[#2ff801]" />
                    <InsightCard icon="precision_manufacturing" label="AI Accuracy" value="89.2%" color="text-cyan-400" />
                    <InsightCard icon="timer" label="Next Lock" value="04:12:00" color="text-red-500" />
                </div>
            </main>
        </div>
    );
};

// Componente auxiliar para las tarjetas de Insight inferiores
const InsightCard = ({ icon, label, value, color }) => (
    <div className="bg-[#20201f] p-5 rounded-2xl border border-white/5 flex items-center gap-4 transition-transform hover:scale-105">
        <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <div>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{label}</p>
            <p className="font-['Space_Grotesk'] text-xl font-bold">{value}</p>
        </div>
    </div>
);

export default Home;