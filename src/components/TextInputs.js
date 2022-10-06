import React from 'react';
import { View , StyleSheet, TouchableWithoutFeedback,TextInput } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default function TextInputs(props){
    const styles  = StyleSheet.create({
        input:{
            backgroundColor:'#ececec',
            width : wp('75'),
            borderColor : '#ececec',
            borderRadius : 30,
            fontFamily:'Poppins-SemiBold',
        },
        input1:{
            backgroundColor:'#ececec',
            width : wp('75'),
            borderColor : '#ececec',
            borderRadius : 20,
            fontFamily:'Poppins-SemiBold',
        },
        inputContainer:{
            backgroundColor:'#ececec',
            borderRadius : 30,
            paddingLeft : wp('5'),
            margin : '0.4%'
        }
    })
   
    return(
        <View style={styles.inputContainer}>
           {
             props.multiline?
                <TextInput
                    placeholder={props.placeholder}
                    style={styles.input1}
                    multiline = {true}
                    numberOfLines={5}
                    
                /> : 
                <TextInput
                    placeholder={props.placeholder}
                    style={styles.input}
                
            />
           } 
           
        </View>
       
    ) 
}