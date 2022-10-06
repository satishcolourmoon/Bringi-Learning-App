import React from 'react';
import { View , Text , TouchableWithoutFeedback , Image , StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default function Footer(){
    return(
        <View style={styles.bottomCurve}>
            <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
        </View>
    )
}
const styles = StyleSheet.create({
    bottomCurve : {
        flex : 0.1,
        justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('12')
    },
})