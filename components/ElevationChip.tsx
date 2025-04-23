import styles from './Chips.module.scss'

export function ElevationChip(props) {
    const { gain, loss, net } = props;

    return (
        <div className={styles.container}>
            <div className={styles.title}>Elevation</div>
            <div className={styles.statContainer}>
                <div className={styles.statPostfix}>+</div>
                <div className={styles.statFigure}>{gain}</div>
                <div className={styles.statPostfix}>{" ft,"}</div>

                <div className={styles.statPostfix}>-</div>
                <div className={styles.statFigure}>{loss}</div>
                <div className={styles.statPostfix}>{" ft"}</div>

                <div className={styles.statPostfix}>{" (net: "}</div>
                <div className={styles.statFigure}>{net}</div>
                <div className={styles.statPostfix}>{" ft)"}</div>
            </div>
        </div>
    )
}
