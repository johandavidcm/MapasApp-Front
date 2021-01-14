import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import { v4 } from 'uuid';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9oYW5kYXZpZGNtIiwiYSI6ImNrams3NWR4ZjAydjcyc28waXU4dG01cmcifQ.EvHvdvenKpgd3pMqzvPpng';


export const useMapBox = ( puntoInicial ) => {
    
    const mapaDiv = useRef();
    const setRef = useCallback( ( node ) => {
        mapaDiv.current = node;
    }, [])

    const mapa = useRef();
    const [ coords, setCoords ] = useState(puntoInicial);

    // Referencia al marcador
    const marcadores = useRef({});

    // Observables de Rxjs
    const movimientoMarcador = useRef( new Subject() );
    const nuevoMarcador = useRef( new Subject() );

    // función para agregar marcadores
    const agregarMarcador = useCallback( (ev) => {
        const { lng, lat } = ev.lngLat;
        const marker = new mapboxgl.Marker();
        marker.id = v4(); // TODO: Si el marcador ya tiene ID

        marker
            .setLngLat({
                lng,
                lat
            })
            .addTo( mapa.current )
            .setDraggable(true);
        // Asignamos al objeto de marcadores
        marcadores.current[ marker.id ] = marker;

        // TODO: Si el marcador tiene ID no emitir
        nuevoMarcador.current.next( {
            id: marker.id,
            lng,
            lat
        });

        // Escuchar movimientos del marcador
        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();
            // TODO: Emitir los cambios del marcador
            movimientoMarcador.current.next({
                id,
                lng,
                lat
            });
        });
    }, [])

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ puntoInicial.lng, puntoInicial.lat ],
            zoom: puntoInicial.zoom
        });
        mapa.current = map;
    }, [ puntoInicial ]);

    // Cuando se mueve el mapa
    useEffect(() => {
        mapa.current?.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoords( {
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            });
        });

        return mapa.current?.off('move');
    }, [ ]);

    // Agregar marcadores
    useEffect(() => {
        mapa.current?.on('click', (ev) => {
            agregarMarcador(ev);
        });
    }, [agregarMarcador]);

    return {
        agregarMarcador,
        coords,
        marcadores,
        setRef,
        // El simbolo de dolar es más cuestones de Semantica
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current
    }    
}
