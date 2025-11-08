import { useEffect } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './DynamicMap.module.scss';

const { MapContainer } = ReactLeaflet;

const DynamicMap = ({ children, className, width, height, inOverlay = false, ...rest }) => {
    const containerClassName = `${styles.container} ${inOverlay ? styles.inOverlay : ''} ${className || ''}`;
    return (
        <MapContainer className={containerClassName}  {...rest}>
            {children(ReactLeaflet, Leaflet)}
        </MapContainer>
    )
}

export default DynamicMap;