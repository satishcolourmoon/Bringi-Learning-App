import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text,ActivityIndicator} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default class SplashScreen extends React.Component{
   render(){
        return(
            <View style={styles.container}>
                <StatusBar hidden />
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/splash1.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                   <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
                </View>
                <View style={{marginTop:hp('15'),alignItems:'center'}}>
                    <Image source={require('../../assets/splash3.png')} resizeMode="stretch" style={styles.logo} />
                    <View style={styles.row}>
                         <Text style={styles.loading}>Loading </Text>
                         <ActivityIndicator size="small" color="black" />
                    </View>
                    
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/splash2.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                </View>
            </View>
        )
    }
}
const styles =  StyleSheet.create({
    container:{
        flex : 1,
        backgroundColor : '#ffffff'
    },
    topCurveImageContainer : {
        alignItems : 'flex-end'
    },
    topCurveImage : {
        width : wp('100'),
        height : hp('47')
    },
    bottomCurve : {
        flex : 1,
        justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : 100
    },
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : '4%'
    },
    backMainContainer : {
        position : 'absolute',
        top : 30,
        left : 10
    },
    backContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        elevation : 5,
        backgroundColor : '#eeeeee',
        borderRadius : 8
    },
    backIcon : {
        width : 55,
        height : 55
    },
    successImage : {
        width : 150,
        height : 150
    },
    successText : {
        fontFamily : 'Poppins-Regular',
        marginTop : '2%'
    },
    successId : {
        fontFamily : 'Poppins-SemiBold',
        marginTop : '1%',
        fontSize : 17
    },
    logo : {
        width : 100,
        height : 100
    },
    loading : {
        fontFamily : 'Poppins-Regular',
        textAlign : 'center',
        fontSize : 15,
        paddingLeft : '3.5%'
    },
    logoImage : {
        width : 183,
        height : 50
    },
    row : {
        flexDirection : 'row'
    }
})