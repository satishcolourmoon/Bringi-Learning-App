import React from 'react';
import { View , Text , StyleSheet , StatusBar , Image , ScrollView , TextInput} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Loader from '../../common/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import { apiCall } from '../../utils';
import Button from '../Button';
export default class ResetPassword extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true,
            showAlert : false,
            error_message : '',
            otp : '',
            phone : '',
            newpassword : '',
            btnLoader : false
        }
    }
    componentDidMount(){ 
        setTimeout(()=>{this.setState({loader:false})},600)
    }
    goToOtpVerification = () => {
        this.props.navigation.navigate('OtpVerification');
    }
    resetPassword = async() => {
        if(this.state.otp){
            if(this.state.newpassword){
                this.setState({btnLoader : true});  
               let postData = {
                    otp : this.state.otp,
                    phone : this.props.route.params.phone,
                    action : 'resetPassword',
                    newpassword : this.state.newpassword
               }
               const json  = await apiCall(postData);
               this.setState({btnLoader : false});  
               if(!json.status){
                    this.setState({showAlert:true,error_message:json.message});
                }else if(json.status){
                    this.setState({showAlert:true,error_message:"Password reset successfully"});
                    setTimeout(()=>{this.props.navigation.navigate('Login')},1500)
                }
            }else{
                this.setState({showAlert:true,error_message:'New password is required'});
            }
        }else{
            this.setState({showAlert:true,error_message:'Otp is required'});
        }
    }
    render(){
        if(this.state.loader){
            return(
                <Loader />
            )
        }
        return(
            <View style={styles.container}>
                <AwesomeAlert
                    show={this.state.showAlert}
                    title="Attention!"
                    message={this.state.error_message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({showAlert:false});
                    }}
                />
                <StatusBar hidden />
                <View style={styles.topCurve}>
                    <Image source={require('../../../assets/tcurve.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <ScrollView>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/logo.png')}  style={styles.logoImage} />
                    </View>
                    <View style={styles.secondContainer}>
                        <Text style={styles.heading}>Reset Password</Text>
                        <View>
                            <OTPInputView
                                style={{width: wp('75'), height: 80}}
                                pinCount={4}
                                autoFocusOnLoad
                                secureTextEntry = {true}
                                codeInputFieldStyle={styles.inputFeilds}
                                codeInputHighlightStyle={styles.inputFeildsFocus}
                                onCodeFilled = {(code)=>{this.setState({otp:code})}}
                            />
                        </View>
                        {
                            this.state.otp ? 
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="New Password"
                                    style={styles.input}
                                    secureTextEntry = {true}
                                    onChangeText={(newpassword)=>this.setState({newpassword:newpassword})}
                                    value={this.state.newpassword}
                                />
                            </View> : null
                        }
                        
                        <View>
                            <Button onPress={this.resetPassword}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="RESET PASSWORD" loader={this.state.btnLoader}/>
                        </View>
                    </View>
                </ScrollView>
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
        flex:1,
        justifyContent:'flex-start'
    },
    bottomCurve : {
        flex : 1,
        justifyContent : 'flex-end',
        alignItems : 'flex-end'
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
    },
    logoImage : {
        width : 168,
        height : 46
    },
    secondContainer : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : '10%'
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 16,
        justifyContent : 'center'
    },
    subtext : {
        color : '#6b6b6b',
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
        textAlign : 'center'
    },
    inputFeilds : {
        backgroundColor : '#f2f2f2',
        borderWidth : 0,
        color : '#000000'
    },
    inputFeildsFocus : {
        backgroundColor : '#f2f2f2',
        borderWidth : 1,
        color : '#000000'
    },
    otpImage : {
        width : 70,
        height : 70
    },
    resend : {
        fontFamily : 'Poppins-Regular',
        fontSize : 16,
        textAlign : 'center',
        textDecorationLine:'underline'
    },
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
        margin : '0.4%',
        marginBottom : '3%'
    }
})