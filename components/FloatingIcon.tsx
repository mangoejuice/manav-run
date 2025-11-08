import styles from './FloatingIcon.module.scss';

interface FloatingIconProps {
    onClick?: () => void;
    icon?: string;
}

export function FloatingIcon({ onClick, icon = '🗺️' }: FloatingIconProps) {
    return (
        <div className={styles.floatingIcon} onClick={onClick} role="button" tabIndex={0}>
            {icon}
        </div>
    );
}

