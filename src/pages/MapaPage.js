import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useMapBox } from '../hooks/useMapBox';


const puntoInicial = {
    lat: 6.21127,
    lng: -75.5729987,
    zoom: 12
}

export const MapaPage = () => {

    const { coords, setRef, nuevoMarcador$, movimientoMarcador$ } = useMapBox( puntoInicial );

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        nuevoMarcador$.subscribe( marcador => {
            // nuevo marcador emitir
            socket.emit('marcador-nuevo', marcador)
        });
    }, [nuevoMarcador$, socket]);

    // Movimiento de marcador
    useEffect(() => {
        movimientoMarcador$.subscribe( marcador => {
            // TODO: emitir movimiento marcador
        });
    }, [movimientoMarcador$]);

    // Escuchar nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo', (marcador) => {
            console.log(marcador);
        });
    }, [socket])

    return (
        <>
            <div className="info">
                Lng: { coords.lng } | Lat: { coords.lat } | Zoom: { coords.zoom }
            </div>
            <div
                ref={ setRef }
                className="mapContainer"
            >
                
            </div>
        </>
    )
}
