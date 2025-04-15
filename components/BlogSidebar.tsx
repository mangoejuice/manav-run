import { GPXChunk } from "./GPXChunk";
import items from '../pages/race_registry';

function getGPXFilePathFromRaceID(raceID) {
    const gpxFile = items[0].links.find(
        link => link.id === raceID
    ).gpxFile
    return '/gpx-files/' + gpxFile
}

export function BlogSidebar(props) {
    const { raceID } = props;
    return (
        // TODO: some styling
        <>
            <GPXChunk gpxFile={getGPXFilePathFromRaceID(raceID)} />
        </>
    )
}
