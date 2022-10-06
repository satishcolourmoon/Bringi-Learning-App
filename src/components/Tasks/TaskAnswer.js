import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../Loader';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Button';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import qs from 'qs';
import AwesomeAlert from 'react-native-awesome-alerts';
import { baseUrl } from '../../constants';
import AsyncStorage from '@react-native-community/async-storage';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { Divider } from 'react-native-elements';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import DocumentPicker from 'react-native-document-picker';
import { ProcessingManager } from 'react-native-video-processing';

export default class TaskAnswer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            remarks: '',
            fileUploaded: false,
            showAlert: false,
            showAlert1: false,
            error_message: '',
            upload_file: '',
            student_id: '',
            file_full_image: '',
            btnLoader: false,
            progress: 0,
            VideoUploaded: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id });
        })
    }

    showActionSheet = (type) => {
        if (type == "front") {
            this.ActionSheet1.show()
        }
    }

    OpenFrontImageCamera = () => {

        const { file_type } = this.props.route.params;
        if (file_type == "image") {
            this.ActionSheet1.hide();
            ImagePicker.openCamera({
                width: 700,
                height: 800,
                cropping: true,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.5,
                mediaType: 'photo'
            }).then((images) => {
                this.setState({ showAlert3: true });
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
                                    showAlert3: false,
                                    upload_file: resp.file,
                                    file_full_image: resp.fullpath,
                                    fileUploaded: true
                                }
                            );
                        } else {
                            this.setState({ showAlert3: false, showAlert: true, error_message: 'File not uploaded.Try again' });
                        }
                    });
            });
        } else {
            alert('Please go back and try again')
        }
    }

    OpenFrontImage = async () => {
        const { file_type } = this.props.route.params;
        this.ActionSheet1.hide();
        if (file_type == "image") {
            ImagePicker.openPicker({
                width: 700,
                height: 800,
                cropping: true,
                freeStyleCropEnabled: true,
                compressImageQuality: 0.5,
                mediaType: 'photo'
            }).then((images) => {
                this.setState({ showAlert3: true });
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
                                    showAlert3: false,
                                    upload_file: resp.file,
                                    file_full_image: resp.fullpath,
                                    fileUploaded: true
                                }
                            );
                        } else {
                            this.setState({ showAlert3: false, showAlert: true, error_message: 'File not uploaded.Try again' });
                        }
                    });
            });
        } else if (file_type == "pdf") {
            try {
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.pdf],
                });
                this.setState({ showAlert3: true });
                let uploadData = new FormData();
                uploadData.append('file', { type: res.type, uri: res.uri, name: res.name });
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
                                    showAlert3: false,
                                    upload_file: resp.file,
                                    file_full_image: resp.fullpath,
                                    fileUploaded: true
                                }
                            );
                        } else {
                            this.setState({ showAlert3: false, showAlert: true, error_message: 'File not uploaded.Try again' });
                        }
                    });

            } catch (err) {

                if (DocumentPicker.isCancel(err)) {
                    this.setState({ showAlert3: false, showAlert: true, error_message: 'User cancelled the action' });
                } else {
                    this.setState({ showAlert3: false, showAlert: true, error_message: 'File not uploaded.Try again later' });
                }
            }
        } else if (file_type == "video") {
            ImagePicker.openPicker({
                mediaType: "video",
            }).then((images) => {
                if (images.size > 10000000) {
                    this.setState({ showAlert2: true, VideoUploaded: false });
                    const options = {
                        bitrateMultiplier: 10,
                        minimumBitrate: 1000,
                        removeAudio: false,
                    };
                    ProcessingManager.compress(images.path, options).then((data) => {
                        this.setState({ showAlert2: false, showAlert1: true, progress: 0 }, () => {
                            const xhr = new XMLHttpRequest();
                            let uploadData = new FormData();
                            uploadData.append('file', { type: images.mime, uri: data.source, name: data.source.split("/").pop() });
                            uploadData.append('action', 'upload_file');
                            xhr.upload.addEventListener('progress', this.handleProgress);
                            xhr.addEventListener('load', () => {
                                this.setState({ progress: 100 })
                                let resp = JSON.parse(xhr.response);
                                if (resp.status) {
                                    this.setState({ progress: 100, showAlert1: false, file_full_image: resp.fullpath, VideoUploaded: true });
                                } else {
                                    this.setState({ showAlert1: false, progress: 0, showAlert: true, error_message: 'Video not uploaded.Try again' });
                                }
                            })
                            xhr.open('POST', baseUrl + 'user');
                            xhr.setRequestHeader('Accept', 'application/json');
                            xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                            xhr.send(uploadData);
                        });
                    })
                } else {
                    this.setState({ progress: 0, showAlert2: false, showAlert1: true, VideoUploaded: false }, () => {
                        const xhr1 = new XMLHttpRequest();
                        let uploadData1 = new FormData();
                        uploadData1.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
                        uploadData1.append('action', 'upload_file');
                        xhr1.upload.addEventListener('progress', this.handleProgress);
                        xhr1.addEventListener('load', () => {
                            let resp1 = JSON.parse(xhr1.response);
                            if (resp1.status) {
                                this.setState({ showAlert1: false, file_full_image: resp1.fullpath, VideoUploaded: true, progress: 100 });
                            } else {
                                this.setState({ showAlert1: false, showAlert: true, error_message: 'Video not uploaded.Try again', progress: 0 });
                            }
                        })
                        xhr1.open('POST', baseUrl + 'user');
                        xhr1.setRequestHeader('Accept', 'application/json');
                        xhr1.setRequestHeader('Content-Type', 'multipart/form-data');
                        xhr1.send(uploadData1);
                    });
                }
            });
        }
    }

    handleProgress = (event) => {
        let progress = Math.round((event.loaded * 100 / event.total * 100)) / 100;
        this.setState({ progress })
    }

    SubmitTask = async () => {
        if (this.state.file_full_image) {
            if (this.state.remarks) {
                this.setState({ error_message: '', btnLoader: true });
                var postData = {
                    action: 'student_assigned_task_user_answer',
                    student_id: this.state.student_id,
                    task_id: this.props.route.params.task_id,
                    user_remark: this.state.remarks,
                    file_url: this.state.file_full_image,
                };
                const json = await apiCall(postData);
                if (!json.status) {
                    this.setState({ showAlert: true, error_message: json.message, btnLoader: fase });
                } else if (json.status) {
                    this.setState({ showAlert: true, error_message: json.message });
                    setTimeout(() => { this.props.navigation.navigate('CompletedTasks') }, 1200);
                }
            } else {
                this.setState({ showAlert: true, error_message: 'Remark is required' });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Attachment is required' });
        }
    }

    render() {
        const { file_type } = this.props.route.params;
        const options1 = [
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Cancel</Text>,
            <TouchableWithoutFeedback onPress={this.OpenFrontImageCamera}>
                <View style={styles.listItem}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Open Camera</Text>
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback onPress={this.OpenFrontImage}>
                <View style={styles.listItem}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Pick from Gallery</Text>
                </View>
            </TouchableWithoutFeedback>
        ];

        const options2 = [
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Cancel</Text>,
            <TouchableWithoutFeedback onPress={this.OpenFrontImage}>
                <View style={styles.listItem}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Pick from Gallery</Text>
                </View>
            </TouchableWithoutFeedback>
        ];

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
                    show={this.state.showAlert3}
                    title="Uploading...."
                    showProgress={false}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                />
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
                    title={`Uploading ... ${this.state.progress}%`}
                    showProgress={false}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                />
                <AwesomeAlert
                    show={this.state.showAlert2}
                    title="Please wait while we compress the video...."
                    showProgress={false}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                />
                <ActionSheet
                    ref={o => this.ActionSheet1 = o}
                    title={<Text style={{ color: '#000', fontSize: 13, fontFamily: 'Poppins-SemiBold' }}>Select</Text>}
                    options={file_type == "image" ? options1 : options2}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { }}
                />
                <Header title="Submit" title1="Task" backScreen="SubmitSheet2" headerImage="submitSheet" navigation={this.props.navigation} />
                <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
                    <ScrollView>
                        <View style={styles.row}>
                            <View style={{ width: wp('50') }}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Upload Attachment</Text>
                                    <TouchableWithoutFeedback onPress={() => this.showActionSheet('front')}>
                                        <View>
                                            {
                                                file_type == "image" && <View style={{ marginLeft: '2%', marginTop: '2%' }}>
                                                    {
                                                        this.state.file_full_image ?
                                                            <Image source={{ uri: this.state.file_full_image }} style={styles.frontImage} resizeMode="contain" /> :
                                                            <Image source={require('../../../assets/front-side.png')} style={styles.frontImage} />
                                                    }
                                                </View>
                                            }
                                            {
                                                file_type == "pdf" && <View style={{ marginLeft: '2%', marginTop: '2%' }}>
                                                    <Image source={require('../../../assets/pdf.png')} style={styles.frontImage} resizeMode="contain" />
                                                </View>
                                            }
                                            {
                                                file_type == "video" && <View style={styles.row}>
                                                    <View style={{ marginLeft: '2%', marginTop: '2%' }}>
                                                        <Text style={styles.playText}>Upload Video    </Text>
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
                                            }
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            {
                                this.state.fileUploaded && <View style={styles.center}>
                                    <View style={styles.row}>
                                        <Icon name="check-circle" color="green" size={22} />
                                        <Text style={styles.uploadedText}>Uploaded</Text>
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Divider />
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
                        <View style={{ marginTop: '5%' }}>
                            <Button onPress={this.SubmitTask} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="SUBMIT" loader={this.state.btnLoader} />
                        </View>
                        <View style={{ padding: '3%' }}></View>
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
        width: 150,
        height: 50,
    },
    Qrcontainer: {
        flex: 0.3,
        width: 150,
        height: 50,
    },
    listItem: {
        width: wp('93'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    label3: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: 'red',
        marginLeft: 5
    },
    playText: {
        fontFamily: 'Poppins-SemiBold',
        color: 'blue',
        fontSize: 13
    }
})