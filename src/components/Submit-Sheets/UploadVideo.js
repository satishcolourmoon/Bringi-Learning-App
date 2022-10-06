import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../Loader';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Button';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import { baseUrl } from '../../constants';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import qs from 'qs';
import { ProcessingManager } from 'react-native-video-processing';
export default class SubmitSheet2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            qr_code: '',
            btnLoader: false,
            student_id: '',
            progress: 0
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id });
        })
    }

    OpenVideoUpload = () => {
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
                                this.setState({ progress: 100, showAlert1: false, upload_video: resp.fullpath, VideoUploaded: true });
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
                            this.setState({ showAlert1: false, upload_video: resp1.fullpath, VideoUploaded: true, progress: 100 });
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

    handleProgress = (event) => {
        let progress = Math.round((event.loaded * 100 / event.total * 100)) / 100;
        this.setState({ progress })
    }

    submitVideoUpload = () => {
        this.setState({ btnLoader: true })
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'submitstudentvideos',
                qr_code: this.props.route.params.qr_code,
                upload_video: this.state.upload_video,
                student_id: this.state.student_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    this.setState({ showAlert: true, error_message: json.message, btnLoader: false });
                } else if (json.status) {
                    this.setState({ btnLoader: false }, () => {
                        this.props.navigation.navigate('ConfirmSubmit', {
                            qr_code: this.props.route.params.qr_code
                        })
                    })
                }
            })
            .catch((error) => {
                this.setState({ loader: false, btnLoader: false });
            });
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
                <Header title="Submit" title1="Sheet Video" backScreen="SheetVideo" headerImage="submitSheet" navigation={this.props.navigation} />
                <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
                    <ScrollView>
                        <View style={styles.row}>
                            <View style={{ width: wp('50') }}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Upload Video</Text>
                                    <TouchableWithoutFeedback onPress={this.OpenVideoUpload}>
                                        <View style={{ marginLeft: '2%', marginTop: '2%' }}>
                                            <Image source={require('../../../assets/upload_video.png')} style={styles.frontImage} />
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
                            <Button onPress={this.submitVideoUpload} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="SUBMIT" loader={this.state.btnLoader} />
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

    or: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '2%'
    },

    frontImage: {
        width: 120,
        height: 150
    },
    row: {
        flexDirection: 'row'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})