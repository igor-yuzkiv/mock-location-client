import React from 'react';
import MapView from '../shared/components/map-view/MapView.tsx';
import { GOOGLE_MAP_API_KEY, HOME_COORDINATES } from '../shared/constants/GoogleMapTypes.ts';
import { Wrapper } from '@googlemaps/react-wrapper';
import { DrawingManager } from '../shared/components/drawing-manager/DrawingManager.tsx';
import { Flyout } from '../shared/components/flyout/Flyout.tsx';
import { WaypointsList } from '../features/waypoints-list/WaypointsList.tsx';
import { useWaypointsList } from '../features/waypoints-list/useWaypointsList.ts';
import { Button } from '@mui/material';
import { useRouteBuilder } from '../features/route-builder/useRouteBuilder.ts';
import { useRouteEmulator } from '../features/route-emulator/useRouteEmulator.ts';
import GeoUtil from '../shared/utils/GeoUtil.ts';

export default function HomePage() {
    const [mapOptions] = React.useState<google.maps.MapOptions>({
        center: HOME_COORDINATES,
        zoom: 15,
        tilt: 0,
    });
    const [mapObject, setMapObject] = React.useState<google.maps.Map | null>(null);
    const { waypoints, addWaypoint, removeWaypoint } = useWaypointsList();
    const { buildRoute, directionsResult } = useRouteBuilder();
    const { playRoute } = useRouteEmulator();

    function onDrawMangerMarkerComplete(marker: google.maps.Marker) {
        marker && addWaypoint(marker);
    }

    function onClickCalculateRoute() {
        buildRoute([...waypoints], mapObject);
    }

    function onClickPlay() {
        if (!directionsResult) {
            return;
        }
        playRoute(directionsResult.routes[0]);
    }

    return (
        <Wrapper apiKey={GOOGLE_MAP_API_KEY}>
            <div className="flex flex-col w-full h-full">
                <MapView mapOptions={mapOptions} onMapReady={(map) => setMapObject(map)}>
                    <DrawingManager onMarkerComplete={onDrawMangerMarkerComplete} />
                </MapView>
                <Flyout title={'Waypoints'}>
                    <div className="flex items-center gap-x-2 p-1 border-b border-gray-500">
                        <Button onClick={onClickCalculateRoute} variant="outlined">
                            Calculate Route
                        </Button>

                        <Button onClick={onClickPlay} variant="outlined">
                            Play
                        </Button>
                    </div>
                    <WaypointsList items={waypoints} onDelete={removeWaypoint} />
                </Flyout>
            </div>
        </Wrapper>
    );
}
