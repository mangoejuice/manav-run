import styles from './FloatingIcon.module.scss';

interface FloatingIconProps {
    onClick?: () => void;
    isOpen?: boolean;
}

export function FloatingIcon({ onClick, isOpen = false }: FloatingIconProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
        }
    };

    const icon = isOpen ? '×' : '🗺️';
    const ariaLabel = isOpen ? 'Close race map' : 'Open race map';

    return (
        <div
            className={`${styles.floatingIcon} ${isOpen ? styles.isOpen : ''}`}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={ariaLabel}
        >
            {icon}
        </div>
    );
}

