import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import TextInput from './TextInputs';
import Button from './Button';
import qs from 'qs';
import { baseUrl } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReactNativeAN from 'react-native-alarm-notification';
var moment = require('moment')
export default class ScheduleWork extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            showAlert: false,
            error_message: '',
            student_id: '',
            select_time: new Date(),
            showPicker: false
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id });
        })
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    goToEditSchedule = () => {
        this.props.navigation.navigate('ViewSchedule');
    }
    ScheduleWork = (local) => {
        if (local) {
            this.setState({ loader: true, error_message: '' });
            fetch(baseUrl + 'user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify({
                    action: 'schedule_time',
                    student_id: this.state.student_id,
                    select_time: local
                })
            }).then((response) => response.json())
                .then((json) => {
                    this.setState({ loader: false });
                    if (!json.status) {
                        this.setState({ showAlert: true, error_message: json.message });
                    } else if (json.status) {
                        const alarmNotifData = {
                            title: "Attention",
                            message: "Work Schedule Alert",
                            channel: "my_channel_id",
                            small_icon: "ic_launcher",
                            has_button: true,
                            vibration: 100,
                            auto_cancel: true,
                            volume: 1,
                            bypass_dnd: true,
                            schedule_type: 'repeat',
                            repeat_interval: 'daily',
                            schedule_once: true,
                            vibrate: false
                        };
                        var formattedDate = moment(local).format('DD-MM-yyyy HH:mm:ss');
                        ReactNativeAN.scheduleAlarm({ ...alarmNotifData, fire_date: formattedDate });
                        this.setState({ showAlert: true, error_message: "Scheduled successfully" });
                        setTimeout(() => { this.props.navigation.navigate('Home') }, 1200);
                    }
                })
                .catch((error) => {
                    this.setState({ showAlert: true, error_message: "Unknown error occured" });
                });
        } else {
            this.setState({ showAlert: true, error_message: 'Time is required' });
        }
    }
    onChange = (e) => {
        if (e.type == "set") {
            var select_time = new Date(e.nativeEvent.timestamp);
            var local_time = moment.utc(select_time).toDate();
            var local = moment(local_time).local().format('YYYY-MM-DD HH:mm:ss');
            this.setState({ showPicker: false }, () => { this.ScheduleWork(local) })
        }
    }
    showTimePicker = () => {
        this.setState({ showPicker: true });
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
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image source={require('../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>Schedule Work</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/sb.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>YOUR DAILY LEARNING ROUTINE</Text>
                    <TouchableWithoutFeedback onPress={this.showTimePicker}>
                        <View style={styles.inputContainer1}>
                            <Text>Select time</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        {
                            this.state.showPicker && <DateTimePicker
                                testID="dateTimePicker"
                                value={this.state.select_time}
                                mode={'time'}
                                is24Hour={false}
                                onChange={this.onChange}
                            />
                        }
                    </View>
                    <View style={{ marginTop: '2%', justifyContent: 'center', alignItems: 'center' }}>
                        <Button onPress={this.goToEditSchedule} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="SUBMIT" />
                    </View>
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
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
    statusText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        color: '#ffffff'
    },
    statusContainer: {
        backgroundColor: '#1cc800',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        borderRadius: 8
    },
    statusContainer1: {
        backgroundColor: '#f61511',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        borderRadius: 8
    },
    inputContainer: {
        marginTop: '3%',
        marginLeft: wp('7'),
        marginRight: wp('7')
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
        margin: '0.4%',
        padding: '4%'
    }
})