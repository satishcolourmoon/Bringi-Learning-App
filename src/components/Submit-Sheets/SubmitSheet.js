import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, TextInput, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Button';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
export default class SubmitSheet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            qr_code: '',
            student_id: '',
            showScanner: false,
            reactivate: false,
            btnLoader: false,
            viewFocused: false,
            qr_code_scanner: false
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id });
        });
        this.props.navigation.addListener('focus', () => {
            this.setState({ viewFocused: true, showScanner: false });
        });
        this.props.navigation.addListener('blur', () => {
            this.setState({ viewFocused: false, showScanner: false });
        });
    }
    goBack = () => {
        this.props.navigation.navigate('SheetMenu');
    }
    SubmitSheet = async () => {
        if (this.state.qr_code) {
            let postData = {
                qrcode: this.state.qr_code,
                action: 'qrcode_check',
                student_id: this.state.student_id,
            }
            this.setState({ btnLoader: true });
            const json = await apiCall(postData);
            if (json.status) {
                this.setState({ reactivate: false, btnLoader: false }, () => {
                    this.props.navigation.navigate('SubmitSheet2', {
                        qr_code: this.state.qr_code,
                        student_id: this.state.student_id,
                        backScreen: 'SubmitSheet'
                    });
                });
            } else {
                this.setState({ showAlert: true, error_message: json.message, reactivate: false, btnLoader: false });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Sheet id is required', reactivate: false, btnLoader: false });
        }
    }
    onSuccess = async (e) => {
        this.setState({ qr_code_scanner: true, showScanner: false })
        let qr_code = e.data;
        let postData = {
            qrcode: qr_code,
            action: 'qrcode_check',
            student_id: this.state.student_id,
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ loader: false, qr_code: json.qrcode, reactivate: true, qr_code_scanner: false, showScanner: false });
            this.props.navigation.navigate('SubmitSheet2', {
                qr_code: qr_code,
                student_id: this.state.student_id,
                backScreen: 'SubmitSheet'
            });
        } else {
            this.setState({ showAlert: true, error_message: 'Invalid sheet id.Please enter manually', qr_code: '', reactivate: true, qr_code_scanner: false, showScanner: false });
        }
    };
    openScanner = () => {
        this.setState({ showScanner: true, reactivate: true });
    }
    renderCameraTopContent = () => {
        return (
            <View style={{ zIndex: 99999 }}>
                <Text style={{ fontFamily: 'Poppins-Regular' }}>Scan your QR code</Text>
            </View>
        )
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
                <AwesomeAlert
                    show={this.state.showAlert1}
                    title="Uploading...."
                    showProgress={true}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                />
                <StatusBar hidden />
                <Header title="Submit" title1="Learning Sheet" backScreen="SheetMenu" headerImage="submitSheet" navigation={this.props.navigation} />
                <Text style={styles.label1}>Scan Qr code</Text>
                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', marginTop: hp('4') }}>
                    {
                        this.state.qr_code_scanner && <ActivityIndicator color="black" size="large" />
                    }
                    {
                        this.state.showScanner && this.state.viewFocused && <QRCodeScanner
                            ref={(node) => { this.scanner = node }}
                            onRead={this.onSuccess}
                            cameraStyle={styles.cameraStyle}
                            containerStyle={styles.Qrcontainer}
                            flashMode={RNCamera.Constants.FlashMode.off}
                            reactivate={true}
                            fadeIn={true}
                            vibrate={false}

                        />
                    }
                    {
                        !this.state.showScanner && <TouchableWithoutFeedback onPress={this.openScanner}>
                            <View style={styles.center}>
                                <Image source={require('../../../assets/scan.png')} resizeMode="stretch" style={styles.scanImage} />
                                <View>
                                    <Image source={require('../../../assets/qr.png')} resizeMode="stretch" style={styles.qrImage} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                </View>
                <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center', marginTop: hp('3') }}>
                    <View style={styles.center}>
                        <Text style={styles.or}>(OR)</Text>
                    </View>
                    <View style={{ marginBottom: hp('2') }}></View>
                    <ScrollView>
                        <View style={styles.inputContainer1}>
                            <TextInput
                                placeholder="Sheet Id"
                                style={styles.input1}
                                onChangeText={(qr_code) => this.setState({ qr_code: qr_code })}
                                value={this.state.qr_code}
                            />
                        </View>
                        <View style={{ marginTop: '5%' }}>
                            <Button onPress={this.SubmitSheet} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="NEXT STEP" loader={this.state.btnLoader} />
                        </View>
                    </ScrollView>
                </View>
                <Footer />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
    bottomCurve: {
        flex: 0.1,
        justifyContent: 'flex-end'
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('12')
    },
    aboutContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    backMainContainer: {
        position: 'absolute',
        top: 30,
        left: 10
    },
    backContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: '#eeeeee',
        borderRadius: 8
    },
    backIcon: {
        width: 55,
        height: 55
    },
    descContainer: {
        marginLeft: wp('4')
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238'
    },
    or: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
        marginTop: hp('3')
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrImage: {
        width: 80,
        height: 80
    },
    secondContainer: {
        margin: '7%'
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '2%'
    },
    label1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '9%'
    },
    inputContainer: {
        marginTop: '3%',
    },
    row: {
        flexDirection: 'row'
    },
    timeContainer: {
        backgroundColor: '#ececec',
        height: hp('6'),
        width: wp('30'),
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%'
    },
    timeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
    },
    frontImage: {
        width: 120,
        height: 150
    },
    scanImage: {
        width: 120,
        height: 120,
        position: 'absolute'
    },
    input1: {
        backgroundColor: '#ececec',
        width: wp('75'),
        borderColor: '#ececec',
        borderRadius: 30,
        fontFamily: 'Poppins-SemiBold'
    },
    input2: {
        backgroundColor: '#ececec',
        width: wp('30'),
        borderColor: '#ececec',
        borderRadius: 30,
        fontFamily: 'Poppins-SemiBold'
    },
    inputContainer1: {
        backgroundColor: '#ececec',
        borderRadius: 30,
        paddingLeft: wp('5'),
        margin: '0.4%'
    },
    inputContainer2: {
        backgroundColor: '#ececec',
        borderRadius: 30,
        paddingLeft: wp('5'),
        margin: '0.4%'
    },
    uploadedText: {
        fontFamily: 'Poppins-SemiBold',
        marginLeft: '2%'
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {

    },
    cameraStyle: {
        width: 130,
        height: 40,
    },
    Qrcontainer: {
        flex: 0.3,
        width: 130,
        height: 50,
    }
})