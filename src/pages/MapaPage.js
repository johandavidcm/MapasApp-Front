import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useMapBox } from '../hooks/useMapBox';


const puntoInicial = {
    lat: 6.21127,
    lng: -75.5729987,
    zoom: 12
}

export const MapaPage = () => {

    const { coords, setRef, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapBox( puntoInicial );

    const { socket } = useContext(SocketContext);

    // Escuchar los marcadores existentes
    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
            for(const key of Object.keys(marcadores)){
                agregarMarcador(marcadores[key], key);
            }
        })
    }, [socket, agregarMarcador])

    useEffect(() => {
        nuevoMarcador$.subscribe( marcador => {
            // nuevo marcador emitir
            socket.emit('marcador-nuevo', marcador)
        });
    }, [nuevoMarcador$, socket]);

    // Movimiento de marcador
    useEffect(() => {
        movimientoMarcador$.subscribe( marcador => {
            socket.emit('marcador-actualizado', marcador);

        });
    }, [socket, movimientoMarcador$]);

    // Mover marcador mediante sockets
    useEffect(() => {
        socket.on('marcador-actualizado', (marcador) => {
            actualizarPosicion( marcador );
        });
    }, [socket, actualizarPosicion])

    // Escuchar nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo', (marcador) => {
            agregarMarcador(marcador, marcador.id);
        });
    }, [socket, agregarMarcador])

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
