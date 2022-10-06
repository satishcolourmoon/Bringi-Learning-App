import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableWithoutFeedbackBase } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Loader from '../../common/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import { apiCall } from '../../utils';
// import CountDown from 'react-native-countdown-component';
export default class OtpVerification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            showAlert: false,
            error_message: '',
            btnLoader: false,
            timer: true
        }
    }
    componentDidMount() {
        setTimeout(() => { this.setState({ loader: false }) }, 600)
    }
    goToOtpVerification = () => {
        this.props.navigation.navigate('OtpVerification');
    }
    verifyOtp = async (code) => {
        if (code) {
            this.setState({ btnLoader: true })
            var postData = {
                otp: code,
                parent_id: this.props.route.params.parent_id,
                action: 'otp_verification'
            }
            const json = await apiCall(postData);
            this.setState({ btnLoader: false });
            if (!json.status) {
                this.setState({ showAlert: true, error_message: json.message });
            } else if (json.status) {
                this.props.navigation.navigate('NewUser',
                    { parent_id: json.data.parent_id })
            }

        } else {
            this.setState({ showAlert: true, error_message: 'Otp is required' });
        }
    }
    resendOtp = async () => {
        this.setState({ btnLoader: true })
        var postData = {
            action: 'resend_otp',
            phone: this.props.route.params.phone
        }
        const json = await apiCall(postData);
        this.setState({ btnLoader: false });
        if (!json.status) {
            this.setState({ showAlert: true, error_message: json.message });
        } else if (json.status) {
            this.setState({ btnLoader: false });
            this.props.navigation.navigate('NewUser',
                { parent_id: json.data.parent_id })
        }
    }
    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
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
                        this.setState({ showAlert: false });
                    }}
                />
                <StatusBar hidden />
                <View style={styles.topCurve}>
                    <Image source={require('../../../assets/tcurve.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={styles.logoContainer}>
                    <Image source={require('../../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                </View>
                <View style={styles.secondContainer}>
                    <Text style={styles.heading}>OTP Verification</Text>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/otp.png')} style={styles.otpImage} />
                    </View>
                    <View>
                        <OTPInputView
                            style={{ width: wp('75'), height: 80 }}
                            pinCount={4}
                            secureTextEntry={true}
                            codeInputFieldStyle={styles.inputFeilds}
                            codeInputHighlightStyle={styles.inputFeildsFocus}
                            onCodeFilled={(code) => { this.verifyOtp(code) }}
                        />
                    </View>
                    <View style={{ marginTop: hp('6'), }}>
                        <Text style={styles.subtext}>Otp has been sent to your mobile number</Text>
                        <Text style={styles.subtext}>Please verify</Text>
                        <Text onPress={this.resendOtp} style={styles.resend}>RESEND</Text>
                    </View>
                    {/* {
                            this.state.timer == true ?
                                <View style={{ marginTop: hp('6'), flexDirection: "row" }}>
                                    <Text style={styles.registerText1}>Resend </Text>
                                    <View style={{ top: 1 }}>
                                        <CountDown
                                            until={30}
                                            size={30}
                                            onFinish={() => this.setState({ timer: false })}
                                            digitStyle={{ backgroundColor: 'transparent', height: 25, width: 25 }}
                                            digitTxtStyle={{ color: 'red', fontSize: 16 }}
                                            timeToShow={['M', 'S']}
                                            timeLabels={{ m: null, s: null }}
                                            showSeparator
                                            separatorStyle={{ color: '#fff', fontSize: 16 }}
                                        />
                                    </View>
                                </View>
                                :
                                <View style={{ marginTop: hp('6'), }}>
                        <Text style={styles.subtext}>Otp has been sent to your mobile number</Text>
                        <Text style={styles.subtext}>Please verify</Text>
                        <Text onPress={this.resendOtp} style={styles.resend}>RESEND</Text>
                                </View>
                        } */}
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    topCurve: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    bottomCurve: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    topCurveImage: {
        width: wp('100'),
        height: hp('15')
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('15')
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%'
    },
    logoImage: {
        width: 200,
        height: 66
    },
    secondContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%'
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        justifyContent: 'center'
    },
    subtext: {
        color: '#6b6b6b',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        textAlign: 'center'
    },
    inputFeilds: {
        backgroundColor: '#f2f2f2',
        borderWidth: 0,
        color: '#000000'
    },
    inputFeildsFocus: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        color: '#000000'
    },
    otpImage: {
        width: 70,
        height: 70
    },
    resend: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        textAlign: 'center',
        textDecorationLine: 'underline'
    }
})