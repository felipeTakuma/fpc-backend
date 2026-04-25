import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Asegúrate de importar el CSS base

// --- CONFIGURACIÓN DE ICONOS ---
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
                <span className="material-symbols-outlined animate-spin text-blue-500 text-6xl">autorenew</span>
            </div>
        );
    }

    if (!equipo) return null;

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
                /* ESTO SOLUCIONA EL TAMAÑO DE 256px */
                .leaflet-container {
                    width: 100% !important;
                    height: 400px !important; /* Altura fija para obligar al contenedor */
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                    border-radius: 1.5rem;
                }
                /* Asegura que los botones de zoom (+/-) se vean */
                .leaflet-control-zoom {
                    border: none !important;
                    margin-top: 20px !important;
                    margin-left: 20px !important;
                }
                .leaflet-control-zoom-in, .leaflet-control-zoom-out {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    backdrop-filter: blur(10px);
                }
            `}</style>

            <main className="pt-32 pb-24 lg:pl-72 pr-8 px-6 min-h-screen bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0e0e0e_100%)]">
                
                {/* Cabecera del Equipo (Igual que antes) */}
                <Link to="/equipos" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 font-bold uppercase tracking-widest text-xs">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Volver al Directorio
                </Link>

                <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden">
                    <div className="w-44 h-44 md:w-52 md:h-52 bg-white/5 rounded-3xl flex items-center justify-center p-6 border border-white/10 relative z-10 shrink-0 shadow-2xl">
                        <img src={equipo.escudo} alt={equipo.nombre_equipo} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase font-['Space_Grotesk']">
                            {equipo.nombre_equipo}
                        </h1>
                        <p className="text-gray-400 text-lg uppercase tracking-[0.2em]">{equipo.ciudad} | {equipo.nombre_estadio}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="glass-panel rounded-[2rem] p-8 md:p-10">
                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2 font-['Space_Grotesk']">
                            <span className="material-symbols-outlined text-blue-500">history_edu</span>
                            Legado Histórico
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-lg italic">{equipo.historia}</p>
                    </div>

                    {/* SECCIÓN DEL MAPA CORREGIDA */}
                    <div className="glass-panel rounded-[2rem] p-4 flex flex-col min-h-[480px]">
                        <div className="px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Ubicación Sede</h3>
                            <span className="text-[10px] text-[#2ff801] bg-[#2ff801]/10 px-2 py-1 rounded-full font-bold uppercase tracking-widest">Live Map</span>
                        </div>
                        
                        <div className="flex-grow rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                            {tieneCoords ? (
                                <MapContainer
                                    key={equipo.id} // Forzamos el re-render cuando cambia el equipo
                                    center={[lat, lon]}
                                    zoom={15}
                                    style={{ height: '400px', width: '100%' }} // Estilo en línea para Leaflet
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[lat, lon]}>
                                        <Popup>
                                            <div className="text-black font-bold">{equipo.nombre_estadio}</div>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-gray-600">
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