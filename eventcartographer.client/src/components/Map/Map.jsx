import React from "react";
import "./.css";
import PropTypes from "prop-types";
import { MapContainer, TileLayer } from "react-leaflet";
import MapEventHandler from "../MapEventHandler/MapEventHandler";

const Map = React.memo(React.forwardRef(({
    load,
    click,
    moveend,
    renderMarkers
}, ref) => {
    const [theme] = React.useState(localStorage.getItem('theme') ??
        window.matchMedia("(prefers-color-scheme: light)").matches ? 'light' : 'dark');

    return (
        <div className={`map_container ${theme}`}>
            <MapContainer className="map"
                center={[50.4, 30.5]}
                zoom={12}
                ref={ref}>
                <TileLayer className="map_tile_layer"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEventHandler
                    load={load}
                    click={click}
                    moveend={moveend} />
                {renderMarkers()}
            </MapContainer>
        </div>
    );
}));

Map.propTypes = {
    renderMarkers: PropTypes.func.isRequired,
    load: PropTypes.func,
    click: PropTypes.func,
    moveend: PropTypes.func
};

export default Map;
