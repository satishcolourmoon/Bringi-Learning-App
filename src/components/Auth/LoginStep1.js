import React from 'react';
import { View , Text , StyleSheet , StatusBar , Image , TouchableWithoutFeedback} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Button from '../Button';
import Loader from '../../common/Loader';
export default class LoginStep1 extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true
        }
    }
    goToLoginStep2 = () => {
        this.props.navigation.navigate('LoginStep2');
    }
    goToLogin = () => {
        this.props.navigation.navigate('Login');
    }
    componentDidMount(){
        setTimeout(()=>{this.setState({loader:false})},600)
    }
    render(){
        if(this.state.loader){
            return(
                <Loader />
            )
        }
        return(
            <View style={styles.container}>
                <StatusBar hidden />
                <View style={styles.topCurve}>
                    <Image source={require('../../../assets/tcurve.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/logo.png')}  style={styles.logoImage} resizeMode="contain"/>
                </View>
                <View style={styles.secondContainer}>
                    <Text style={styles.heading}>Lets start Learning</Text>
                    <Button onPress={this.goToLoginStep2}  backgroundColor="#823488" buttonTextColor="#ffffff" borderColor="#823488" borderWidth={1} text="REGISTER AS PARENT" />
                    <Button  onPress={this.goToLogin} backgroundColor="#ffffff" buttonTextColor="#823488" borderColor="#823488" borderWidth={1.5}  text="LOGIN" />
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                </View>
            </View> 
        )
    }
} 
const styles  = StyleSheet.create({
    container : {
        flex : 1, 
        backgroundColor : '#ffffff'
    },
    topCurve : {
        flex : 1,
        justifyContent:'flex-start'
    },
    bottomCurve : {
        flex : 1,
        justifyContent : 'flex-end',
    },
    topCurveImage : {
        width : wp('100'),
        height : hp('15')
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('15')
    },
    logoContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        marginBottom : '5%'
    },
    logoImage : {
        width : 200,
        height : 66
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 16,
    },
    secondContainer : {
        justifyContent : 'center',
        alignItems : 'center',
    }
})