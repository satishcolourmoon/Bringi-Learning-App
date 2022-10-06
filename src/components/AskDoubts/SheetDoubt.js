import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, TextInput, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Loader from '../../common/Loader';
import Button from '../Button';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class SheetDoubt extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            qr_code: '',
            student_id: '',
            showScanner: false,
            reactivate: false,
            btnLoader: false,
            question_number: ''
        }
    }

    componentDidMount() {

    }

    submit = async () => {
        if (this.state.qr_code) {
            let postData = {
                sheet_id: this.state.qr_code,
                question_number: this.state.question_number,
                action: 'learningsheet_ask_doubt'
            }
            this.setState({ btnLoader: true });
            const json = await apiCall(postData);
            if (json.status) {
                this.setState({ reactivate: false, btnLoader: false }, () => {
                    this.props.navigation.navigate('AskDoubtsDetails', {
                        data: json.data,
                        sheet_id: this.state.qr_code,
                        question_number: this.state.question_number
                    });
                });
            } else {
                this.setState({ showAlert: true, error_message: 'Invalid Sheet id.', reactivate: false, btnLoader: false });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Sheet id is required', reactivate: false, btnLoader: false });
        }
    }

    onSuccess = async (e) => {
        let qr_code = e.data;
        let postData = {
            qrcode: qr_code,
            action: 'qrcode_check'
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ loader: false, qr_code: json.qrcode, reactivate: true });
        } else {
            this.setState({ showAlert: true, error_message: 'Invalid sheet id.Please enter manually', qr_code: '', reactivate: true });
        }
    };

    openScanner = () => {
        this.setState({ showScanner: true, reactivate: true });
    }

    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden />
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
                <Header title="Sheet Doubts" title1="" backScreen="AskDoubts" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <View style={styles.selectContainer}>
                        <Text style={styles.heading1}>Doubt From Learning Sheet</Text>
                    </View>
                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', marginTop: hp('4') }}>

                        {
                            this.state.showScanner && <QRCodeScanner
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

                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={styles.inputContainer1}>
                                <TextInput
                                    placeholder="Sheet Id"
                                    style={styles.input1}
                                    onChangeText={(qr_code) => this.setState({ qr_code: qr_code })}
                                    value={this.state.qr_code}
                                />
                            </View>
                            <View style={styles.inputContainer1}>
                                <TextInput
                                    placeholder="Question no"
                                    style={styles.input1}
                                    onChangeText={(question_number) => this.setState({ question_number: question_number })}
                                    value={this.state.question_number}
                                />
                            </View>
                            <View style={{ marginTop: '5%' }}>
                                <Button onPress={this.submit} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="NEXT" loader={this.state.btnLoader} />
                            </View>

                        </ScrollView>

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
    aboutContainer: {
        justifyContent: 'center',
        alignItems: 'center'
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
    cameraStyle: {
        width: 130,
        height: 40,
    },
    Qrcontainer: {
        flex: 0.3,
        width: 130,
        height: 50,
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
    inputContainer1: {
        backgroundColor: '#ececec',
        borderRadius: 30,
        paddingLeft: wp('5'),
        margin: '0.4%'
    },
    input1: {
        backgroundColor: '#ececec',
        width: wp('75'),
        borderColor: '#ececec',
        borderRadius: 30,
        fontFamily: 'Poppins-SemiBold'
    },
    label1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '9%'
    },
})