import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

import MapView, {
     Polyline, PROVIDER_GOOGLE, Marker, AnimatedRegion 
} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import Geolocation from '@react-native-community/geolocation';


const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

class NTMapView extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            coordinate: new AnimatedRegion({
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: 0,
              longitudeDelta: 0
            })
        };

        if (props.onRef) {
            props.onRef(this)
        }
        this.mapView = null;
        this.markers = []
    }

    render() {
        return (
          <View style={styles.container}>
            <MapView
              style={styles.map}
              showUserLocation
              followUserLocation
              loadingEnabled
              region={this.getMapRegion()}
            >
              <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
              <Marker.Animated
                ref={marker => {
                  this.marker = marker;
                }}
                coordinate={this.state.coordinate}
              />
            </MapView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.bubble, styles.button]}>
                <Text style={styles.bottomBarContent}>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
    
    

    componentDidMount() {

        const { coordinate } = this.state;
        Geolocation.getCurrentPosition(info => console.log("Location:"+ info));

        Geolocation.watchPosition( position => {
          const { routeCoordinates } = this.state;
          const { latitude, longitude } = position.coords;
  
          const newCoordinate = {
            latitude,
            longitude
          };
  
          if (Platform.OS === "android") {
            if (this.marker) {
              this.marker._component.animateMarkerToCoordinate(
                newCoordinate,
                500
              );
            }
          } else {
            coordinate.timing(newCoordinate).start();
          }
  
          this.setState({
            latitude,
            longitude,
            routeCoordinates: routeCoordinates.concat([newCoordinate]),
            prevLatLng: newCoordinate
          });
        },
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10
        } 

        )
    
      }

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
}


const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-end",
      alignItems: "center"
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    bubble: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.7)",
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20
    },
    latlng: {
      width: 200,
      alignItems: "stretch"
    },
    button: {
      width: 80,
      paddingHorizontal: 12,
      alignItems: "center",
      marginHorizontal: 10
    },
    buttonContainer: {
      flexDirection: "row",
      marginVertical: 20,
      backgroundColor: "transparent"
    }
  });

export default NTMapView
