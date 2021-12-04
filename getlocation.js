import Geolocation from '@react-native-community/geolocation';
import React, { Component,useState } from 'react';



export function CurrentlocationOnce() {
  const [longi, setState1] = useState(0);
  const [lati, setState2] = useState(0);
  
     let xy=   Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
          //getting the Longitude from the location json
          var longitude = 0;
          longitude=  position.coords.longitude;
          setState1(longitude);
          
          //getting the Latitude from the location json
          var latitude =0; 
          latitude= position.coords.latitude;
          setState2(latitude);
         

        },
        (error) => {
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 1000
        },
      );
      return{longi,lati} 
     
  }
  
   ///////////////////////////////////////////////////////////////////
  
  export function CurrentlocationUpdate()
  {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change
        
        console.log(position);
  
        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);
  
        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);
        return[currentLongitude,currentLatitude];
      },
      (error) => {
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  }