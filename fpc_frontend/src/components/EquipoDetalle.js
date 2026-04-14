import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CONFIGURACIÓN DE ICONOS DE LEAFLET ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const EquipoDetalle = () => {
    const { id } = useParams();
    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(true);

    //Primero, cargamos los datos del equipo - useCallback lo que hace es memorizar la función para que no se vuelva a crear en cada renderizado, lo que es útil para evitar llamadas innecesarias a useEffect
    const cargarEquipo = useCallback(async () => {
        try {
            const res = await axios.get(`https://fpc-backend-devfelipe.onrender.com/api/equipos/${id}/`);
            setEquipo(res.data);
        } catch (error) {
            console.error("Error cargando equipo:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);
    
    useEffect(() => {
        cargarEquipo();
    }, [cargarEquipo]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center lg:pl-72">
                <span className="material-symbols-outlined animate-spin text-blue-500 text-6xl" >autorenew</span>
            </div>
        );
    }

    if (!equipo){
        return (
            <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center justify-center -lg:pl-72">
                <h2 className="text-3xl font-bold text-white mb-4">Equipo no encontrado</h2>
                <Link to='/equipos' className="text-blue-500 hover:underline" >Volver</Link>
            </div>
        );
    }

    //procesar las coordenadas para el mapa
    const lat = parseFloat(equipo.latitud);
    const lon = parseFloat(equipo.longitud);
    const tieneCoords = !isNaN(lat) && !isNaN(lon);

    return ( 
        <div className="min-h-screen bg-[#0e0e0e] text-white font-['Inter']">
            <style>{` 
                .glass-panel {
                background: rgba(38, 38, 38, 0.4);
                backdrop-filter: blur(24px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .leaflet-container {
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                    border-radius: 1.5rem;
                }
            `}</style>

            <main className="pt-32 pb-24 lg:pl-72 pr-8 px-6 min-h-screen bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0e0e0e_100%)]">
                
                {/* BOTÓN VOLVER */}
                <Link to="/equipos" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 font-bold uppercase tracking-widest text-xs">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Volver al Directorio
                </Link>

                {/* HEADER PRINCIPAL */}
                <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    
                    {/* Escudo */}
                    <div className="w-44 h-44 md:w-52 md:h-52 bg-white/5 rounded-3xl flex items-center justify-center p-6 border border-white/10 relative z-10 shrink-0 shadow-2xl">
                        <img 
                            src={equipo.escudo} 
                            alt={equipo.nombre_equipo}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=FPC"; }}
                        />
                    </div>
                    
                    <div className="relative z-10 text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase font-['Space_Grotesk']">
                            {equipo.nombre_equipo}
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                            <span className="text-gray-400 text-lg uppercase tracking-[0.2em]">{equipo.ciudad}</span>
                            <span className="text-blue-500/50 hidden md:inline">|</span>
                            <span className="text-gray-400 text-lg uppercase tracking-[0.2em]">{equipo.nombre_estadio}</span>
                        </div>

                        {/* Stats rápidas */}
                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0">
                            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Títulos</p>
                                <p className="text-3xl font-black text-[#2ff801] font-['Space_Grotesk']">{equipo.ligas_ganadas}</p>
                            </div>
                            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Fundación</p>
                                <p className="text-3xl font-black text-blue-400 font-['Space_Grotesk']">1946</p> 
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN HISTORIA Y MAPA */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    
                    {/* Historia */}
                    <div className="glass-panel rounded-[2rem] p-8 md:p-10">
                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2 font-['Space_Grotesk']">
                            <span className="material-symbols-outlined text-blue-500">history_edu</span>
                            Legado Histórico
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-lg italic">
                            {equipo.historia || "La historia de este club es parte fundamental del ecosistema del fútbol profesional colombiano..."}
                        </p>
                    </div>

                    {/* Mapa del Estadio */}
                    <div className="glass-panel rounded-[2rem] p-4 flex flex-col h-[450px]">
                        <div className="px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Ubicación Sede </h3>
                            <span className="text-[10px] text-[#2ff801] bg-[#2ff801]/10 px-2 py-1 rounded-full font-bold uppercase tracking-widest">Live Map</span>
                        </div>
                        
                        <div className="flex-grow rounded-2xl overflow-hidden border border-white/10 relative z-0">
                            {tieneCoords ? (
                                <MapContainer
                                    center={[lat, lon]}
                                    zoom={15}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[lat, lon]}>
                                        <Popup>
                                            <div className="text-black font-bold">
                                                {equipo.nombre_estadio}<br/>
                                                <span className="font-normal text-xs text-gray-500">Casa de {equipo.nombre_equipo}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="h-full w-full bg-white/5 flex flex-col items-center justify-center text-gray-600 italic">
                                    <span className="material-symbols-outlined text-4xl mb-2">map_off</span>
                                    <p className="text-xs uppercase tracking-widest">Coordenadas no disponibles</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EquipoDetalle;