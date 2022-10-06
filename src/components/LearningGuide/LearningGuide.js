import React from 'react';
import { View, TextInput, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import Button from '../Button';
import { apiCall } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';

export default class LearningGuide extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            sheet_id: '',
            showAlert: false,
            error_message: '',
            showScanner: false,
            btnLoader: false,
            student_id: '',
            viewFocused: false,
            qr_code_scanner: false
        }
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id });
        })
        this.props.navigation.addListener('focus', () => {
            this.setState({ viewFocused: true, showScanner: false });
        });
        this.props.navigation.addListener('blur', () => {
            this.setState({ viewFocused: false, showScanner: false });
        });
    }
    goToGuideVideos = async () => {
        if (this.state.sheet_id) {
            let postData = {
                qrcode: this.state.sheet_id,
                action: 'lg_qrcode_check',
                student_id: this.state.student_id
            }
            this.setState({ btnLoader: true })
            const json = await apiCall(postData);
            if (json.status) {
                this.setState({ btnLoader: false }, () => {
                    this.props.navigation.navigate('GuideVideos', {
                        sheet_id: json.qrcode,
                        backScreen: 'LearningGuide'
                    })
                })
            } else {
                this.setState({ showAlert: true, error_message: 'Enter valid Sheet id.', btnLoader: false });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Sheet id is required', btnLoader: false });
        }
    }
    onSuccess = async (e) => {
        this.setState({ qr_code_scanner: true, showScanner: false })
        let qr_code = e.data;
        let postData = {
            qrcode: qr_code,
            action: 'lg_qrcode_check',
            student_id: this.state.student_id
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ loader: false, sheet_id: json.qrcode, btnLoader: false, qr_code_scanner: false, showScanner: false });
            this.props.navigation.navigate('GuideVideos', {
                sheet_id: json.qrcode,
                backScreen: 'LearningGuide'
            })
        } else {
            this.setState({ showAlert: true, error_message: 'Invalid Sheet id.Please enter manually', btnLoader: false, qr_code_scanner: false, showScanner: false });
        }
    };
    openScanner = () => {
        this.setState({ showScanner: true });
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
                <Header title="Learning Guide" title1="" backScreen="Home" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <Text style={styles.label1}>Scan Qr code</Text>
                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', marginTop: hp('3') }}>
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
                <View style={{ flex: 0.6, marginTop: hp('2') }}>
                    <View style={styles.aboutContainer}>
                        <View style={styles.center}>
                            <Text style={styles.or}>OR</Text>
                        </View>
                        <View style={{ marginBottom: hp('1') }}></View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Sheet Id"
                                style={styles.input}
                                onChangeText={(sheet_id) => this.setState({ sheet_id: sheet_id })}
                                value={this.state.sheet_id}
                            />
                        </View>
                    </View>
                    <View style={styles.center}>
                        <View style={{ marginTop: '5%' }}>
                            <Button onPress={this.goToGuideVideos} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="NEXT" loader={this.state.btnLoader} />
                        </View>
                    </View>

                </View>
                <Footer />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
    bottomCurve: {
        flex: 0.1,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('13')
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
    card: {
        width: wp('75'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
    },
    cardTitle: {
        flexDirection: 'row'
    },
    cardText1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#8a4190'
    },
    descContainer: {
        marginLeft: wp('4')
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238'
    },
    icon: {
        height: 25,
        width: 25
    },
    nextContainer: {
        position: 'absolute',
        right: 0
    },
    selectContainer: {
        marginLeft: wp('7'),
        marginTop: '2%'
    },
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#f4141c'
    },
    qrImage: {
        width: 100,
        height: 100
    },
    or: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
        marginTop: hp('4')
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    proceedContainer: {
        position: 'absolute',
        right: 20,
        bottom: 15
    },
    proceedText: {
        fontFamily: 'Poppins-SemiBold',
        marginLeft: wp('4'),
        color: '#ffffff',
        fontSize: 15
    },
    scanImage: {
        width: 120,
        height: 120,
        position: 'absolute'
    },
    qrImage: {
        width: 80,
        height: 80
    },
    row: {
        flexDirection: 'row'
    },
    input: {
        backgroundColor: '#ececec',
        width: wp('75'),
        borderColor: '#ececec',
        borderRadius: 30,
        fontFamily: 'Poppins-SemiBold',
    },
    inputContainer: {
        backgroundColor: '#ececec',
        borderRadius: 30,
        paddingLeft: wp('5'),
        margin: '0.4%'
    },
    cameraStyle: {
        width: 130,
        height: 40,
    },
    Qrcontainer: {
        flex: 0.3,
        width: 130,
        height: 50,
    },
    label1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '9%'
    },
})