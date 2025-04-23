import styles from './Chips.module.scss'

export function StatChip(props) {
    const { title, stat } = props;

    let unitPostfix = null;
    if (title === 'Distance') {
        unitPostfix = 'mi';
    } else if (title === 'Pace') {
        unitPostfix = '/mi';
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                {title}
            </div>
            <div className={styles.statContainer}>
                <div className={styles.statFigure}>{stat}</div>
                {
                    unitPostfix ? <div className={styles.statPostfix}>{unitPostfix}</div> : null
                }
            </div>
        </div>
    )
}