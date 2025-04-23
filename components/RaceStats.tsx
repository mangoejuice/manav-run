import { ElevationChip } from './ElevationChip';
import styles from './RaceStats.module.scss'
import { StatChip } from './StatChip';

export function RaceStats(props) {
    const { stats } = props;
    console.log('stats', stats);

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