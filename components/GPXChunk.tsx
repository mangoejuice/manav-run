import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./DynamicMap'), {
    ssr: false
});

const GPXTrack = dynamic(() => import('./GPXTrack'), {
    ssr: false
});

const DEFAULT_CENTER = [40.713733719308536, -73.9719296162436]

export function GPXChunk(props) {
    return (
        <DynamicMap center={DEFAULT_CENTER} zoom={12} {...props}>
            {({ TileLayer }) => (
                <>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>"
                    />
                    <GPXTrack gpxFile='/gpx-files/United_Airlines_NYC_Half.gpx' />
                </>
            )}
        </DynamicMap>
    )
}
