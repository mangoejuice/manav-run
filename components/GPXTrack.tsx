import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

const GPXTrack = ({ gpxFile, options = {} }) => {
    const map = useMap();
    const gpxLayerRef = useRef(null);

    useEffect(() => {
        if (!map) return;

        // Import leaflet and leaflet-gpx in the client side only
        const L = require('leaflet');
        require('leaflet-gpx');

        // Default options
        const defaultOptions = {
            async: true,
            marker_options: {
                startIconUrl: '',
                endIconUrl: '',
                shadowUrl: ''
            },
            polyline_options: {
                color: 'green',
                weight: 4,
                opacity: 0.8
            }
        };

        // Merge default options with user-provided options
        const mergedOptions = { ...defaultOptions, ...options };

        // Create a new GPX layer
        const gpxLayer = new L.GPX(gpxFile, mergedOptions)
            .on('loaded', (e) => {
                const gpx = e.target;
                map.fitBounds(gpx.getBounds());
                const pace = gpx.get_moving_pace()
                console.log("pace", pace)
                console.log("GPX loaded successfully");
            })
            .on('error', (e) => {
                console.error("Error loading GPX:", e);
            });

        // Add the layer to the map
        gpxLayer.addTo(map);
        gpxLayerRef.current = gpxLayer;

        // Cleanup function to remove the layer when component unmounts
        return () => {
            if (gpxLayerRef.current) {
                map.removeLayer(gpxLayerRef.current);
            }
        };
    }, [map, gpxFile, options]);

    return null; // This component doesn't render anything
};

export default GPXTrack;