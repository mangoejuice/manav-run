import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./DynamicMap'), {
    ssr: false
});

const DEFAULT_CENTER = [38.907132, -77.036546]

export function GPXChunk(props) {
    return (
        <DynamicMap center={DEFAULT_CENTER} zoom={12} {...props}>
            {({ TileLayer }) => (
                <>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>"
                    />
                </>
            )}
        </DynamicMap>
    )
}
