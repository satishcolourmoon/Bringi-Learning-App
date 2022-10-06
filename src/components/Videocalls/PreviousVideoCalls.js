import React from 'react';
import { View, StyleSheet, StatusBar, TouchableWithoutFeedback, Text, ScrollView, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, Icon } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import Nodata from '../../common/NoData';

export default class PreviousVideoCalls extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            loader: true,
            type: 1,
            data: [],
            is_modal_visible: false,
            selected_id: '',
            rating: 1,
            btnLoader: false,
            remarks: '',
            student_id: '',
            video_calls: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id }, () => {
                this.getCompletedVideoCalls(student_id)
                this.getTotalVideoCalls(student_id)
            })
        })
    }

    goToUpcommingVideoCalls = () => {
        this.props.navigation.navigate('UpcommingVideoCalls');
    }

    goToScheduleVideoCalls = () => {
        this.props.navigation.navigate('ScheduleVideoCalls');
    }

    getCompletedVideoCalls = async (student_id) => {
        let postData = {
            student_id,
            action: 'student_previous_video_slots'
        }
        const json = await apiCall(postData);
        this.setState({ loader: false });
        if (json.status) {
            this.setState({ data: json.data })
        } else {
            this.setState({ data: [] })
        }
    }

    getTotalVideoCalls = async (student_id) => {
        let postData = {
            student_id,
            action: 'student_total_video_calls'
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ loader: false, video_calls: json.data.video_calls })
        } else {
            this.setState({ loader: false, video_calls: 0 })
        }
    }

    giveRating = (id) => {
        this.props.navigation.navigate('GiveRating', {
            video_id: id
        })
    }

    goToAddVideoCalls = () => {
        this.props.navigation.navigate('AddVideoCalls');
    }

    render() {
        const { data, video_calls } = this.state;
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <Header title="1:1 Video calls" title1="" backScreen="SheetVideo" headerImage="vc" navigation={this.props.navigation} />
                <View style={styles.selectContainer}>
                    <View style={{ width: wp('66') }}>
                        <Text style={styles.heading1}>Available Calls : {video_calls}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this.goToAddVideoCalls}>
                        <View>
                            <View style={styles.addCoinContainer}>
                                <Text style={styles.addCoinText}>+ Add Calls</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.aboutContainer}>
                    <View style={styles.tabContianer}>
                        <TouchableWithoutFeedback onPress={this.goToUpcommingVideoCalls}>
                            <View style={styles.tab}>
                                <Text style={styles.tabText1}>UPCOMING</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToScheduleVideoCalls}>
                            <View style={styles.tab}>
                                <Text style={styles.tabText1}>SCHEDULE</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.tab2}>
                            <Text style={styles.tabText}>PREVIOUS</Text>
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
                                    <Card containerStyle={styles.card} >
                                        {item.feedback_status !== true &&
                                            <View style={{ position: 'absolute', right: 0 }}>
                                                <TouchableWithoutFeedback onPress={() => this.giveRating(item.id)}>
                                                    <View style={styles.statusContainer}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Icon name="star" color="#ffffff" size={16} />
                                                            <Text style={styles.statusText}>GIVE RATING</Text>
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        }
                                        <View style={styles.cardTitle}>
                                            <Text style={styles.cardText1}>{item.student_name}</Text>
                                        </View>
                                        <Text style={styles.desc}>{item.topic}, {item.subject}</Text>
                                        <Text style={styles.time}>{item.date}</Text>
                                    </Card>
                                )
                            }}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ backgroundColor: '#ffffff', paddingBottom: hp('10') }}
                        />
                    </View>
                    <View style={{ padding: 20 }} />
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
    inputContainer: {
        marginTop: '3%',
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
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '2%'
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
        width: wp('30'),
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('30'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('30'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab2: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('30'),
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
    card: {
        width: wp('88'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
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
        fontSize: 12,
        color: '#ffffff'
    },
    statusContainer: {
        backgroundColor: '#ef1718',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4%',
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
        top: hp('23.5')
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
    modalcontainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 13
    },
    modalFirstContainer: {
        backgroundColor: '#ac90e7',
        padding: 7,
        width: wp('80'),
        borderRadius: 13
    },
    feedbackText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#fff'
    },
    star: {
        padding: 10,
    },
    cancelAbsoluteContainer: {
        position: 'absolute',
        zIndex: 99999,
        top: 0,
        right: 0
    }
})