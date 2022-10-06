import React from 'react';
import { View, StyleSheet, StatusBar, TouchableWithoutFeedback, Text, FlatList, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import Nodata from '../../common/NoData';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils'
export default class PendingVideoSheets extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            student_id: '',
            data: [],
            showAlert: false,
            error_message: '',
            subjects: [],
            selectedId: ''
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id }, () => {
                this.getSubjectsList(student_id)
            })
        })
    }
    getSheetList = async (student_id, subject_id) => {
        this.setState({ loader: true })
        let postData = {
            student_id: student_id,
            action: 'getstudent_pendingvideos',
            subject_id
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ loader: false, data: json.sheets });
        } else {
            this.setState({ loader: false, data: [] });
        }
    }
    goBack = () => {
        this.props.navigation.navigate('SheetMenu');
    }
    goToReportCard = (id, status) => {
        if (status == "Corrected") {
            this.props.navigation.navigate('SheetReportDetails', {
                sheet_id: id
            })
        } else {
            this.setState({ showAlert: true, error_message: 'Please submit your video' })
        }
    }
    goToSubmittedSheets = () => {
        this.props.navigation.navigate('VideoSheetStatus', {
            subject_id: this.state.selectedId
        })
    }
    getSubjectsList = async (student_id) => {
        const { subject_id } = this.props.route.params;
        this.setState({ loader: true })
        let postData = {
            action: 'studentPackewiseSubjects',
            student_id: student_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, subjects: [] });
        } else if (json.status) {
            this.setState({ loader: false, subjects: json.sheets, selectedId: subject_id ? subject_id : json.sheets[0].id }, () => {
                this.getSheetList(student_id, subject_id ? subject_id : json.sheets[0].id)
            });
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
                <StatusBar hidden />
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
                <Header title="Pending" title1="Video Status" backScreen="SheetVideoMenu" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={styles.horizontalContainer}>
                    <View style={styles.row}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.state.subjects.map((item, index) => {
                                    return (
                                        <TouchableWithoutFeedback onPress={() => { this.setState({ selectedId: item.id }, () => { this.getSheetList(this.state.student_id, item.id) }) }}>
                                            <View key={item.id}>
                                                <View style={styles.round}>
                                                    <View>
                                                        <Image source={{ uri: item.image }} style={styles.icon1} />
                                                    </View>
                                                </View>
                                                <View style={styles.center}>
                                                    <Text style={this.state.selectedId == item.id ? styles.circleText1 : styles.circleText}>{item.subject_name}</Text>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={{ flex: 0.9 }}>
                    <View style={styles.secondContainer}>
                        <View style={styles.aboutContainer}>
                            <View style={styles.tabContianer}>
                                <TouchableWithoutFeedback onPress={this.goToSubmittedSheets}>
                                    <View style={styles.tab}>
                                        <Text style={styles.tabText1}>SUBMITTED VIDEOS</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={styles.tab2}>
                                    <Text style={styles.tabText}>PENDING VIDEOS</Text>
                                </View>
                            </View>
                        </View>
                        <FlatList
                            data={this.state.data}
                            ListEmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Nodata title="No videos Found.Please check back later" />
                                </View>
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableWithoutFeedback onPress={() => this.goToReportCard(item.id, item.status)} key={item.id}>
                                        <Card containerStyle={styles.card}>
                                            <View style={styles.row}>
                                                <View style={{ width: wp('55') }}>
                                                    <View style={styles.cardTitle}>
                                                        <Text style={styles.cardText1}>{item.qr_code}</Text>
                                                        <Text style={styles.cardText2}>{item.chapter_id}</Text>
                                                        <Text style={styles.cardText3}>{item.topic_id}</Text>
                                                        <Text style={styles.date}>Date: {item.created_date}</Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    <Text style={item.status == "Corrected" ? styles.status1 : styles.status}>{item.status}</Text>
                                                </View>
                                            </View>
                                        </Card>
                                    </TouchableWithoutFeedback>
                                )
                            }}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ backgroundColor: '#ffffff', paddingBottom: hp('10') }}
                        />
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
        height: hp('11')
    },
    aboutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '4%'
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
        width: wp('88'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
    },
    cardTitle: {
        justifyContent: 'center',
        marginLeft: '2%'
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
    },
    cardText2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#804681'
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
    row: {
        flexDirection: 'row'
    },
    round: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        backgroundColor: '#c12b4e',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2%',
    },
    icon: {
        width: 50,
        height: 50
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
    },
    circleText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#c72e42'
    },
    profileImage: {
        width: 75,
        height: 80
    },
    tabContianer: {
        backgroundColor: '#eeeeee',
        flexDirection: 'row',
        borderRadius: 30
    },
    tab: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('46'),
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('46'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('46'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab2: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('46'),
        backgroundColor: '#ac90e7',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30
    },
    tabText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#ffffff',
    },
    tabText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
    },
    cardText3: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#757575'
    },
    date: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#d4414b'
    },
    status: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: 'red'
    },
    status1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: 'green'
    },
    icon1: {
        width: 50,
        height: 50
    },
})
