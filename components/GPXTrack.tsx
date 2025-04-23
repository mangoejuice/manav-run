import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

const GPXTrack = ({ gpxFile, handleUpdateStats, options = {} }) => {
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

        const mergedOptions = { ...defaultOptions, ...options };

        // Create a new GPX layer
        const gpxLayer = new L.GPX(gpxFile, mergedOptions)
            .on('loaded', (e) => {
                const gpx = e.target;
                map.fitBounds(gpx.getBounds());

                const gain = gpx.get_elevation_gain_imp();
                const loss = gpx.get_elevation_loss_imp();
                const net = gain - loss;

                const stats = {
                    moving_time: gpx.get_duration_string(gpx.get_moving_time(), true).replace(/^0+/, ''),
                    distance: gpx.get_distance_imp().toFixed(2),
                    moving_pace: gpx.get_duration_string(gpx.get_moving_pace_imp(), true).replace(/^0+/, ''),
                    elevation_gain: gain.toFixed(0),
                    elevation_loss: loss.toFixed(0),
                    net_elevation: net.toFixed(0)
                }
                console.log(stats);

                handleUpdateStats(stats);
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
    }, [map, gpxFile, options, handleUpdateStats]);

    return null; // This component doesn't render anything
};

export default GPXTrack;