import React, { Component,useState, useEffect, } from 'react';
import { View, StyleSheet, Button, TextInput,TouchableHighlight, Text,Dimensions,SafeAreaView,Image,PermissionsAndroid,ImageBackground ,Modal,Pressable, Alert, ScrollView,} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {writeJsonFile} from 'write-json-file';
import { RadioButton } from 'react-native-paper';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import MapView, { PROVIDER_GOOGLE, Marker }  from 'react-native-maps';
import OpenLocationCode from './openlocationcode';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Geolocation from '@react-native-community/geolocation';
import { assertOptionalMemberExpression } from '@babel/types';
import {CurrentlocationOnce as _CurrentlocationOnce} from './getlocation.js';

//import  Data from './UserSave.json'
const {width, height} = Dimensions.get('window')
const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
var watchID;


//////////////////////////////////////////////////////////////////

const App = () => {
  
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Engedélykérés',
              message: 'Az app használatához szüksége a hely endgedély',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            //subscribeLocationLocation();
          } else {

          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  //////////     //////////     ////////////        
 
  const Stack = createNativeStackNavigator();
  return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen}  
        options={{ title: 'Koordináta kereső', headerStyle: { backgroundColor: '#0f5bf5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}, headerTitleAlign: 'center'}}
      /> 
      <Stack.Screen name="map" component={MAPSCREEN} 
        options={{ title: 'Térkép', headerStyle: { backgroundColor: '#0f5bf5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}, headerTitleAlign: 'center'}}
      />
      <Stack.Screen name="info" component={INFOSCREEN}  
        options={{ title: 'Rólam', headerStyle: { backgroundColor: '#0f5bf5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}, headerTitleAlign: 'center'}}
      />
       <Stack.Screen name="kereso" component={KERESO}  
        options={{ title: 'Koordináta keresés', headerStyle: { backgroundColor: '#0f5bf5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}, headerTitleAlign: 'center'}}
      />
       <Stack.Screen name="mentes" component={MENTES}  
        options={{ title: 'Mentett helyek', headerStyle: { backgroundColor: '#0f5bf5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}, headerTitleAlign: 'center'}}
      />
      
    </Stack.Navigator>
  </NavigationContainer>
      
  );
};
//////////////////////////////////////////////////////////////////////

function HomeScreen({ navigation }) {
  
  return (
    <View style={{ height: '100%' , alignItems: 'center', backgroundColor:'#17181a'}}>
      <View style={[{ width: "90%", margin: 10, alignItems:'center',marginTop:'40%', borderWidth:5,borderRadius:40,borderColor: '#0f5bf5',paddingBottom:30,backgroundColor:'#1d2436'}]}>
        <View style={{margin:20,flexDirection:"row"}}>
          <View >
            <Pressable style={{width: 110, height:110}} onPress={() => navigation.navigate('map',{
                lati: 0,
                longi: 0,
                uzenet:""
              })}>
              <Image style={{width:110, height:110}} source={require("./map.png")} />
              <Text style={{color: 'white',textAlign:'center',marginTop:10,fontSize:20}}>Térkép</Text>
              </Pressable>
            </View>
            <View style={{marginLeft:50,}}>
              <Pressable style={{width: 110, height:110,}} onPress={() => navigation.navigate('kereso')}>
                <Image style={{width:110, height:110}} source={require("./search.png")} />
                <Text style={{color: 'white',textAlign:'center',marginTop:10,fontSize:20}}>Keresés</Text>
            </Pressable>
          </View>
        </View>
        <View style={{margin:20,flexDirection:"row",marginTop:50}}>
          <View>
            <Pressable style={{width: 125, height:125}} onPress={() => navigation.navigate('info')}>
            <Image style={{width:125, height:125}} source={require("./info.png")} />
            <Text style={{color: 'white',textAlign:'center',marginTop:10,fontSize:20}}>Info</Text>
            </Pressable>
          </View>
          <View style={{marginLeft:50,}}>
            <Pressable style={{width: 120, height:120}} onPress={() => navigation.navigate('mentes',{ be: "", nev:"" ,muvelet:"" })}>
            <Image style={{width:120, height:120}} source={require("./save.png")} />
            <Text style={{color: 'white',textAlign:'center',marginTop:10,fontSize:20}}>Mentett helyek</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

  function KERESO({ navigation }) {
    let [checked, setChecked] = React.useState('first');
   // let [modalVisible, setModalVisible] = React.useState(false);
   // let [bejovo, setbejovo] = React.useState("");
   let [nev, nevchange] = React.useState("");
    function _plusatvalt(be)
    {
        if (be!="")
        {
          let fgeds=  _decode(be);
          if(fgeds==1)
          {
            return (
              <View style={{paddingTop:'20%'}} >
                <Text style ={{fontSize:20, color:'red',marginLeft:"25%",width:"100%"}}>A "{be}" hibás bemenő adat</Text>
              </View>
            )
          }
          else{
            return (
              <View style={{paddingTop:'20%'}}>
                <Text selectable={true} style ={{fontSize:20, color:'white',marginLeft:"5%",width:"180%",paddingBottom:10}}>Szélesség: {fgeds.PLUSlati}</Text>
                <Text selectable={true} style ={{fontSize:20, color:'white',marginLeft:"5%",width:"180%",paddingBottom:40}}>Hosszúság: {fgeds.PLUSlongi}</Text>
                <Pressable style ={{borderRadius: 20,padding: 10, elevation: 2,backgroundColor:"#3749ed",marginLeft:70,width:200}}  onPress={() => navigation.navigate('map',{ lati:fgeds.PLUSlati,longi:fgeds.PLUSlongi })}>
                  <Text style ={{fontSize:20, color:'white',textAlign:'center'}}>Térképre</Text>
                </Pressable>
                <TextInput
                      style={{height:60, borderWidth: 1,textAlign:'center',width:"100%",marginLeft:"20%",backgroundColor:'#17181a',borderColor:"#9cb0e6",fontSize:30}}
                      onChangeText={nevchange}
                      value={nev}
                      placeholder=""
                    />
                <Pressable style ={{borderRadius: 20,padding: 10, elevation: 2,backgroundColor:"#3749ed",marginLeft:70,width:200}}  onPress={() => navigation.navigate('mentes',{ be: be, nev:nev ,muvelet:"mentes" })}>
                  <Text style ={{fontSize:20, color:'white',textAlign:'center'}}>Mentés</Text>
                </Pressable>
               
              </View>
            )
          }
        }
    }
  /*  {_modalmegjelenit(bejovo) } function _modalengedelyezes(be1){
      setbejovo(be1);
      console.log
      setModalVisible(true);
    }
    function _modalmegjelenit(bejovo)
    {
      if(bejovo!=""){
        
        return (
              <Modal animationType="fade" transparent={true}visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible); }} >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Név: </Text>
                    <TextInput
                      style={{height:60, borderWidth: 1,textAlign:'center',width:"100%",marginLeft:"20%",backgroundColor:'#17181a',borderColor:"#9cb0e6",fontSize:30}}
                      onChangeText={nevchange}
                      value={nev}
                      placeholder=""
                    />
                    <View style={{paddingBottom:10}}>
                      
                    </View>
                    <View >
                      <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Mégse</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
              )
        }
  } 
*/


    function _koordinatavaltas(be1,be2)
    {
      if (be1>85||be1<-85||be2>180||be2<-180)
      {
        return (
          <View style={{paddingTop:'20%'}} >
            <Text style ={{fontSize:20, color:'red',marginLeft:"15%",width:"170%"}}>Az "{be1}" és a "{be2}" hibás bemenő adatok</Text>
          </View>
        )
      }else{
        if (be1!=0&&be2!=0)
        {
          let fgeds=  _encode(be1,be2);
          if(fgeds==1)
          {
            return (
              <View style={{paddingTop:'20%'}} >
                <Text style ={{fontSize:20, color:'red',marginLeft:"25%",width:"100%"}}>Az "{be1}", "{be2}" hibás bemenő adatok</Text>
              </View>
            )
          }
          else{
            return (
              <View style={{paddingTop:'20%'}}>
                <Text selectable={true} style ={{fontSize:20, color:'white',marginLeft:"5%",width:"180%",paddingBottom:40}}>Plus kód: {fgeds}</Text>
                <Pressable style ={{borderRadius: 20,padding: 10, elevation: 2,backgroundColor:"#3749ed",marginLeft:70,width:200}}  onPress={() => navigation.navigate('map',{ lati:be1,longi:be2  })}>
                  <Text style ={{fontSize:20, color:'white',textAlign:'center'}}>Térképre</Text>
                </Pressable>
              </View>
            )
          }
        }
      }
    }

    function _submit(){
      
      let [Xkoordinata, Xkoordinatachange] = React.useState("");
      let [Ykoordinata, YkoordinataChange] = React.useState("");
      let [PlusText, PlusChange] = React.useState("");
  
      if(checked=='first')
      {
        return (
          <View style={{}}>
            <View style={{}}>
              <TextInput
                autoCapitalize='characters'
                style={{height:60, borderWidth: 1,textAlign:'center',width:"100%",marginLeft:"20%",backgroundColor:'#17181a',borderColor:"#9cb0e6",fontSize:30}}
                onChangeText={PlusChange}
                value={PlusText}
                placeholder="teljes PLUS code"
              />
            </View>
            <View style={{}} >
              {_plusatvalt(PlusText)}
              </View>
          </View>
        )
      }else{
        return (
          <View style={{ width: '70%',}}>
              <View style={{ flexDirection:"row" }}>
                <TextInput
                  style={{height: 40, borderWidth: 1,textAlign:'center',width:"80%",marginLeft:"10%",backgroundColor:'#17181a',borderColor:"#9cb0e6",fontSize:20}}
                  onChangeText={Xkoordinatachange}
                  value={Xkoordinata}
                  placeholder="Magasság"
                  keyboardType="numeric"
                  />
                  <TextInput
                  style={{height: 40, borderWidth: 1,textAlign:'center',width:"80%",marginLeft:"20%",backgroundColor:'#17181a',borderColor:"#9cb0e6",fontSize:20}}
                  onChangeText={YkoordinataChange}
                  value={Ykoordinata}
                  placeholder="Szélesség"
                  keyboardType="numeric"
                  />
              </View>
              {_koordinatavaltas(Xkoordinata,Ykoordinata)}
            </View>
        )
      }
    }
    return (
     
      <View style={{ height:"100%", width:"100%",  alignItems: 'center', backgroundColor:'#17181a',paddingTop:20}}>
          <View style={[{ width: "90%", margin: 10,paddingBottom:30,borderStyle:'solid', borderColor: '#0f5bf5', borderWidth:5,borderRadius:40,backgroundColor:'#1d2436'}]}>
            <ScrollView>
              <View style={[{ width: "70%", paddingLeft:10,paddingTop:20}]} >
                <View  style={{ flexDirection:"row" ,paddingBottom:50}}>
                    <Pressable  onPress={() => setChecked('first')}>
                      <View style={{ flexDirection:"row", paddingLeft:10, left:"5%", }}>
                        <RadioButton
                          color='#0f5bf5'
                          value="first"
                          status={ checked === 'first' ? 'checked' : 'unchecked' }
                          onPress={() => setChecked('first')}
                        />
                        <Text style={{fontSize:20,paddingTop:5,color:'white'}}>Plus kód</Text>
                      </View>
                    </Pressable>
                    <Pressable  onPress={() => setChecked('second') } style={{paddingLeft:70}}>
                      <View style={{ flexDirection:"row",}}>
                        <RadioButton
                          color='#0f5bf5'
                          value="second"
                          status={ checked === 'second' ? 'checked' : 'unchecked' }
                          onPress={() => setChecked('second') }
                        />
                        <Text style={{fontSize:20,paddingTop:5,color:'white'}}>Koordináta</Text>
                      </View>
                    </Pressable>
                  </View>
                  <View style={{}} >
                  {_submit()}
                  </View>
              </View>
            </ScrollView>
          </View>
      </View>
    );
  }

  function MENTES({ navigation,route }) {
    const { be, nev,muvelet } = route.params;
    var RNFS = require('react-native-fs');
    var filePath = RNFS.DocumentDirectoryPath + '/save.json';
    

    if(muvelet=="mentes")
    {
      RNFS.writeFile(filePath, be+";"+nev+" ", 'utf8')
        .then((success) => {
          console.log('SUCCESS');
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    
     function _beolvas()
    {
        RNFS.readFile(filePath,  'utf8')
        .then((success) => {
          console.log(success);
          var a=[success.split(" ")];
          for(var i=0;i<a.length;i++) 
          {
            var b=[a[i].toString().split(";")];
            console.log(b[0][0]);
            return (<View><Text style={{color:'black'}}>Hello2,{b[i][0]},{b[i][1]}</Text> </View>)
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
        
    }

   

    return(
      <View >
        <Text style={{color:'black'}}>Hello1</Text>
        {_beolvas()}
        <Text style={{color:'black'}}>Hello3</Text>
      </View>
    );
  }




function INFOSCREEN({ navigation }) {
  return (
    
    <View style={{height:"100%",width:"100%"}}>
       <ImageBackground source={require('./kikilogo.jpg')} resizeMode="cover" style={{ flex: 1, justifyContent: "center"}}>
          <Text style={{fontSize:20,top:"-45%",left:"5%",color:'white'}}>Készítő: R.KiKi</Text>
       </ImageBackground>
      
    </View>
  );
}
function MAPSCREEN({ navigation,route }) {
  const { longi, lati,uzenet } = route.params;
  let [key, setkey] = React.useState(0);
  forceRemount  = () => {
   setkey(({ key }) => ({
     key: key + 1
   }));
 }

  if(Platform.OS === 'android')
  {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({ 
      message: "<h2>Helymeghatározás szükséges</h2> \
          <h4>Bekapcsolja a GPS-t?</h4><br/>", 
                ok: "Igen", 
                cancel: "Nem" 
            }).catch().then()
  }    
  let fgeds=  _CurrentlocationOnce();
  let [modalVisible, setModalVisible] = React.useState(false);
  var [bejovo, setbejovo] = React.useState({latitude:0,longitude:0});
  var kezdolongi=0;
  var kezdolati=0;
  var kezdomagassag1=0;
  var kezdomagassag2=0;
  console.log("GPS1 "+fgeds.lati+"  GPS2 "+fgeds.longi +" bejovo1:"+lati+" bejovo2:"+longi);
  if (fgeds.lati>0&&fgeds.longi>0) {
    if (longi==0&&lati==0)
    {
      kezdolati=fgeds.lati;
      kezdolongi=fgeds.longi;
      kezdomagassag1=0.0055
      kezdomagassag2=0.0055
    }
    else{
      kezdolati=(fgeds.lati+lati)/2;
      kezdolongi=(fgeds.longi+longi)/2;
      kezdomagassag1=((Math.sqrt(3)/2)*kezdolongi)*1;
      kezdomagassag2=((Math.sqrt(3)/2)*kezdolati)*1;
    }
  return (
      <View key={key}>
       {_modalmegjelenit(bejovo) }
        <View>
          <MapView
          userInterfaceStyle={'dark'}
          showsCompass={true}
          loadingEnabled={true}
          loadingIndicatorColor={'#6181c2'}
          zoomControlEnabled={true}
          userLocationUpdateInterval={1000}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={{
            latitude: kezdolati,
            longitude: kezdolongi,
            latitudeDelta: kezdomagassag1,
            longitudeDelta: kezdomagassag2,
          }}
          onLongPress={ (event) =>_modalengedelyezes(event.nativeEvent.coordinate) }>
           {_helypin()}
          </MapView>
        </View>
      </View>
      
  );
} 
else {
  return (
    <View style={{backgroundColor: '#17181a',height:SCREEN_HEIGHT,alignItems:'center',paddingVertical:"50%"}} >
       <Image style={styles.image} source={require('./nogps.png')}/>
       <Text style={{color:'red', fontSize:30,paddingTop:20}}>Nincs GPS jel</Text>
       <View >
        <Button title="Frisstés" onPress={() => forceRemount()} />
      </View>
     </View>
     
 );
}
function _helypin()
{ 
  if(longi!=0&&lati!=0)
  {
  return(
    <Marker 
            coordinate={{latitude: lati,longitude:longi,}}
            title=""
            description={uzenet}
          />
  );
  }
}
function _modalengedelyezes(be){
  setbejovo(be);
  setModalVisible(true);
}
  function _modalmegjelenit(be)
  {
    if(be!="")
    {
    return (
          <Modal animationType="fade" transparent={true}visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible); }} >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Szélesség: {be.latitude}</Text>
                <Text style={styles.modalText}>Hosszúság: {be.longitude}</Text>
                <View style={{paddingBottom:10}}>
                  <Pressable style={[styles.button,styles.buttonOpen]}>
                      <Text style={styles.textStyle}>Koordináta mentése</Text>
                    </Pressable>
                </View>
                <View >
                  <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Mégse</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          )
    }
  } 
}

function _decode(longcode)
{
  var PLUSlati=0.00;
  var PLUSlongi=0.00;

  try {
  var coord = OpenLocationCode.decode(longcode);
  PLUSlati=coord.latitudeCenter;
  PLUSlongi=coord.longitudeCenter;
  return {PLUSlati, PLUSlongi};
  } catch (IllegalArgumentException) {
    return 1;
    //alert("This isn't a valid code")
  }
  
}

function _encode(lat,longi)
{
  try {
    var code = OpenLocationCode.encode(lat, longi);
    return code;
  } catch (IllegalArgumentException) {
    return 1;
    //alert("This isn't a valid code")
  }
  
}


const styles = StyleSheet.create({
  image: {
    width: 200, height: 200
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    
    top:"0%",
    width: "100%",
    height:"100%",
   justifyContent: 'flex-end',
   alignItems: 'center',
   },
   centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#399c2a",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "black"
  }
});

export default App;
{ /*
function decode(longcode)
{
  var PLUSlati=0.00;
  var PLUSlongi=0.00;

  try {
  var coord = OpenLocationCode.decode(longcode);
  PLUSlati=coord.latitudeCenter;
  PLUSlongi=coord.longitudeCenter;
  return PLUSlati, PLUSlongi;
  } catch (IllegalArgumentException) {
    alert("This isn't a valid code")
  }
  
}

function encode(lat,longi)
{
  try {
    var code = OpenLocationCode.encode(lat, longi);
    return code;
  } catch (IllegalArgumentException) {
    alert("This isn't a valid code")
  }
  
}


var je=0.00;
var je2=0.00;
const alma =  (igen) => {
  try {
   const response =  fetch('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDpDV0WBthRGkYcgVc8BxbsbxYFdJLyZ-A');
   const json =  response.data.json();
   je=json.location.lat;
   je2=json.location.lng;
 } catch (error) {
   alert(error);
 } 
}
 constructor(props) {
    super(props);
    this.state1 = { text: '' };
    this.state2 = {
      updatesEnabled: false,
      location: {},
      modalCategoryVisible: false,
      markers: []
  }
  }
  submit(){
    this.setState({
      markers: [
          {
              merchant_name: "Zaky",
              merchant_type: "Sate",
              merchant_info: "Selling Sate that is tasty",
              merchant_phone: "0812909281234",
              location: {
                  latitude: -6.667772,
                  longitude: 106.723630,
              }
          },
      ]
  })  
  }
  renderMarkers() {
    return this.state2.markers.map((markerek) => {
      return (
        <Marker 
              title={markerek.merchant_name}
              coordinate={{
                latitude: markerek.location.latitude, 
                longitude: markerek.location.longitude,
              }}
              anchor={{ x: 0.69, y: 1 }} />
      )
    })
}


const Stack = createNativeStackNavigator();
function App() {
  
 
 
   
    return (
      <NavigationContainer>
       <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}  
          options={{ title: 'Koordináta kereső', headerStyle: { backgroundColor: '#0f5bf5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}, headerTitleAlign: 'center'}}
        />
        <Stack.Screen name="map" component={MAPSCREEN}  
          options={{ title: 'Térkép', headerStyle: { backgroundColor: '#0f5bf5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}, headerTitleAlign: 'center'}}
        />
        <Stack.Screen name="info" component={INFOSCREEN}  
          options={{ title: 'Rólunk', headerStyle: { backgroundColor: '#0f5bf5' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold'}, headerTitleAlign: 'center'}}
        />
      </Stack.Navigator>
    </NavigationContainer>

     
    );
  }


export default App;


const styles = StyleSheet.create({
  container: {
    top: "1%", 
    backgroundColor:'red'
  },
  map: {
   // ...StyleSheet.absoluteFillObject,
   top: "10%", 
   bottom:1,
   width: "100%",
   height:"90%",
  justifyContent: 'flex-end',
  alignItems: 'center',
  }
});


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor:'#17181a'}}>
      <Text style={{color:'#fff'}}>Home Screen</Text>
      <View style={[{ width: "90%", margin: 10, backgroundColor: '#6181c2' }]}>
        <Button title="Go to Details"  onPress={() => navigation.navigate('map')} color='#6181c2'/>
      </View>

    </View>
  );
}
function INFOSCREEN({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor:'#17181a'}}>
      <Text style={{color:'#fff'}}>Home Screen</Text>

    </View>
  );
}
function MAPSCREEN({ navigation }) {
  return (
     <View >
        <View>
        <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState.bind(this)({text})}
        value={this.state1.text}
        placeholder="PLUS code"
      />
      <Button title="Küld" onPress={this.submit.bind(this)}></Button>

        </View>
          <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={{
            latitude: (-6.174969),
            longitude: (106.827202),
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}>
          </MapView>
      </View>
      
  );
}
*/}