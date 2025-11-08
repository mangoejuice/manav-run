import dynamic from 'next/dynamic';
import { useState } from 'react';
import { isEqual } from 'lodash';
import { RaceStats } from './RaceStats';

import styles from './GPXChunk.module.scss';

const DynamicMap = dynamic(() => import('./DynamicMap'), {
    ssr: false
});

const GPXTrack = dynamic(() => import('./GPXTrack'), {
    ssr: false
});

const DEFAULT_CENTER = [40.713733719308536, -73.9719296162436]

export function GPXChunk(props) {
    const { gpxFile, inOverlay = false, className } = props;
    const [trackStats, setTrackStats] = useState(null);

    const handleUpdateStats = (newStats) => {
        if (!isEqual(newStats, trackStats)) {
            setTrackStats(newStats);
        }
    };

    const containerClassName = `${styles.container} ${inOverlay ? styles.inOverlay : ''} ${className || ''}`;

    return (
        <div className={containerClassName}>
            <DynamicMap center={DEFAULT_CENTER} zoom={12} {...props} inOverlay={inOverlay}>
                {({ TileLayer }) => (
                    <>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <GPXTrack gpxFile={gpxFile} handleUpdateStats={handleUpdateStats} />
                    </>
                )}
            </DynamicMap>
            <RaceStats stats={trackStats} />
        </div>
    )
}
