import { useEffect } from 'react';
import { GPXChunk } from "./race_components/GPXChunk";
import styles from './GPXOverlay.module.scss';
import { getGPXFilePathFromRaceID } from './BlogSidebar';

interface GPXOverlayProps {
    raceID: string;
    isOpen: boolean;
    onClose: () => void;
}

export function GPXOverlay({ raceID, isOpen, onClose }: GPXOverlayProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Race Map">
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <GPXChunk gpxFile={getGPXFilePathFromRaceID(raceID)} inOverlay={true} />
            </div>
        </div>
    );
}

