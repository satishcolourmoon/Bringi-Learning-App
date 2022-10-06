import React from 'react';
import { View , Text , StyleSheet, TouchableWithoutFeedback , ActivityIndicator } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default function Button(props){
    const styles  = StyleSheet.create({
        buttonContainer1 : {
            justifyContent : 'center',
            alignItems : 'center',
            backgroundColor : props.backgroundColor,
            padding :  '2%',
            width : wp('80'),
            margin : '0.8%',
            borderRadius : 30,
            borderColor : props.borderColor,
            borderWidth : props.borderWidth
        },
        bText1 : {
            fontFamily : 'Poppins-Regular', 
            fontSize : 16,
            color : props.buttonTextColor
        }
    })
    return(
        <TouchableWithoutFeedback onPress={ !props.loader ? props.onPress : ''}>
            <View style={styles.buttonContainer1}>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.bText1}>{props.text}</Text>{
                        props.loader && <View style={{marginLeft : 5}}><ActivityIndicator color="#fff" /></View>
                    }
                </View>
               
            </View>
        </TouchableWithoutFeedback>
    )
}