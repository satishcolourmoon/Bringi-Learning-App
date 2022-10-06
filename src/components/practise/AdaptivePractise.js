import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import AwesomeAlert from 'react-native-awesome-alerts';
import Asyncstorage from '@react-native-community/async-storage';

export default class SelectSubject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            showAlert1: false,
            error_message1: '',
            student_id: ''
        }
    }

    componentDidMount() {
        Asyncstorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id })
        })
    }

    goBack = () => {
        this.props.navigation.navigate('OnlineMenu');
    }

    goToSubject = () => {
        this.props.navigation.navigate('OnlineExams');
    }

    goToGuideVideos = () => {
        this.props.navigation.navigate('GuideVideos', {
            sheet_id: this.props.route.params.qr_code,
            backScreen: 'LearningGuide'
        })
    }

    goToReport = async () => {
        this.setState({ loader: true })
        if (this.props.route.params.screen == "Adaptive") {
            let postData = {
                action: 'adapative_sheet_wise_report',
                student_id: this.state.student_id,
                sheet_id: this.props.route.params.sheet_id
            }
            const json = await apiCall(postData);
            if (json.status) {
                this.setState({
                    loader: false
                }, () => {
                    this.props.navigation.navigate('AdaptiveSheetReportDetails', {
                        sheet_id: this.props.route.params.sheet_id
                    });
                })
            } else {
                this.setState({ loader: false, showAlert2: true, error_message2: 'Report not yet generated.Please submit your exam', saveLoader: true });
            }
        } else if (this.props.route.params.screen == "Extra") {
            let postData = {
                action: 'student_extra_practice_report',
                student_id: this.state.student_id,
                sheet_id: this.props.route.params.qr_code
            }
            const json = await apiCall(postData);
            if (json.status) {
                this.setState({
                    loader: false
                }, () => {
                    this.props.navigation.navigate('ExtraPractiseReportDetails', {
                        sheet_id: this.props.route.params.qr_code
                    });
                })
            } else {
                this.setState({ loader: false, showAlert2: true, error_message2: 'Report not yet generated.Please submit your exam', saveLoader: true });
            }
        }
    }

    goToPractise = () => {
        if (this.props.route.params.screen == "Adaptive") {
            this.props.navigation.navigate('OnlinePratiseQuestionPaper', {
                qr_code: this.props.route.params.qr_code,
                sheet_id: this.props.route.params.qr_code,
                screen: this.props.route.params.screen,
                subject_id: this.props.route.params.subject_id,
                subject_name: this.props.route.params.subject_name
            })
        } else if (this.props.route.params.screen == "Extra") {
            this.props.navigation.navigate('ExtraPratiseQuestionPaper', {
                qr_code: this.props.route.params.qr_code,
                sheet_id: this.props.route.params.qr_code,
                screen: this.props.route.params.screen,
                subject_id: this.props.route.params.subject_id,
                subject_name: this.props.route.params.subject_name
            })
        }
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
                    show={this.state.showAlert1}
                    title="Attention!"
                    message={this.state.error_message1}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({ showAlert1: false });
                    }}
                />
                <StatusBar hidden />
                <Header title="Online" title1="Practice" backScreen="Home" headerImage="submitSheet" navigation={this.props.navigation} />
                <View style={styles.secondContainer}>
                    <View style={styles.aboutContainer}>
                        <TouchableWithoutFeedback onPress={this.goToGuideVideos}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText1}>LEARN</Text>
                                    <View style={styles.nextContainer}>
                                        <Image source={require('../../../assets/next.png')} style={styles.icon} />
                                    </View>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToPractise}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText1}>PRACTICE</Text>
                                    <View style={styles.nextContainer}>
                                        <Image source={require('../../../assets/next.png')} style={styles.icon} />
                                    </View>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToReport}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText1}>Report</Text>
                                    <View style={styles.nextContainer}>
                                        <Image source={require('../../../assets/next.png')} style={styles.icon} />
                                    </View>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
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
        flex: 1,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('15')
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
        width: wp('86'),
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
    secondContainer: {
        alignItems: 'center',
        flex: 0.9
    }

})