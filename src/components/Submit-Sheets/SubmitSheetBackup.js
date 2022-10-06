import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import { ScrollView } from 'react-native-gesture-handler';
import Button from './Button';
import { Icon } from 'react-native-elements';
import { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import StarRating from 'react-native-star-rating';
import ImagePicker from 'react-native-image-crop-picker';
import qs from 'qs';
import AwesomeAlert from 'react-native-awesome-alerts';
import { baseUrl } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
var radio_props = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
];
export default class SubmitSheet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            qr_code: '',
            time_hours: '',
            time_min: '',
            difficulty_level: 'easy',
            rating: 1,
            remarks: '',
            frontSheetUploaded: false,
            backSheetUploaded: false,
            roughSheetUploaded: false,
            VideoUploaded: false,
            showAlert: false,
            showAlert1: false,
            error_message: '',
            upload_front_sheet: '',
            upload_back_sheet: '',
            upload_rough_sheet: '',
            upload_video: '',
            student_id: ''
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id });
        })
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    goToSubmitSuccess = () => {
        this.props.navigation.navigate('ConfirmSubmit');
    }
    onStarRatingPress(rating) {
        this.setState({
            rating: rating
        });
    }
    OpenFrontImage = () => {
        ImagePicker.openPicker({
            width: 800,
            height: 900,
            cropping: true,
            compressImageQuality: 0.5,
            mediaType: "photo"
        }).then((images) => {
            this.setState({ showAlert1: true });
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action', 'upload_file');
            fetch(baseUrl + 'user', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: uploadData
            }).then((response) => response.json())
                .then((resp) => {
                    if (resp.status) {
                        this.setState(
                            {
                                showAlert1: false,
                                upload_front_sheet: resp.file,
                                frontSheetUploaded: true
                            }
                        );
                    } else {
                        this.setState({ showAlert: true, error_message: 'File not uploaded.Try again' });
                    }
                });
        });
    }
    OpenBackImage = () => {
        ImagePicker.openPicker({
            width: 800,
            height: 900,
            cropping: true,
            compressImageQuality: 0.5,
            mediaType: "photo"
        }).then((images) => {
            this.setState({ showAlert1: true });
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action', 'upload_file');
            fetch(baseUrl + 'user', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: uploadData
            }).then((response) => response.json())
                .then((resp) => {
                    if (resp.status) {
                        this.setState(
                            {
                                showAlert1: false,
                                upload_back_sheet: resp.file,
                                backSheetUploaded: true
                            }
                        );
                    } else {
                        this.setState({ showAlert: true, error_message: 'File not uploaded.Try again' });
                    }
                });
        });
    }
    OpenRoughSheet = () => {
        ImagePicker.openPicker({
            width: 800,
            height: 900,
            cropping: true,
            compressImageQuality: 0.5,
            mediaType: "photo"
        }).then((images) => {
            this.setState({ showAlert1: true });
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action', 'upload_file');
            fetch(baseUrl + 'user', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: uploadData
            }).then((response) => response.json())
                .then((resp) => {
                    if (resp.status) {
                        this.setState(
                            {
                                showAlert1: false,
                                upload_rough_sheet: resp.file,
                                roughSheetUploaded: true
                            }
                        );
                    } else {
                        this.setState({ showAlert: true, error_message: 'File not uploaded.Try again' });
                    }
                });
        });
    }
    OpenVideoUpload = () => {
        ImagePicker.openPicker({
            mediaType: "video"
        }).then((images) => {
            this.setState({ showAlert1: true });
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action', 'upload_file');
            fetch(baseUrl + 'user', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: uploadData
            }).then((response) => response.json())
                .then((resp) => {
                    if (resp.status) {
                        this.setState(
                            {
                                showAlert1: false,
                                upload_video: resp.file,
                                VideoUploaded: true
                            }
                        );
                    } else {
                        this.setState({ showAlert: true, error_message: 'Video not uploaded.Try again' });
                    }
                });
        });
    }
    SubmitSheet = () => {
        if (this.state.qr_code) {
            if (this.state.time_hours) {
                if (this.state.time_min) {
                    if (this.state.difficulty_level) {
                        if (this.state.rating) {
                            if (this.state.remarks) {
                                if (this.state.upload_front_sheet) {
                                    if (this.state.upload_back_sheet) {
                                        if (this.state.upload_back_sheet) {
                                            if (this.state.upload_video) {
                                                if (this.state.upload_rough_sheet) {
                                                    this.setState({ loader: true, error_message: '' });
                                                    fetch(baseUrl + 'user', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'content-type': 'application/x-www-form-urlencoded',
                                                        },
                                                        body: qs.stringify({
                                                            action: 'submitstudentsheets',
                                                            qr_code: this.state.qr_code,
                                                            time_hours: this.state.time_hours,
                                                            time_min: this.state.time_min,
                                                            difficulty_level: this.state.difficulty_level,
                                                            rating: this.state.rating,
                                                            remarks: this.state.remarks,
                                                            upload_front_sheet: this.state.upload_front_sheet,
                                                            upload_back_sheet: this.state.upload_back_sheet,
                                                            upload_video: this.state.upload_video,
                                                            student_id: this.state.student_id,
                                                            upload_rough_sheet: this.state.upload_rough_sheet,
                                                        })
                                                    }).then((response) => response.json())
                                                        .then((json) => {
                                                            this.setState({ loader: false });
                                                            if (!json.status) {
                                                                this.setState({ showAlert: true, error_message: json.message });
                                                            } else if (json.status) {
                                                                this.setState({ showAlert: true, error_message: json.message });
                                                                setTimeout(() => { this.props.navigation.navigate('ConfirmSubmit') }, 1300);
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            this.setState({ loader: false });
                                                        });
                                                } else {
                                                    this.setState({ showAlert: true, error_message: 'Rough sheet is required' });
                                                }
                                            } else {
                                                this.setState({ showAlert: true, error_message: 'Upload video is required' });
                                            }
                                        } else {
                                            this.setState({ showAlert: true, error_message: 'Back sheet is required' });
                                        }
                                    } else {
                                        this.setState({ showAlert: true, error_message: 'Back sheet is required' });
                                    }
                                } else {
                                    this.setState({ showAlert: true, error_message: 'Front sheet is required' });
                                }
                            } else {
                                this.setState({ showAlert: true, error_message: 'Remarks is required' });
                            }
                        } else {
                            this.setState({ showAlert: true, error_message: 'Rating is required' });
                        }
                    } else {
                        this.setState({ showAlert: true, error_message: 'Difficulty level is required' });
                    }
                } else {
                    this.setState({ showAlert: true, error_message: 'Time in min is required' });
                }
            } else {
                this.setState({ showAlert: true, error_message: 'Time in hours is required' });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Qr code is required' });
        }
    }
    onSuccess = e => {
        Linking.openURL(e.data).catch(err =>
            console.error('An error occurred', err)
        );
    };
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
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image source={require('../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>Submit Sheet</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/tops.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={{ flex: 0.9 }}>
                    <ScrollView style={styles.container} >
                        <View style={styles.aboutContainer}>
                            <View style={{ margin: '8%' }}>
                                <View style={styles.center}>
                                    <View style={{ flex: 1 }}>
                                        <QRCodeScanner
                                            onRead={this.onSuccess}
                                            flashMode={RNCamera.Constants.FlashMode.torch}
                                            topContent={
                                                <Text style={styles.centerText}>
                                                    Go to{' '}
                                                    <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
                                                    your computer and scan the QR code.
                                                </Text>
                                            }
                                            bottomContent={
                                                <TouchableWithoutFeedback style={styles.buttonTouchable}>
                                                    <Text style={styles.buttonText}>OK. Got it!</Text>
                                                </TouchableWithoutFeedback>
                                            }
                                        />
                                    </View>

                                    {/* <Image source={require('../../assets/scan.png')} resizeMode="stretch" style={styles.scanImage} />
                                <View>
                                    <Image source={require('../../assets/qr.png')} resizeMode="stretch" style={styles.qrImage} />
                                </View> */}
                                </View>
                            </View>
                        </View>
                        <View style={styles.center}>
                            <Text style={styles.or}>OR</Text>
                        </View>
                        <View style={styles.secondContainer}>
                            <View style={styles.inputContainer1}>
                                <TextInput
                                    placeholder="Sheet Id"
                                    style={styles.input1}
                                    onChangeText={(qr_code) => this.setState({ qr_code: qr_code })}
                                    value={this.state.phone}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Time Taken</Text>
                                <View style={styles.row}>
                                    <View style={{ width: wp('43') }}>
                                        <View style={styles.inputContainer2}>
                                            <TextInput
                                                placeholder="Hours"
                                                style={styles.input2}
                                                value={this.state.time_hours}
                                                keyboardType="number-pad"
                                                onChangeText={(time_hours) => { this.setState({ time_hours: time_hours }) }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: wp('43') }}>
                                        <View style={styles.inputContainer2}>
                                            <TextInput
                                                placeholder="Minutes"
                                                style={styles.input2}
                                                value={this.state.time_min}
                                                keyboardType="number-pad"
                                                onChangeText={(time_min) => { this.setState({ time_min: time_min }) }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Difficulty Level</Text>
                                <View style={{ marginTop: '2%', flexDirection: 'row', marginLeft: '2%' }}>
                                    {
                                        radio_props.map((obj, i) => (
                                            <RadioButton labelHorizontal={true} key={i} >
                                                <RadioButtonInput
                                                    obj={obj}
                                                    index={i}
                                                    onPress={() => { this.setState({ difficulty_level: obj.value }) }}
                                                    isSelected={this.state.difficulty_level == obj.value}
                                                    borderWidth={1}
                                                    buttonInnerColor={'#e74c3c'}
                                                    buttonOuterColor={this.state.difficulty_level == obj.value ? '#2196f3' : '#000'}
                                                    buttonSize={15}
                                                    buttonOuterSize={20}
                                                />
                                                <RadioButtonLabel
                                                    obj={obj}
                                                    onPress={() => { console.log('hii') }}
                                                    index={i}
                                                    labelHorizontal={true}
                                                    labelStyle={{ fontSize: 13, color: '#000', fontFamily: 'Poppins-Regular', marginRight: 15 }}
                                                    labelWrapStyle={{ margin: 0 }}
                                                />
                                            </RadioButton>
                                        ))
                                    }
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Rating</Text>
                                <StarRating
                                    disabled={false}
                                    rating={this.state.rating}
                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    starSize={30}
                                    containerStyle={{ marginLeft: '2%', marginTop: '2%' }}
                                    halfStarEnabled={false}
                                    fullStarColor="#df2238"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Remark</Text>
                                <View>
                                    <View style={styles.inputContainer1}>
                                        <TextInput
                                            placeholder=""
                                            style={styles.input1}
                                            onChangeText={(remarks) => this.setState({ remarks: remarks })}
                                            value={this.state.remarks}
                                            multiline={true}
                                            numberOfLines={5}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={{ width: wp('50') }}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Upload Front Sheet</Text>
                                        <TouchableWithoutFeedback onPress={this.OpenFrontImage}>
                                            <View style={{ marginLeft: '2%', marginTop: '2%' }}>
                                                <Image source={require('../../assets/front-side.png')} style={styles.frontImage} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                {
                                    this.state.frontSheetUploaded && <View style={styles.center}>
                                        <View style={styles.row}>
                                            <Icon name="check-circle" color="green" size={22} />
                                            <Text style={styles.uploadedText}>Uploaded</Text>
                                        </View>
                                    </View>
                                }

                            </View>
                            <View style={styles.row}>
                                <View style={{ width: wp('50') }}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Upload Back Sheet</Text>
                                        <TouchableWithoutFeedback onPress={this.OpenBackImage}>
                                            <View style={{ marginLeft: '2%', marginTop: '2%' }}>
                                                <Image source={require('../../assets/back-side.png')} style={styles.frontImage} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                {
                                    this.state.backSheetUploaded && <View style={styles.center}>
                                        <View style={styles.row}>
                                            <Icon name="check-circle" color="green" size={22} />
                                            <Text style={styles.uploadedText}>Uploaded</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                            <View style={styles.row}>
                                <View style={{ width: wp('50') }}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Upload Rough Sheet</Text>
                                        <TouchableWithoutFeedback onPress={this.OpenRoughSheet}>
                                            <View style={{ marginLeft: '2%', marginTop: '2%' }}>
                                                <Image source={require('../../assets/back-side.png')} style={styles.frontImage} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                {
                                    this.state.roughSheetUploaded && <View style={styles.center}>
                                        <View style={styles.row}>
                                            <Icon name="check-circle" color="green" size={22} />
                                            <Text style={styles.uploadedText}>Uploaded</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                            <View style={styles.row}>
                                <View style={{ width: wp('50') }}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Upload Video</Text>
                                        <TouchableWithoutFeedback onPress={this.OpenVideoUpload}>
                                            <View style={{ marginLeft: '2%', marginTop: '2%' }}>
                                                <Image source={require('../../assets/back-side.png')} style={styles.frontImage} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                {
                                    this.state.VideoUploaded && <View style={styles.center}>
                                        <View style={styles.row}>
                                            <Icon name="check-circle" color="green" size={22} />
                                            <Text style={styles.uploadedText}>Uploaded</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                            <View style={{ marginTop: '5%' }}>
                                <Button onPress={this.SubmitSheet} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="SUBMIT" />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                </View>
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
        color: '#df2238'
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
    }
})