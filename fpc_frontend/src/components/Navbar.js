import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Navigation = () => {
    const currentPath = window.location.pathname;
    const isActive = (path) => currentPath === path;

    // --- ESTADO GLOBAL DEL EQUIPO SELECCIONADO (Por defecto América) ---
    const [equipoFoco, setEquipoFoco] = useState('América');

    // --- ESTADOS PARA EL BUSCADOR ---
    const [busqueda, setBusqueda] = useState('');
    const [equiposBd, setEquiposBd] = useState([]);
    const [resultados, setResultados] = useState({ equipos: [], jugadores: [] });
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const buscadorRef = useRef(null);

    // --- ESTADOS PARA NOTIFICACIONES ---
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
    const notificacionesRef = useRef(null);

    // 1. BASE DE DATOS DE NOTICIAS POR EQUIPO (Con clases de Tailwind completas para evitar errores de renderizado)
    const noticiasPorEquipo = {
        'América': {
            titulo: "Actualidad Escarlata",
            textClass: "text-red-500",
            bgClass: "bg-red-600/20",
            borderClass: "border-red-600",
            icon: "local_fire_department",
            items: [
                { id: 1, titulo: "América prepara el once para el clásico", tiempo: "2h" },
                { id: 2, titulo: "Novedades médicas en Cascajal", tiempo: "5h" },
                { id: 3, titulo: "IA: Probabilidades de clasificación", tiempo: "1d" },
                { id: 4, titulo: "Entrenamiento a puerta cerrada", tiempo: "1d" },
                { id: 5, titulo: "Historial vs próximo rival", tiempo: "2d" }
            ]
        },
        'Millonarios': {
            titulo: "Pulso Embajador",
            textClass: "text-blue-500",
            bgClass: "bg-blue-600/20",
            borderClass: "border-blue-600",
            icon: "sports_soccer",
            items: [
                { id: 1, titulo: "Millonarios renueva su alianza tecnológica", tiempo: "1h" },
                { id: 2, titulo: "Plan de boletería para El Campín", tiempo: "4h" },
                { id: 3, titulo: "IA: Análisis del mediocampo azul", tiempo: "6h" },
                { id: 4, titulo: "Viaje confirmado a la próxima sede", tiempo: "1d" },
                { id: 5, titulo: "Entrevista exclusiva con el capitán", tiempo: "2d" }
            ]
        },
        'Nacional': {
            titulo: "Reporte Verdolaga",
            textClass: "text-green-500",
            bgClass: "bg-green-600/20",
            borderClass: "border-green-600",
            icon: "star",
            items: [
                { id: 1, titulo: "Nacional lidera el ranking de efectividad IA", tiempo: "30m" },
                { id: 2, titulo: "Novedades en la sede de Guarne", tiempo: "3h" },
                { id: 3, titulo: "Balance tras la última jornada", tiempo: "8h" },
                { id: 4, titulo: "Venta de abonos para la fase final", tiempo: "1d" },
                { id: 5, titulo: "Leyendas visitan el Atanasio", tiempo: "2d" }
            ]
        }
    };

    // Helper para obtener datos del equipo actual
    const infoActual = noticiasPorEquipo[equipoFoco];

    useEffect(() => {
        axios.get('https://fpc-backend-devfelipe.onrender.com/api/equipos/')
            .then(res => setEquiposBd(res.data))
            .catch(err => console.error("Error:", err));
    }, []);

    const manejarCambioBusqueda = (e) => {
        const query = e.target.value;
        setBusqueda(query);
        
        if (query.length >= 2) {
            setMostrarBuscador(true);
            const queryMinuscula = query.toLowerCase();

            // Filtramos equipos reales
            const equiposFiltrados = equiposBd.filter(eq => 
                eq.nombre_equipo.toLowerCase().includes(queryMinuscula)
            );
            
            // Mock de jugadores
            const baseJugadoresMock = [
                { id: 101, nombre: "Yeison Guzmán", equipo: "America de Cali" },
                { id: 102, nombre: "Carlos Darwin Quintero", equipo: "Deportivo Pereira" },
                { id: 103, nombre: "Edwin Cardona", equipo: "Atlético Nacional" },
                { id: 104, nombre: "Hugo Rodallega", equipo: "Santa Fe" },
                { id: 105, nombre: "Adrián Ramos", equipo: "América de Cali" }
            ];
            
            const jugadoresFiltrados = baseJugadoresMock.filter(jug => 
                jug.nombre.toLowerCase().includes(queryMinuscula) || 
                jug.equipo.toLowerCase().includes(queryMinuscula)
            );

            setResultados({ 
                equipos: equiposFiltrados, 
                jugadores: jugadoresFiltrados 
            });
        } else {
            setMostrarBuscador(false);
        }
    };

    useEffect(() => {
        const handleClickFuera = (e) => {
            if (buscadorRef.current && !buscadorRef.current.contains(e.target)) setMostrarBuscador(false);
            if (notificacionesRef.current && !notificacionesRef.current.contains(e.target)) setMostrarNotificaciones(false);
        };
        document.addEventListener("mousedown", handleClickFuera);
        return () => document.removeEventListener("mousedown", handleClickFuera);
    }, []);

    return (
        <>
            {/* --- TOP NAVBAR --- */}
            <nav className="fixed top-0 z-50 w-full h-20 px-6 md:px-8 flex justify-between items-center bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-white/5 shadow-lg">
                
                {/* Logo */}
                <div className="text-2xl font-black italic text-white tracking-tighter font-['Space_Grotesk']">
                    FPC <span className="text-blue-500">AI Predict</span>
                </div>
                
                {/* ENLACES CENTRALES (¡RESTAUADROS!) */}
                <div className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] font-bold tracking-tight uppercase text-sm">
                    <a href="/" className={`transition-colors pb-1 ${isActive('/') ? 'text-white border-b-2 border-[#2ff801]' : 'text-gray-500 hover:text-white'}`}>
                        Dashboard
                    </a>
                    <a href="/prediccion" className={`transition-colors pb-1 ${isActive('/prediccion') ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}>
                        Predicción IA
                    </a>
                    <a href="/equipos" className={`transition-colors pb-1 ${isActive('/equipos') ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}>
                        Equipos
                    </a>
                </div>

                {/* Acciones Derecha */}
                <div className="flex items-center gap-4">
                    
                    {/* 1. BUSCADOR GLOBAL CONECTADO A DB */}
                    <div ref={buscadorRef} className="relative hidden lg:block">
                        <div className="bg-[#1a1a1a] rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 focus-within:border-blue-500/50 transition-colors w-64">
                            <span className="material-symbols-outlined text-gray-500 text-sm">search</span>
                            <input 
                                value={busqueda}
                                onChange={manejarCambioBusqueda}
                                onClick={() => busqueda.length >= 2 && setMostrarBuscador(true)}
                                className="bg-transparent border-none focus:ring-0 text-sm text-white w-full outline-none placeholder:text-gray-600" 
                                placeholder="Buscar equipos o jugadores..." 
                                type="text"
                                autoComplete="off"
                            />
                        </div>

                        {/* DESPLEGABLE DE RESULTADOS */}
                        {mostrarBuscador && (
                            <div className="absolute top-full mt-3 right-0 w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-4 bg-gradient-to-b from-blue-900/10 to-transparent">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Equipos</p>
                                    {resultados.equipos.length > 0 ? (
                                        resultados.equipos.map(eq => (
                                            <a key={eq.id} href={`/equipos`} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer mb-1">
                                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center p-1 overflow-hidden">
                                                    {eq.escudo ? <img src={eq.escudo} alt={eq.nombre_equipo} className="w-full h-full object-contain" /> : <span className="material-symbols-outlined text-blue-400 text-xs">shield</span>}
                                                </div>
                                                <span className="font-bold text-sm text-white">{eq.nombre_equipo}</span>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500 italic p-2">No se encontraron equipos.</p>
                                    )}
                                </div>
                                
                                <div className="p-4 border-t border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Jugadores</p>
                                    {resultados.jugadores.length > 0 ? (
                                        resultados.jugadores.map(jug => (
                                            <div key={jug.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors mb-1 opacity-70 cursor-default">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
                                                    <span className="text-sm text-white">{jug.nombre}</span>
                                                </div>
                                                <span className="text-[9px] text-gray-500 bg-black/50 px-2 py-1 rounded-md max-w-[100px] truncate">{jug.equipo}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500 italic p-2">No se encontraron jugadores.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. NOTIFICACIONES DINÁMICAS */}
                    <div ref={notificacionesRef} className="relative hidden sm:block">
                        <button 
                            onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                            className={`p-2 rounded-full transition-colors relative ${mostrarNotificaciones ? `${infoActual.bgClass} ${infoActual.textClass}` : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            <span className={`absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse ${infoActual.bgClass.split('/')[0]}`}></span>
                        </button>

                        {/* DESPLEGABLE DE NOTICIAS */}
                        {mostrarNotificaciones && (
                            <div className={`absolute top-full mt-4 right-0 w-80 bg-[#1a1a1a] border-t-4 ${infoActual.borderClass} border-x border-b border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2`}>
                                <div className={`p-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between`}>
                                    <h4 className="font-['Space_Grotesk'] font-bold text-white uppercase tracking-tight text-sm">{infoActual.titulo}</h4>
                                    <span className={`material-symbols-outlined ${infoActual.textClass} text-sm`}>{infoActual.icon}</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {infoActual.items.map((noticia) => (
                                        <a key={noticia.id} href="#" className="block p-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <p className="text-sm text-gray-300 group-hover:text-white font-medium leading-snug mb-2 transition-colors">
                                                {noticia.titulo}
                                            </p>
                                            <p className={`text-[10px] ${infoActual.textClass} uppercase tracking-widest font-bold`}>
                                                {noticia.tiempo}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                                <div className="p-3 text-center bg-black/20">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Sincronizado vía IA</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. PERFIL (Futuro Login) */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 cursor-not-allowed opacity-50 relative group">
                        <img alt="Perfil" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white text-sm">lock</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- SIDE NAVBAR --- */}
            <aside className="hidden lg:flex flex-col py-6 px-4 gap-4 h-[calc(100vh-5rem)] w-64 fixed left-0 top-20 bg-[#131313]/90 backdrop-blur-2xl border-r border-white/5 z-40">
                <div className="mb-4 px-2 mt-2">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                        </div>
                        <h3 className="font-['Space_Grotesk'] font-bold text-white tracking-tight uppercase">Equipos Élite</h3>
                    </div>
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mt-2 ${infoActual.textClass}`}>AI Live Pulse</p>
                </div>
                
                <nav className="flex flex-col gap-2">
                    <button 
                        onClick={() => setEquipoFoco('Millonarios')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest text-left ${equipoFoco === 'Millonarios' ? 'bg-blue-600/10 text-blue-500 border-r-4 border-blue-600' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined text-sm">sports_soccer</span> Millonarios
                    </button>

                    <button 
                        onClick={() => setEquipoFoco('Nacional')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest text-left ${equipoFoco === 'Nacional' ? 'bg-green-600/10 text-green-500 border-r-4 border-green-600' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined text-sm">star</span> Nacional
                    </button>

                    <button 
                        onClick={() => setEquipoFoco('América')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest text-left ${equipoFoco === 'América' ? 'bg-red-600/10 text-red-500 border-r-4 border-red-600' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined text-sm">local_fire_department</span> América
                    </button>
                </nav>
            </aside>

            {/* --- BOTTOM NAVBAR (Móviles) --- */}
            <nav className="fixed bottom-0 w-full rounded-t-3xl lg:hidden bg-[#0e0e0e]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] h-20 px-6 pb-safe flex justify-around items-center z-50">
                <a href="/" className={`flex flex-col items-center px-4 py-2 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all ${isActive('/') ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500'}`}>
                    <span className="material-symbols-outlined mb-1">grid_view</span>
                    Home
                </a>
                <a href="/equipos" className={`flex flex-col items-center px-4 py-2 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all ${isActive('/equipos') ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500'}`}>
                    <span className="material-symbols-outlined mb-1">shield</span>
                    Equipos
                </a>
                <a href="/prediccion" className={`flex flex-col items-center px-4 py-2 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all ${isActive('/prediccion') ? 'bg-[#2ff801]/20 text-[#2ff801]' : 'text-gray-500'}`}>
                    <span className="material-symbols-outlined mb-1">psychology</span>
                    Predicción
                </a>
                <a href="#" className="flex flex-col items-center text-gray-500 px-4 py-2 font-bold text-[10px] uppercase tracking-widest transition-colors hover:text-white">
                    <span className="material-symbols-outlined mb-1">account_circle</span>
                    Perfil
                </a>
            </nav>
        </>
    );
};

export default Navigation;