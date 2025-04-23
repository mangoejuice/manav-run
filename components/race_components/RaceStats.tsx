import { ElevationChip } from './ElevationChip';
import { StatChip } from './StatChip';

import styles from './RaceStats.module.scss'

export function RaceStats(props) {
    const { stats } = props;

    return (
        stats ? (
            <div className={styles.container} >
                <div className={styles.statRow}>
                    <StatChip title='Distance' stat={stats.distance} />
                    <StatChip title='Pace' stat={stats.moving_pace} />
                    <StatChip title='Time' stat={stats.moving_time} />
                </div>
                <ElevationChip
                    gain={stats.elevation_gain}
                    loss={stats.elevation_loss}
                    net={stats.net_elevation}
                />
            </div>
        ) : <p>{"Loading"}</p>
    )
}