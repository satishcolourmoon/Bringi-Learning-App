import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, FlatList, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import AsyncStorage from '@react-native-community/async-storage';
import { apiCall } from '../../utils';
import Nodata from '../../common/NoData';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class PathToSuccess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            student_id: '',
            data: [],
            selectedId: 0,
            subjects: [],
            selected_name: '',
            showAlert: false,
            error_message: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id, loader: true }, () => {
                // this.getPathToSuccess(student_id);
                this.getSubjectsList(student_id);
            })
        });
    }

    getSubjectsList = async (student_id) => {
        let postData = {
            action: 'subscribedSubjectlist',
            student_id: student_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, subjects: [], selectedId: '', selected_name: '' });
        } else if (json.status) {
            this.setState({ subjects: json.subjects, selectedId: json.subjects[0].id, selected_name: json.subjects[0].title });
            this.getPathToSuccess(student_id, json.subjects[0].id)
        }
    }

    getPathToSuccess = async (student_id, selectedId) => {
        this.setState({ loader: true })
        let postData = {
            action: 'student_path_to_success',
            student_id,
            subject_id: selectedId
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, data: [] });
        } else if (json.status) {
            this.setState({ loader: false, data: json.path_to_success_list, selectedId: selectedId });
        }
    }

    goBack = () => {
        this.props.navigation.navigate('OnlineMenu');
    }

    goToDoubtsList = () => {
        this.props.navigation.navigate('DoubtsList');
    }

    goToQuestionPaper = () => {
        this.props.navigation.navigate('Questions');
    }

    startExam = (qr_code, id, test_status) => {
        if (test_status == "notcleared") {
            this.props.navigation.navigate('AdaptivePractise', {
                qr_code,
                screen: 'Adaptive',
                subject_id: this.state.selectedId,
                subject_name: this.state.selected_name,
                sheet_id: id
            });
        } else {
            this.setState({ showAlert: true, error_message: 'This exam has been cleared' }, () => {
                setTimeout(() => {
                    this.props.navigation.navigate('AdaptiveSheetReportDetails', {
                        sheet_id: id
                    })
                }, 1500)
            });
        }
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
                <AwesomeAlert
                    show={this.state.showAlert}
                    title="Attention!"
                    message={this.state.error_message}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({ showAlert: false });
                    }}
                />
                <StatusBar hidden />
                <Header title="Online" title1="Practice" backScreen="Home" headerImage="submitSheet" navigation={this.props.navigation} />
                <View style={styles.selectContainer}>
                    <Text style={styles.heading1}>Path to Success</Text>
                </View>
                <View style={{ flex: 0.9 }}>
                    <View style={styles.horizontalContainer}>
                        <View style={styles.row}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    this.state.subjects.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => { this.getPathToSuccess(this.state.student_id, item.id) }}>
                                                <View key={index}>
                                                    <View style={styles.round}>
                                                        <View>
                                                            <Image source={{ uri: item.image }} style={styles.icon} />
                                                        </View>
                                                    </View>
                                                    <View style={styles.center}>
                                                        <Text style={this.state.selectedId == item.id ? styles.circleText1 : styles.circleText}>{item.title}</Text>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                    <FlatList
                        data={data}
                        ListEmptyComponent={
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Nodata title="No data Found.Please check back later" />
                            </View>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableWithoutFeedback onPress={() => { this.startExam(item.worksheet_id, item.id, item.test_status) }}>
                                    <Card containerStyle={styles.card1}>
                                        <Text style={styles.pathTitle}>{item.topic}</Text>
                                        <Text style={styles.pathsubTitle}>{item.worksheet_id}</Text>
                                    </Card>
                                </TouchableWithoutFeedback>
                            )
                        }}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ backgroundColor: '#ffffff', paddingBottom: hp('10') }}
                    />
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
        width: 80,
        height: 80
    },
    scanImage: {
        width: 120,
        height: 120,
        position: 'absolute'
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
    card1: {
        width: wp('90'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        // marginLeft : wp('7')
    },
    pathTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    pathsubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
    horizontalContainer: {
        marginBottom: 8,
        marginLeft: 15
    },
    round: {
        width: 85,
        height: 85,
        borderRadius: 85 / 2,
        backgroundColor: '#c12b4e',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 50,
        height: 50
    },
    circleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
    },
    circleText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#c12b4e'
    },
})