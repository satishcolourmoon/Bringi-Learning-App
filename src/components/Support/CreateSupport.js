import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, TextInput, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, Icon } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import { baseUrl } from '../../constants';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
// import StarRating from 'react-native-star-rating';
import Button from '../Button';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

export default class CreateSupport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            type: 1,
            image: '',
            image_full_path: '',
            imageUploaded: false,
            btnLoader: false,
            description: '',
            showAlert: false,
            error_message: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id })
        })
    }

    goBack = () => {
        this.props.navigation.navigate('Support');
    }

    SubmitcreateSupport = async () => {

        if (this.state.description) {
            this.setState({ btnLoader: true })
            this.setState({ error_message: '', btnLoader: true });
            var postData = {
                action: 'raise_ticket',
                student_id: this.state.student_id,
                department_id: this.props.route.params.dep_id,
                file_url: this.state.image_full_path,
                description: this.state.description
            };
            const json = await apiCall(postData);
            if (json.status) {
                this.setState({ showAlert: true, error_message: json.message, btnLoader: false });
                this.props.navigation.navigate('Status')
            } else {
                this.setState({ showAlert: true, error_message: json.message, btnLoader: false });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Description is required' });
        }
    }

    goToStatus = () => {
        this.props.navigation.navigate('Status');
    }

    showActionSheet = () => {
        this.ActionSheet1.show()
    }

    onStarRatingPress(rating) {
        this.setState({
            rating: rating
        });
    }

    openCamera = () => {
        this.ActionSheet1.hide();
        ImagePicker.openCamera({
            width: 700,
            height: 800,
            cropping: true,
            freeStyleCropEnabled: true,
            compressImageQuality: 0.3,
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
                        this.setState({
                            showAlert1: false,
                            image: resp.file,
                            image_full_path: resp.fullpath,
                            imageUploaded: true
                        });
                    } else {
                        this.setState({ showAlert: true, error_message: 'File not uploaded.Try again' });
                    }
                });
        });
    }
    OpenGallery = () => {
        this.ActionSheet1.hide();
        ImagePicker.openPicker({
            width: 700,
            height: 800,
            cropping: true,
            freeStyleCropEnabled: true,
            compressImageQuality: 0.3,
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
                        this.setState({
                            showAlert1: false,
                            image: resp.file,
                            image_full_path: resp.fullpath,
                            imageUploaded: true
                        });
                    } else {
                        this.setState({ showAlert: true, error_message: 'File not uploaded.Try again' });
                    }
                });
        });
    }

    render() {
        const options1 = [
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Cancel</Text>,
            <TouchableWithoutFeedback onPress={this.openCamera}>
                <View style={styles.listItem}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Open Camera</Text>
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback onPress={this.OpenGallery}>
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
                <ActionSheet
                    ref={o => this.ActionSheet1 = o}
                    title={<Text style={{ color: '#000', fontSize: 13, fontFamily: 'Poppins-SemiBold' }}>Select</Text>}
                    options={options1}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { /* do something */ }}
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
                <StatusBar hidden />
                <Header title="Support" title1="" backScreen="Home" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.headingContainer}>
                            <Text style={styles.dep}>DEPARTMENTS  -  </Text>
                            <Text style={styles.dep1}>{this.props.route.params.dep_title}</Text>
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
                        <View style={styles.inputContainer}>
                            {
                                this.state.imageUploaded && <View>
                                    <Image source={{ uri: this.state.image_full_path }} style={{ width: 150, height: 150, marginBottom: 15, borderRadius: 10 }} resizeMode="contain" />
                                </View>
                            }
                            <View>
                                <Text style={styles.label}>Attach File/Image</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={this.showActionSheet}>
                                <View style={{ width: wp('16'), marginTop: '1%' }}>
                                    <Icon name="camera" type='font-awesome' color='#000' size={50} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {/* <View style={styles.inputContainer}>
                            <Text style={styles.label}>Rating</Text>
                            <StarRating
                                disabled={false}
                                rating={this.state.rating}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                starSize={30}
                                containerStyle={{marginLeft : '2%',marginTop:'2%'}}
                                halfStarEnabled={false}
                                fullStarColor="#df2238"
                            />
                        </View>   */}
                        <View style={{ marginTop: '5%', justifyContent: 'center', alignItems: 'center' }}>
                            <Button loader={this.state.btnLoader} onPress={this.SubmitcreateSupport} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="NEXT" />
                        </View>
                        <View style={{ padding: 15 }} />
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
        marginTop: '3%',
        marginLeft: '7%',
        marginRight: '7%',
        marginBottom: '3%'
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
})