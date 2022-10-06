import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView, Picker, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../Loader';
import Header from '../../common/Header';
import { apiCall } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
export default class ScheduleVideoCalls extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            type: 1,
            subjects: [],
            selectedId: '',
            dates: [],
            time_slots: [],
            selectedDate: '',
            time_slot: '',
            student_id: '',
            topic: '',
            chapter: '',
            showAlert: false,
            video_calls: 0,
            error_message: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id }, () => {
                this.getSubjectsList(student_id);
                this.getTotalVideoCalls(student_id);
            })

        })
    }

    getSubjectsList = async (student_id) => {
        let postData = {
            action: 'subscribedSubjectlist',
            student_id: student_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, subjects: [] });
        } else if (json.status) {
            this.setState({ loader: false, subjects: json.subjects, selectedId: json.subjects[0].id }, () => {
                this.getDates(json.subjects[0].id);
            });
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

    getDates = async (subject_id) => {
        this.setState({ loader: true })
        let postData = {
            student_id: this.state.student_id,
            subject_id: subject_id,
            action: 'student_available_dates'
        }
        const json = await apiCall(postData);
        this.setState({ loader: false })
        if (json.status) {
            this.setState({ dates: json.data })
        } else {
            this.setState({ dates: [] })
        }
    }

    handleSelectedDate = async (date) => {
        let selectedDateArr = date.split(',');
        this.setState({
            date_id: selectedDateArr[0],
            coach_id: selectedDateArr[1],
            date: selectedDateArr[2],
            selectedDate: date
        }, () => {
            this.getTimeSlots(selectedDateArr[0], selectedDateArr[1]);
        })
    }

    getTimeSlots = async (date_id, coach_id) => {
        this.setState({ loader: true })
        let postData = {
            coach_id,
            date_id,
            student_id: this.state.student_id,
            action: 'student_available_time_slots'
        }
        const json = await apiCall(postData);
        if (json) {
            this.setState({ time_slots: json.data, loader: false })
        } else {
            this.setState({ time_slots: [], loader: false })
        }
    }

    goBack = () => {
        this.props.navigation.navigate('Home');
    }

    goToSchedule = async () => {
        if (this.state.selectedId) {
            if (this.state.date) {
                if (this.state.time_slot) {
                    if (this.state.chapter) {
                        if (this.state.topic) {
                            this.setState({ loader: true });
                            let postData = {
                                student_id: this.state.student_id,
                                subject_id: this.state.selectedId,
                                date: this.state.date,
                                timeslot: this.state.time_slot,
                                chapter: this.state.chapter,
                                topic: this.state.topic,
                                coach_id: this.state.coach_id,
                                action: 'create_student_schedule'
                            }
                            const json = await apiCall(postData);
                            if (json.status) {
                                this.setState({ showAlert: true, error_message: json.message, loader: false });
                                setTimeout(() => {
                                    this.props.navigation.navigate('Home');
                                }, 1000)
                            } else {
                                this.setState({ showAlert: true, error_message: json.message, loader: false });
                            }
                        } else {
                            this.setState({ showAlert: true, error_message: 'Please enter description' });
                        }
                    } else {
                        this.setState({ showAlert: true, error_message: 'Please enter worksheet id' });
                    }
                } else {
                    this.setState({ showAlert: true, error_message: 'Please select your time slot' });
                }
            } else {
                this.setState({ showAlert: true, error_message: 'Please select your date' });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Please select your subject' });
        }

    }

    goToUpcommingVideoCalls = () => {
        this.props.navigation.navigate('UpcommingVideoCalls');
    }

    goToPreviousVideoCalls = () => {
        this.props.navigation.navigate('PreviousVideoCalls');
    }

    selectSubject = (id) => {
        this.setState({ selectedId: id }, () => {
            this.getDates(id)
        })
    }

    goToAddVideoCalls = () => {
        this.props.navigation.navigate('AddVideoCalls');
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
                <Header title="1:1 Video calls" title1="" backScreen="SheetVideo" headerImage="vc" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <View style={{ margin: 7 }} />
                    <View style={styles.row}>
                        <View style={styles.selectContainer}>
                            <Text style={styles.heading1}>Available Calls : {this.state.video_calls}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableWithoutFeedback onPress={this.goToAddVideoCalls}>
                                <View style={styles.addCoinContainer}>
                                    <Text style={styles.addCoinText}> + Add Calls  </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.aboutContainer}>
                        <View style={styles.tabContianer}>
                            <TouchableWithoutFeedback onPress={this.goToUpcommingVideoCalls}>
                                <View style={styles.tab}>
                                    <Text style={styles.tabText1}>UPCOMING</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.tab3}>
                                <Text style={styles.tabText}>SCHEDULE</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={this.goToPreviousVideoCalls}>
                                <View style={styles.tab}>
                                    <Text style={styles.tabText1}>PREVIOUS</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.secondContainer}>
                        <View style={styles.horizontalContainer}>
                            <View style={styles.row}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {
                                        this.state.subjects.map((item, index) => {
                                            return (
                                                <TouchableWithoutFeedback onPress={() => { this.selectSubject(item.id) }}>
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
                        <ScrollView>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Select Date</Text>
                                <View style={styles.inputContainer2}>
                                    <Picker
                                        selectedValue={this.state.selectedDate}
                                        style={{ height: 48, width: wp('75') }}
                                        onValueChange={(selectedDate) => this.handleSelectedDate(selectedDate)}
                                    >
                                        <Picker.Item label="Select date" value="" />
                                        {
                                            this.state.dates.map((item) => {
                                                return (
                                                    <Picker.Item label={item.dates} value={item.id + "," + item.coach_id + "," + item.dates} key={item.id} />
                                                )
                                            })
                                        }
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Select Time slots</Text>
                                <View style={styles.inputContainer2}>
                                    <Picker
                                        selectedValue={this.state.time_slot}
                                        style={{ height: 48, width: wp('75') }}
                                        onValueChange={(time_slot) => this.setState({ time_slot })}
                                    >
                                        <Picker.Item label="Select time slots" value="" />
                                        {
                                            this.state.time_slots.map((item) => {
                                                return (
                                                    <Picker.Item label={item.start_time + "-" + item.end_time} value={item.start_time + "-" + item.end_time} key={item.id} />
                                                )
                                            })
                                        }
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Worksheet id</Text>
                                <View style={styles.inputContainer1}>
                                    <TextInput
                                        placeholder=""
                                        style={styles.input1}
                                        onChangeText={(chapter) => this.setState({ chapter })}
                                        value={this.state.chapter}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Description</Text>
                                <View>
                                    <View style={styles.inputContainer1}>
                                        <TextInput
                                            placeholder=""
                                            style={styles.input1}
                                            onChangeText={(topic) => this.setState({ topic })}
                                            value={this.state.topic}
                                            multiline={true}
                                            numberOfLines={5}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ padding: 15 }} />
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    <View style={styles.proceedContainer}>
                        <TouchableWithoutFeedback onPress={this.goToSchedule}>
                            <Text style={styles.proceedText}>SCHEDULE </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
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
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
    bottomCurve: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('12')
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
    tab3: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('30'),
        backgroundColor: '#ac90e7',
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
        width: wp('66'),
        marginLeft: 25,

    },
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#df2238'
    },
    addCoinMainContainer: {
        position: 'absolute',
        right: 0,
        top: 10
    },
    addCoinContainer: {
        backgroundColor: '#ef1718',
        padding: '1%',
        width: wp('32'),
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addCoinText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff',
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
    inputContainer: {
        marginTop: '3%',
    },
    timeContainer: {
        backgroundColor: '#ececec',
        height: hp('6.5'),
        width: wp('42'),
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%'
    },
    timeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
    },
    row: {
        flexDirection: 'row'
    },
    proceedContainer: {
        position: 'absolute',
        right: 20,
        bottom: 15
    },
    proceedText: {
        fontFamily: 'Poppins-SemiBold',
        marginLeft: wp('4'),
        color: '#ffffff',
        fontSize: 15
    },
    horizontalContainer: {
        marginBottom: 15
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
    inputContainer2: {
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