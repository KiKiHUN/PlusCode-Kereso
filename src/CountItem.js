import React,{ Component } from "react";
import { StyleSheet, Button, View, Text, Alert,SafeAreaView,  TextInput, ScrollView, Image,TouchableOpacity } from 'react-native';

const CountItem=(props)=>
(
    <View style={styles.container}> 

        <Text style={styles.JSTitleText}>
            {props.JSTitleText}
        </Text>
        <Text style={styles.JSbodyText}>
            {props.JSbodyText}
        </Text>
        <Button  title={props.JSgombText} color='blue' onPress={()=>Alert.alert("Szöveg hossza: "+props.JSbodyText.length)} >
        </Button>
            
    </View>
);


const styles = StyleSheet.create(
    {
      container:
      {
        padding:15,
      },
     
      
      JSTitleText:
      {
        color:"#475dff",
        textAlign:"center",
        fontSize:20,
        fontWeight:"bold",
        paddingTop:10,
      },
    
     
      JSbodyText:
      {
        color:"#b3e0ff",
        fontSize:18,
        paddingTop:10,
        textAlign:"justify",
      },
    
    });
    export default CountItem;