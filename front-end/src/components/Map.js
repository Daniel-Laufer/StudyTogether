/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import PropTypes from 'prop-types';

const defaultMapStyles = {
  width: '100%',
  height: '100%',
  margin: 'auto',
};

// eslint-disable-next-line react/prop-types
function MapContainer({ google, initialCenter, zoom, style, parentOnClick }) {
  const [mapState, setMapState] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  });

  const onMarkerClick = (props, marker, e) => {
    setMapState({
      ...mapState,
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
    console.log(props);
  };

  const onClose = props => {
    if (mapState.showingInfoWindow) {
      setMapState({
        ...mapState,
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  return (
    <Map
      google={google}
      zoom={zoom}
      style={{ ...defaultMapStyles, ...style }}
      initialCenter={initialCenter}
      onClick={ev => {
        console.log(ev);
      }}
    >
      <Marker onClick={onMarkerClick} name="Heyo" />
      <InfoWindow
        marker={mapState.activeMarker}
        visible={mapState.showingInfoWindow}
        onClose={onClose}
      >
        <div>
          <h4>{mapState.selectedPlace.name}</h4>
        </div>
      </InfoWindow>
    </Map>
  );
}
MapContainer.propTypes = {
  initialCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  zoom: PropTypes.number,
  parentOnClick: PropTypes.isRequired,
};
MapContainer.defaultProps = {
  initialCenter: {
    lat: 43.54,
    lng: -79.66,
  },
  zoom: 17,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyD0UIR7Nc-oEEQ2ur9lY27J4Ewo4t1w0J0',
})(MapContainer);
