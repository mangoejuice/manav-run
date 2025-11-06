import { GPXChunk } from "./race_components/GPXChunk";
import items from '../race_registry';

function getGPXFilePathFromRaceID(raceID) {
    for (const item of items) {
        const link = item.links.find(link => link.id === raceID);
        if (link) {
            return '/gpx-files/' + link.gpxfile;
        }
    }
    return null;
}

export function BlogSidebar(props) {
    const { raceID } = props;
    return (
        <GPXChunk gpxFile={getGPXFilePathFromRaceID(raceID)} />
    )
}
