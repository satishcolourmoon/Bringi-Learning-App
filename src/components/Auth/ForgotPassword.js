import React from 'react';
import { View , Text , StyleSheet , StatusBar , Image , ScrollView , TextInput , KeyboardAvoidingView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Button from '../Button';
import Loader from '../../common/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import { apiCall } from '../../utils';
export  class ForgotPassword extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true,
            action : 'forgotPassword',
            phone : '',
            showAlert : false,
            error_message : '',
            btnLoader : false
        }
    }
    componentDidMount(){
        setTimeout(()=>{this.setState({loader:false})},600)
    }
    verifyMobile = async() => {
        if(this.state.phone){
                this.setState({btnLoader : true});  
                let postData = { 
                    phone : this.state.phone,
                    action : 'forgotPassword'
                }
                const json = await apiCall(postData);
                if(!json.status){
                    this.setState({showAlert:true,error_message:json.message,btnLoader:false});
                }else if(json.status){
                    this.setState({btnLoader:false},()=>{
                        this.props.navigation.navigate('ResetPassword',
                            {  
                                phone:this.state.phone
                            }
                        )
                    })
                }
         }else{
            this.setState({showAlert:true,error_message:'Mobile number is required'});
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
                <KeyboardAvoidingView behavior='position'>
                    <ScrollView>
                        <View style={styles.logoContainer}>
                            <Image source={require('../../../assets/logo.png')}  style={styles.logoImage} resizeMode="contain"/>
                        </View>
                        <View style={styles.secondContainer}>
                            <View style={styles.center}>
                                <Text style={styles.heading}>Forgot Password?</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="Registered Mobile number"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onChangeText={(phone)=>this.setState({phone:phone})}
                                    value={this.state.phone}
                                    maxLength={10}
                                />
                            </View>
                            <View style={styles.center}>
                                <Text style={styles.subtext}>We will send a 4 digit OTP to verify</Text>
                            </View>
                            <View>
                                <Button onPress={this.verifyMobile}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="NEXT"  loader={this.state.btnLoader}  />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage}/>
                </View>
            </View>
        )
    }
} 
export default ForgotPassword;
const styles  = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff',
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
    secondContainer : {
        justifyContent : 'center',
        alignItems : 'center',
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 16,
        margin : '1%'
    },
    subtext : {
        color : '#6b6b6b',
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
        margin : '1%'
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
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
        margin : '0.4%'
    }
})