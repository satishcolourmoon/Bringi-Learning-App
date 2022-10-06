import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../components/Loader';
import Button from './Button';
import qs from 'qs';
import { baseUrl } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
var moment = require('moment');
export default class ViewSchedule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            type: 1,
            details: {}
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.getSchedule(student_id);
        })
    }
    getSchedule = (student_id) => {
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'get_scheduledlist',
                student_id: student_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status) {
                    this.setState({ loader: false, details: json.data });
                } else {
                    this.setState({ loader: false });
                }
            })
            .catch((error) => {
                this.setState({ loader: false, showAlert: true, error_message: "Unknown error occured" });
            });
    }

    goBack = () => {
        this.props.navigation.navigate('ScheduleWork');
    }
    goToSchedule = () => {
        this.props.navigation.navigate('ScheduleWork');
    }
    render() {
        let time = moment(this.state.details.select_time).format('h:mm a');

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
                <View style={styles.center}>
                    <Card containerStyle={styles.card}>
                        <View style={styles.center}>
                            <Image source={require('../../assets/swi.png')} style={styles.alaramImage} />
                        </View>
                        <View style={styles.center}>
                            <Text style={styles.cardText}>Your Daily Learning Routine</Text>
                            <Text style={styles.time}>{time}</Text>
                        </View>
                        <View style={{ marginTop: '2%', justifyContent: 'center', alignItems: 'center' }}>
                            <Button onPress={this.goToSchedule} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="EDIT" />
                        </View>
                    </Card>
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
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center'
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
    cardText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
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
    alaramImage: {
        width: 100,
        height: 100
    },
    time: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 23,
        color: '#b69fef'
    }
})