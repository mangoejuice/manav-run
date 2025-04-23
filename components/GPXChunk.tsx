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
    const { gpxFile } = props;
    const [trackStats, setTrackStats] = useState(null);

    const handleUpdateStats = (newStats) => {
        if (!isEqual(newStats, trackStats)) {
            setTrackStats(newStats);
        }
    };

    return (
        <div className={styles.container}>
            <DynamicMap center={DEFAULT_CENTER} zoom={12} {...props}>
                {({ TileLayer }) => (
                    <>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>"
                        />
                        <GPXTrack gpxFile={gpxFile} handleUpdateStats={handleUpdateStats} />
                    </>
                )}
            </DynamicMap>
            <RaceStats stats={trackStats} />
        </div>
    )
}
