import { GPXChunk } from "./race_components/GPXChunk";
import items from '../race_registry';

function getGPXFilePathFromRaceID(raceID) {
    const gpxFile = items[0].links.find(
        link => link.id === raceID
    ).gpxfile
    return '/gpx-files/' + gpxFile
}

export function BlogSidebar(props) {
    const { raceID } = props;
    return (
        <GPXChunk gpxFile={getGPXFilePathFromRaceID(raceID)} />
    )
}
