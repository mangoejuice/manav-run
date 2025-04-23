import { useEffect } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './DynamicMap.module.scss';

const { MapContainer } = ReactLeaflet;

const DynamicMap = ({ children, className, width, height, ...rest }) => {
    return (
        <MapContainer className={styles.container}  {...rest}>
            {children(ReactLeaflet, Leaflet)}
        </MapContainer>
    )
}

export default DynamicMap;