/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
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
  zoom,
  style,
  restrictToOneMarker,
  getLngLatOfNewMarker,
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD0UIR7Nc-oEEQ2ur9lY27J4Ewo4t1w0J0',
  });

  const [map, setMap] = React.useState(null);
  const [markers, setMarkers] = React.useState([
    {
      lat: 43.54904,
      lng: -79.662116,
    },
  ]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const addMarker = ev => {
    if (restrictToOneMarker) {
      setMarkers([{ lat: ev.latLng.lat(), lng: ev.latLng.lng() }]);
    } else
      setMarkers([...markers, { lat: ev.latLng.lat(), lng: ev.latLng.lng() }]);

    getLngLatOfNewMarker(ev.latLng.lat(), ev.latLng.lng());
  };

  return isLoaded ? (
    <GoogleMap
      center={{
        lat: 43.54,
        lng: -79.66,
      }}
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={addMarker}
      zoom={16}
      style={{ ...defaultMapStyles, ...style }}
    >
      {markers.map(marker => (
        <Marker
          key={`${marker.lat}-${marker.lng}`}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelected(marker);
          }}
        />
      ))}
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
  zoom: PropTypes.number,
  restrictToOneMarker: PropTypes.bool,
  getLngLatOfNewMarker: PropTypes.func,
};
Map.defaultProps = {
  initialCenter: {
    lat: 43.54,
    lng: -79.66,
  },
  zoom: 20,
  restrictToOneMarker: false,
  getLngLatOfNewMarker: () => {},
};

export default React.memo(Map);
