/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import PropTypes from 'prop-types';

// a lot of this code was taken from https://www.npmjs.com/package/@react-google-maps/api (the starter code provided in the documentation)

const containerStyle = {
  height: '400px',
};

const defaultMapStyles = {
  width: '100%',
  height: '100%',
  margin: 'auto',
};

const center = {
  lat: 43.54904,
  lng: -79.662116,
};
function Map({
  initialCenter,
  initialZoom,
  style,
  restrictToOneMarker,
  getLngLatOfNewMarker,
  disableAddingNewMarkers,
  markers: markerLocations,
  markerOnClickFunc,
  infoWindowOpenOnCenter,
  disableInfoWindows,
  currentlySelectedGroup,
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD0UIR7Nc-oEEQ2ur9lY27J4Ewo4t1w0J0',
  });

  const [map, setMap] = React.useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = React.useState(true);
  const [markers, setMarkers] = React.useState(markerLocations);

  useEffect(() => {
    if (
      markerLocations &&
      JSON.stringify(markers) !== JSON.stringify(markerLocations)
    )
      setMarkers(markerLocations);
  }, [markerLocations]);

  const addMarker = ev => {
    if (disableAddingNewMarkers) return;
    if (restrictToOneMarker) {
      setMarkers([{ lat: ev.latLng.lat(), lng: ev.latLng.lng() }]);
    } else
      setMarkers([...markers, { lat: ev.latLng.lat(), lng: ev.latLng.lng() }]);

    getLngLatOfNewMarker(ev.latLng.lat(), ev.latLng.lng());
  };

  return isLoaded ? (
    <GoogleMap
      center={initialCenter}
      mapContainerStyle={containerStyle}
      onClick={addMarker}
      zoom={initialZoom}
      style={{ ...style }}
    >
      {markers
        ? markers.map(marker => (
            <Marker
              onClick={() => markerOnClickFunc(marker.id)}
              key={`${marker.lat}-${marker.lng}-${marker.id}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                scaledSize: new window.google.maps.Size(600, 40),
              }}
            />
          ))
        : null}
      {currentlySelectedGroup ? (
        <InfoWindow
          position={initialCenter}
          onCloseClick={() => {
            setSelected(null);
          }}
        >
          <div>
            <h2>CSC301 Study Group</h2>
            {/* <p>Spotted {formatRelative(selected.time, new Date())}</p> */}
          </div>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  ) : (
    <></>
  );
}

Map.propTypes = {
  initialCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  currentlySelectedGroup: PropTypes.shape(),
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
      id: PropTypes.string,
      metaData: PropTypes.shape(),
    })
  ),
  initialZoom: PropTypes.number,
  restrictToOneMarker: PropTypes.bool,
  getLngLatOfNewMarker: PropTypes.func,
  disableAddingNewMarkers: PropTypes.bool,
  markerOnClickFunc: PropTypes.func,
  disableInfoWindows: PropTypes.bool,
};
Map.defaultProps = {
  initialCenter: {
    lat: 43.54,
    lng: -79.66,
  },
  markerOnClickFunc: () => null,
  markers: [],
  initialZoom: 14,
  restrictToOneMarker: false,
  getLngLatOfNewMarker: () => {},
  disableAddingNewMarkers: false,
  disableInfoWindows: false,
  currentlySelectedGroup: null,
};

export default React.memo(Map);
