import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, Divider, Icon } from 'react-native-elements';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import Button from '../../components/Button';
import Orientation from 'react-native-orientation-locker';

export default class TaskDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            showAlert: false,
            error_message: '',
            data: {},
            student_id: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.getTaskDetails(student_id);
        });
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                Orientation.lockToPortrait();
            }
        );
    }

    getTaskDetails = async (student_id) => {
        let postData = {
            action: 'student_assigned_task_view',
            student_id,
            task_id: this.props.route.params.task_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, data: {} });
        } else if (json.status) {
            this.setState({ loader: false, data: json.data });
        }
    }

    goToImageViewer = (uri) => {
        this.props.navigation.navigate('ImageViewer', {
            uri
        })
    }

    goToTaskAnswer = () => {
        this.props.navigation.navigate('TaskAnswer', {
            task_id: this.state.data.id,
            file_type: this.state.data.file_type
        })
    }

    goToPdfViewer = (url) => {
        this.props.navigation.navigate('PdfViewer', {
            url
        })
    }

    playVideo = (url) => {
        this.props.navigation.navigate('VideoComponent', {
            video_url: url,
            backScreen: TaskDetails
        })
    }

    render() {
        const { data } = this.state;
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
                <View>
                    <Header title="Activity" title1="Details" backScreen="PackageMenu" headerImage="subject" navigation={this.props.navigation} />
                </View>
                <ScrollView>
                    <View style={{ flex: 0.9, marginTop: 45 }}>
                        {/* <View style={styles.center}>
                            <Text style={styles.taskId}>#{data.task_id}</Text>
                        </View> */}
                        <Card containerStyle={styles.card}>
                            <Card containerStyle={[styles.card11, { position: "absolute", top: -100, alignSelf: "center" }]}>
                                <Text style={styles.coinText}>{data.student_points ? data.student_points : 0}</Text>
                                <Text style={styles.coinsText}>Coins</Text>
                            </Card>
                            <View style={{ alignItems: "center", paddingBottom: hp('1'), marginTop: hp('3') }}>
                                <View style={{ width: wp('30') }}>
                                    <Text style={[styles.headerName, { textAlign: "center" }]}>Task Name</Text>
                                </View>
                                <View>
                                    <Text style={[styles.headerValue, { color: "#E63A54", textAlign: "center", fontFamily: "Poppins-Bold", fontSize: 16 }]}>{data.task_name}</Text>
                                </View>
                            </View>
                            <Divider />
                            <View style={{ padding: 5, }} />
                            <View style={{ paddingBottom: hp('1') }}>
                                <View style={{ width: wp('40') }}>
                                    <Text style={styles.headerName}>Description : </Text>
                                </View>
                                <View>
                                    <Text style={styles.headerValue}>{data.description}</Text>
                                </View>
                            </View>
                            <Divider />
                            <View style={{ padding: 5 }} />
                            <View style={{ paddingBottom: hp('1') }}>
                                <View style={{ width: wp('40') }}>
                                    <Text style={styles.headerName}>Attachments  </Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Icon name="paperclip" type="font-awesome" color="#000" size={22} />
                                    <View style={{ paddingLeft: wp('2') }}>
                                        {
                                            data.admin_file_type == "video" && <TouchableWithoutFeedback onPress={() => this.playVideo(data.file_url)}><Text style={styles.playText}>Play Video</Text></TouchableWithoutFeedback>
                                        }
                                        {
                                            ((data.admin_file_type == "png") || (data.admin_file_type == "jpg") || (data.admin_file_type == "jpeg") || (data.admin_file_type == "PNG") || (data.admin_file_type == "JPEG") || (data.admin_file_type == "JPG")) && <TouchableWithoutFeedback onPress={() => { this.goToImageViewer(data.file_url) }}>
                                                <Image source={{ uri: data.file_url }} style={{ width: 150, height: 120, marginLeft: 5, marginTop: 7 }} resizeMode="contain" />
                                            </TouchableWithoutFeedback>
                                        }
                                        {
                                            data.admin_file_type == "pdf" && <TouchableWithoutFeedback onPress={() => { this.goToPdfViewer(data.file_url) }}>
                                                <Text style={styles.pdfText}>Click to view pdf</Text>
                                            </TouchableWithoutFeedback>
                                        }
                                    </View>
                                </View>
                            </View>
                            <Divider />
                            <View style={{ padding: 5 }} />
                            {
                                data.corrected_status && <View>
                                    <View style={{ paddingBottom: hp('1') }}>
                                        <View style={{ width: wp('50') }}>
                                            <Text style={styles.headerName}>My Response  </Text>
                                        </View>
                                        {
                                            data.file_type == "image" && <TouchableWithoutFeedback onPress={() => { this.goToImageViewer(data.user_file) }}>
                                                <Image source={{ uri: data.user_file }} style={{ width: 150, height: 120, marginLeft: 5 }} resizeMode="contain" />
                                            </TouchableWithoutFeedback>
                                        }
                                        {
                                            data.file_type == "pdf" && <TouchableWithoutFeedback onPress={() => { this.goToPdfViewer(data.user_file) }}>
                                                <Text style={styles.pdfText}>Click to view pdf</Text>
                                            </TouchableWithoutFeedback>
                                        }
                                        {
                                            data.file_type == "video" && <TouchableWithoutFeedback onPress={() => this.playVideo(data.user_file)}><Text style={styles.playText}>Play Video</Text></TouchableWithoutFeedback>
                                        }
                                    </View>
                                    <Divider />
                                    <View style={{ padding: 5 }} />
                                    <View style={{ paddingBottom: hp('1') }}>
                                        <View style={{ width: wp('30') }}>
                                            <Text style={styles.headerName}>Marks  </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headerValue}>{data.student_points} / {data.noofpoints}</Text>
                                        </View>
                                    </View>
                                    <Divider />
                                    <View style={{ padding: 5 }} />
                                    <View style={{ paddingBottom: hp('1') }}>
                                        <View style={{ width: wp('30') }}>
                                            <Text style={styles.headerName}>Remarks  </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headerValue}>{data.remark}</Text>
                                        </View>
                                    </View>
                                    <View style={{ padding: 5 }} />
                                </View>
                            }
                        </Card>
                        {
                            !data.corrected_status && this.props.route.params.status != 'completed' && <View>
                                <View style={{ margin: '4%' }} />
                                <View style={styles.center}>
                                    <Button onPress={this.goToTaskAnswer} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="ANSWER" loader={this.state.btnLoader} />
                                </View>
                            </View>
                        }
                    </View>
                    <View style={{ margin: '13%' }} />
                </ScrollView>
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
    aboutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        margin: '6%',
        padding: 20,
    },
    card11: {
        height: 90,
        width: 90,
        backgroundColor: "#FCBC0F",
        borderRadius: 90 / 2,
        alignItems: "center",
        justifyContent: "center"
    },
    card1: {
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        margin: '6%',
        padding: 20,

    },
    cardImage: {
        flex: 1,
        alignItems: 'flex-end'
    },
    menuImage: {
        width: 50,
        height: 50
    },
    cardText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#868686',

    },
    cardText1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,

    },
    cardTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
    },
    row: {

        flexDirection: 'row'
    },
    profileImage: {
        width: 20,
        height: 20
    },
    round: {
        height: 16,
        width: 16,
        borderRadius: 16 / 2,
        backgroundColor: 'green',
        padding: '2%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cloudClassContainer: {
        backgroundColor: '#d31d33',
        justifyContent: 'center',
        alignItems: 'center',
        height: 17,
        padding: '4%',
        borderRadius: 5
    },
    cloudText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff',
    },
    countMainContainer: {
        position: 'absolute',
        right: -13,
        bottom: 11
    },
    cloudContainer: {
        marginLeft: wp('5'),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2%'
    },
    activeText: {
        fontFamily: 'Poppins-SemiBold',
        color: 'green'
    },
    dividerContainer: {
        marginTop: 5,
        marginBottom: 5
    },
    packageName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13
    },
    subjectContainer: {


    },
    headerName: {
        fontFamily: 'Poppins-SemiBold',
        color: '#868686',
        fontSize: 13
    },
    card1: {
        width: wp('37'),
        borderRadius: 6,
        elevation: 1,
    },
    cardSubject: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,

    },
    userContainer: {
        position: 'absolute',
        top: 60,
        right: 50
    },
    profileImage: {
        width: 75,
        height: 80
    },
    studentNameContainer: {
        zIndex: 99999,
        backgroundColor: '#ffffff',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 8
    },
    cardText1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
    },
    cardText2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#868686'
    },
    headerValue: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
    },
    pdfText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: 'blue',
        marginLeft: 3
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    playText: {
        fontFamily: 'Poppins-SemiBold',
        color: 'blue',
        fontSize: 13
    },
    taskId: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: "#fff"
    },
    coinText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        textAlign: "center"
    },
    coinImage: {
        width: 30,
        height: 30
    },
    coinsText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 13,
        bottom: 10
    }
})