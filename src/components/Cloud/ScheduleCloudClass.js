import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, FlatList, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import AsyncStorage from '@react-native-community/async-storage';
import { apiCall } from '../../utils';
import Nodata from '../../common/NoData';
import AwesomeAlert from 'react-native-awesome-alerts';
export default class ScheduleCloudClasses extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            type: 1,
            data: [],
            video_calls: '',
            showAlert: false,
            error_message: '',
            student_id: '',
            class_id: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            AsyncStorage.getItem('class_id').then((class_id) => {
                this.setState({ student_id, class_id }, () => {
                    this.getScheduleCloudClasses(student_id, class_id);
                });

            });
        })
    }

    getScheduleCloudClasses = async (student_id, class_id) => {
        let postData = {
            student_id,
            action: 'schedule_cloud_classess',
            class_id
        }
        const json = await apiCall(postData);
        this.setState({ loader: false });
        if (json.status) {
            this.setState({ data: json.data, loader: false })
        } else {
            this.setState({ loader: false, data: [] })
        }
    }

    goToScheduleCloudClass = () => {
        this.props.navigation.navigate('ScheduleCloudClass');
    }

    goToUpcommingCalls = () => {
        this.props.navigation.navigate('CloudClasses');
    }

    goToMeeting = (url) => {
        if (url && url != "") {
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    alert("Don't know how to open URI: " + url);
                }
            });
        } else {
            this.setState({ showAlert: true, error_message: "Meeting not yet created.Please try after some time" });
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
                <Header title="Cloud class" title1="" backScreen="SheetVideo" headerImage="vc" navigation={this.props.navigation} />
                <View style={styles.aboutContainer}>
                    <View style={styles.tabContianer}>
                        <TouchableWithoutFeedback onPress={this.goToUpcommingCalls}>
                            <View style={styles.tab}>
                                <Text style={styles.tabText1}>UPCOMING CLASS</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.tab2}>
                            <Text style={styles.tabText}>SCHEDULED CLASS</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.9 }}>
                    <View style={styles.center}>
                        <FlatList
                            data={data}
                            ListEmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Nodata title="No data Found.Please check back later" />
                                </View>
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <Card containerStyle={styles.card}>
                                        <View style={styles.cardFirstContainer}>
                                            <View style={styles.row}>
                                                <View style={styles.firsthContainer}>
                                                    <Text style={styles.firstCText}>{item.subject}</Text>
                                                    <Text style={styles.date}>{item.start_date} {item.start_time}</Text>
                                                </View>
                                                <View>
                                                    <TouchableWithoutFeedback onPress={() => { this.goToMeeting(item.link) }}>
                                                        <View style={styles.reserverContainer}>
                                                            <Text style={styles.reserveText}>ATTEND</Text>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ padding: 10 }}>
                                            <View style={styles.cardTitle}>
                                                <Text style={styles.cardText1}>{item.chapter}</Text>
                                            </View>
                                            <View style={{ width: wp('55') }}>
                                                <Text style={styles.desc}>{item.class}</Text>
                                            </View>
                                            <Text style={styles.time}>Duration : {item.duration}</Text>
                                        </View>
                                    </Card>
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
    row: {
        flexDirection: 'row'
    },
    firsthContainer: {
        width: wp('53'),

    },
    reserverContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12
    },
    cardFirstContainer: {
        backgroundColor: '#ef1718',
        padding: 10,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12
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
        marginTop: '6%'
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
    date: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        color: '#fff'
    },
    descContainer: {
        marginLeft: wp('4'),
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
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
        width: wp('45'),
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('50'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('45'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab2: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('50'),
        backgroundColor: '#ac90e7',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30
    },
    tabText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#ffffff',
    },
    tabText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#000000',
    },
    firstCText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#fff',
    },
    card: {
        width: wp('88'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,

        padding: 0
    },
    cardTitle: {
        flexDirection: 'row'
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#000000'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    desc: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#757575'
    },
    time: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#88428b'
    },
    statusText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#ffffff'
    },
    statusContainer: {
        backgroundColor: '#ef1718',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6%',
        borderRadius: 8
    },
    selectContainer: {
        marginLeft: wp('7'),
        marginTop: '2%',
        flexDirection: 'row'
    },
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#df2238'
    },
    addCoinMainContainer: {
        position: 'absolute',
        right: 0,
        top: 160
    },
    addCoinContainer: {
        backgroundColor: '#ef1718',
        padding: '3%',
        width: wp('28'),
        height: 30,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addCoinText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff',
    },
    reserveText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    }
})