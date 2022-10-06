import React from 'react';
import { View, StyleSheet, StatusBar, Image, Picker, TouchableWithoutFeedback, Text, TextInput, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, Icon } from 'react-native-elements';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import Loader from '../../common/Loader';
import Button from '../../components/Button';
import { apiCall } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import { baseUrl } from '../../constants';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
export default class NewDoubts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            type: 1,
            class_id: '',
            board_id: '',
            student_id: '',
            subjects: [],
            btnLoader: false,
            subject_id: '',
            image: '',
            description: '',
            imageUploaded: false
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('class_id').then((class_id) => {
            AsyncStorage.getItem('board_id').then((board_id) => {
                AsyncStorage.getItem('student_id').then((student_id) => {
                    this.setState({
                        class_id: class_id,
                        board_id: board_id,
                        student_id: student_id
                    }, () => {
                        this.getSubjects(class_id, board_id, student_id);
                    })
                })
            });
        });
    }

    getSubjects = async (class_id, board_id, student_id) => {
        var postData = {
            action: 'student_subscribed_subjects',
            student_id: student_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, data: [], btnLoader: false });
        } else if (json.status) {
            this.setState({ loader: false, subjects: json.subjects, btnLoader: false });
        }
    }
    submit = async () => {
        if (this.state.subject_id) {
            if (this.state.image) {
                if (this.state.description) {
                    this.setState({ btnLoader: true })
                    let postData = {
                        subject_id: this.state.subject_id,
                        image: this.state.image,
                        description: this.state.description,
                        student_id: this.state.student_id,
                        action: 'ask_doubts'
                    }
                    const json = await apiCall(postData);
                    if (json.status) {
                        this.setState({ showAlert: true, error_message: 'Doubt submitted successfully.We will get back to you soon', btnLoader: false });
                        setTimeout(() => {
                            this.props.navigation.navigate('AskDoubts')
                        }, 1200)

                    } else {
                        this.setState({ showAlert: true, error_message: json.message, btnLoader: false });
                    }
                } else {
                    this.setState({ showAlert: true, error_message: 'Description is required', btnLoader: false });
                }
            } else {
                this.setState({ showAlert: true, error_message: 'Attachment is required', btnLoader: false });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Please select your subject', btnLoader: false });
        }

    }

    goBack = () => {
        this.props.navigation.navigate('DoubtsList');
    }
    goToStatus = () => {
        this.props.navigation.navigate('Status');
    }
    openPicker = () => {
        ImagePicker.openPicker({
            width: 700,
            height: 800,
            cropping: true,
            freeStyleCropEnabled: true,
            compressImageQuality: 0.2,
            mediaType: "photo"
        }).then((images) => {
            this.ActionSheet1.hide()
            this.setState({ showAlert1: true, imageUploaded: false });
            let uploadData = new FormData();
            uploadData.append('image', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action', 'askDoubtImage');
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
                                image: resp.fullpath,
                                imageUploaded: true
                            }
                        );
                    } else {
                        this.setState({ showAlert: true, error_message: 'File not uploaded.Try again' });
                    }
                });
        });
    }
    OpenCamera = () => {
        ImagePicker.openCamera({
            width: 700,
            height: 800,
            cropping: true,
            freeStyleCropEnabled: true,
            compressImageQuality: 0.2,
            mediaType: "photo"
        }).then((images) => {
            this.ActionSheet1.hide()
            this.setState({ showAlert1: true, imageUploaded: false });
            let uploadData = new FormData();
            uploadData.append('image', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action', 'askDoubtImage');
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
                                image: resp.fullpath,
                                imageUploaded: true
                            }
                        );
                    } else {
                        this.setState({ showAlert: true, error_message: 'File not uploaded.Try again' });
                    }
                });
        });
    }
    showActionSheet = () => {

        this.ActionSheet1.show()

    }
    render() {
        const options1 = [
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Cancel</Text>,
            <TouchableWithoutFeedback onPress={this.OpenCamera}>
                <View style={styles.listItem}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Open Camera</Text>
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback onPress={this.openPicker}>
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
                    show={this.state.showAlert1}
                    title="Uploading...."
                    showProgress={false}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                />
                <ActionSheet
                    ref={o => this.ActionSheet1 = o}
                    title={<Text style={{ color: '#000', fontSize: 13, fontFamily: 'Poppins-SemiBold' }}>Select</Text>}
                    options={options1}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { /* do something */ }}
                />
                <Header title="Ask Doubts" title1="" backScreen="DoubtsList" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{ flex: 0.9, marginLeft: '7%', marginRight: '7%' }}>
                    <ScrollView>
                        <View style={styles.inputContainer}>

                            <Text style={styles.label}>Select Subject</Text>

                            <View style={styles.inputContainer2}>
                                <Picker
                                    selectedValue={this.state.subject_id}
                                    style={{ height: 48, width: wp('75') }}
                                    onValueChange={(subject_id) => this.setState({ subject_id: subject_id })}
                                >
                                    <Picker.Item label="Select subject" value="" />
                                    {
                                        this.state.subjects.map((item) => {
                                            return (
                                                <Picker.Item label={item.title} value={item.id} key={item.id} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>

                        </View>

                        <View style={styles.inputContainer}>
                            <View>
                                <Text style={styles.label}>Attach File/Image</Text>
                            </View>
                            <View style={styles.row}>
                                <View style={{ width: wp('16'), marginTop: '1%' }}>
                                    <Icon name="camera" type='font-awesome' color='#000' size={50} onPress={this.showActionSheet} />
                                </View>
                                {
                                    this.state.imageUploaded && <View style={styles.center}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 5, color: 'green' }}>Uploaded</Text>
                                    </View>
                                }

                            </View>

                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description</Text>
                            <View>
                                <View style={styles.inputContainer1}>
                                    <TextInput
                                        placeholder=""
                                        style={styles.input1}
                                        onChangeText={(description) => this.setState({ description: description })}
                                        value={this.state.description}
                                        multiline={true}
                                        numberOfLines={5}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: '5%' }}>
                            <Button onPress={this.submit} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="NEXT" loader={this.state.btnLoader} />
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
        backgroundColor: '#ffffff'
    },
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
    bottomCurve: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('15')
    },
    headingContainer: {
        marginTop: '4%',
        marginLeft: wp('7'),
        flexDirection: 'row'
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
    successImage: {
        width: 150,
        height: 150
    },
    successText: {
        fontFamily: 'Poppins-Regular',
        marginTop: '2%'
    },
    successId: {
        fontFamily: 'Poppins-SemiBold',
        marginTop: '1%',
        fontSize: 17
    },
    descContainer: {
        marginLeft: wp('4'),
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
    },
    dep: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    dep1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#b33236'
    },
    inputContainer: {
        marginTop: '7%',
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '2%'
    },
    row: {
        flexDirection: 'row'
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
    inputContainer2: {
        backgroundColor: '#ececec',
        borderRadius: 30,
        paddingLeft: wp('5'),
        margin: '0.4%'
    },
    center: {
        justifyContent: 'center'
    },
    listItem: {
        width: wp('100'),
        alignItems: 'center'
    }

})