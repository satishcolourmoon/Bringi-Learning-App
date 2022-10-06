import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from '../../components/Button';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../common/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import { apiCall } from '../../utils';
import { CommonActions } from '@react-navigation/native';
export default class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            phone: '',
            password: '',
            showAlert: false,
            error_message: '',
            btnLoader: false
        }

        AsyncStorage.getItem('device_token').then((device_token) => {
            this.state.device_token=device_token;
          })
    }

    componentDidMount() {
        setTimeout(() => { this.setState({ loader: false }) }, 600)
    }

    login = async () => {

        

        if (this.state.phone) {
            if (this.state.password) {
                this.setState({ btnLoader: true, error_message: '' });
                let postData = {
                    phone: this.state.phone,
                    password: this.state.password,
                    token:this.state.device_token,
                    action: 'login'
                }
                //console.log(postData);
                const json = await apiCall(postData);
                this.setState({ btnLoader: false });
                if (!json.status) {
                    this.setState({ showAlert: true, error_message: json.message });
                } else if (json.status) {
                    if (json.data.studetns_under_parent_status) {
                        try {
                            await AsyncStorage.setItem('user_id', json.data.parent_id);
                            await AsyncStorage.setItem('student_id', json.data.student_id);
                            await AsyncStorage.setItem('class_id', json.data.class_id);
                            await AsyncStorage.setItem('student_name', json.data.studentname);
                            await AsyncStorage.setItem('class_name', json.data.class_name);
                            await AsyncStorage.setItem('payment_done', json.data.paymentstatus);
                            await AsyncStorage.setItem('gender', json.data.gender);
                            this.props.navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [
                                        { name: 'MainNavigator' },
                                    ],
                                })
                            )
                        } catch (e) {
                            console.log(e)
                        }
                    } else {
                        this.setState({ showAlert: true, error_message: "Please add student!" });
                        setTimeout(() => { this.props.navigation.navigate('NewUser', { parent_id: json.data.parent_id }) }, 500)
                    }
                }
            } else {
                this.setState({ showAlert: true, error_message: 'Password is required' });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Mobile number is required' });
        }
    }

    goToNewUser = () => {
        this.props.navigation.navigate('NewUser');
    }

    goToForgotPassword = () => {
        this.props.navigation.navigate('ForgotPassword');
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
                <ScrollView>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    <View style={styles.secondContainer}>
                        <Text style={styles.heading}>Login</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Parent Mobile number"
                                style={styles.input}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={(phone) => this.setState({ phone: phone })}
                                value={this.state.phone}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Password"
                                style={styles.input}
                                onChangeText={(password) => this.setState({ password: password })}
                                value={this.state.password}
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={styles.fpConatainer}>
                            <TouchableWithoutFeedback onPress={this.goToForgotPassword}>
                                <Text style={styles.fpText}>Forgot Password?</Text>
                            </TouchableWithoutFeedback>
                        </View>
                        <View>
                            <Button onPress={this.login} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="SUBMIT" loader={this.state.btnLoader} />
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
        justifyContent: 'center',
        alignItems: 'center',

    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
    },
    subtext: {
        color: '#6b6b6b',
        fontFamily: 'Poppins-Regular',
        fontSize: 15
    },
    row: {
        flexDirection: 'row',
        margin: '1.5%'
    },
    loginText: {
        color: '#833485',
        fontFamily: 'Poppins-SemiBold',
        textDecorationLine: 'underline',
        fontSize: 15
    },
    fpText: {
        color: '#833485',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15
    },
    fpConatainer: {
        marginLeft: wp('40'),
        margin: '1.5%'
    },
    input: {
        backgroundColor: '#ececec',
        width: wp('75'),
        borderColor: '#ececec',
        borderRadius: 30,
        fontFamily: 'Poppins-SemiBold',
    },
    input1: {
        backgroundColor: '#ececec',
        width: wp('75'),
        borderColor: '#ececec',
        borderRadius: 20,
        fontFamily: 'Poppins-SemiBold',
    },
    inputContainer: {
        backgroundColor: '#ececec',
        borderRadius: 30,
        paddingLeft: wp('5'),
        margin: '0.4%'
    }
})