import React, { useEffect } from 'react';
import { useMapBox } from '../hooks/useMapBox';


const puntoInicial = {
    lat: 6.21127,
    lng: -75.5729987,
    zoom: 12
}

export const MapaPage = () => {

    const { coords, setRef, nuevoMarcador$, movimientoMarcador$ } = useMapBox( puntoInicial );

    useEffect(() => {
        nuevoMarcador$.subscribe( marcador => {
            // TODO: nuevo marcador emitir
        });
    }, [nuevoMarcador$]);

    // Movimiento de marcador
    useEffect(() => {
        movimientoMarcador$.subscribe( marcador => {
            // TODO: emitir movimiento marcador
        });
    }, [movimientoMarcador$]);

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
