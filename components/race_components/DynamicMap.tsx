import { useEffect } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './DynamicMap.module.scss';

const { MapContainer } = ReactLeaflet;

const DynamicMap = ({ children, className, width, height, ...rest }) => {
    useEffect(() => {
        (async function init() {
            delete Leaflet.Icon.Default.prototype._getIconUrl;
            Leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
                iconUrl: 'leaflet/images/marker-icon.png',
                shadowUrl: 'leaflet/images/marker-shadow.png',
            });
        })();
    }, []);

    return (
        <MapContainer className={styles.container}  {...rest}>
            {children(ReactLeaflet, Leaflet)}
        </MapContainer>
    )
}

export default DynamicMap;