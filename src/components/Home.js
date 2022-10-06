import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, ScrollView, NativeEventEmitter, NativeModules, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, Card, Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader';
const { RNAlarmNotification } = NativeModules;
const RNAlarmEmitter = new NativeEventEmitter(RNAlarmNotification);
import ReactNativeAN from 'react-native-alarm-notification';
import { Drawer } from 'native-base';
import SideBar from './SideBar';
import { apiCall } from '../utils';

export default class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            student_name: '',
            payment_done: '',
            data: [],
            gender: "",
            displayData: [],
            display_image: ""
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_name').then((student_name) => {
            AsyncStorage.getItem('student_id').then((student_id) => {
                AsyncStorage.getItem('payment_done').then((payment_done) => {
                    this.setState({ student_name: student_name, payment_done: payment_done }, () => {
                        this.updateCompletedExamStatus(student_id);
                        this.getAppMenu(student_id)
                    });
                })
            })
        });
        AsyncStorage.getItem('gender').then((gender) => {
            this.setState({ gender: gender })
        })
        RNAlarmEmitter.addListener(
            'OnNotificationDismissed', (data) => ReactNativeAN.removeAllFiredNotifications()
        );
        RNAlarmEmitter.addListener(
            'OnNotificationOpened', (data) => ReactNativeAN.removeAllFiredNotifications()
        );
    }

    DismissNotification = () => {
        ReactNativeAN.removeAllFiredNotifications();
    }

    componentWillUnmount() {
        RNAlarmEmitter.addListener(
            'OnNotificationDismissed', (data) => ReactNativeAN.removeAllFiredNotifications()
        ).remove()
        RNAlarmEmitter.addListener(
            'OnNotificationOpened', (data) => ReactNativeAN.removeAllFiredNotifications()
        ).remove()
    }

    updateCompletedExamStatus = async (student_id) => {
        let postData = {
            user_id: student_id,
            action: 'updatetest_status'
        }
        const json = await apiCall(postData);
        this.setState({ loader: false });
        if (json.status) {
            console.log('Exam status updated to completed')
        }
    }
    getAppMenu = async (student_id) => {
        let postData = {
            action: 'getAppmenu',
            user_id: student_id
        }
        const json = await apiCall(postData);
        this.setState({ loader: false });
        if (json.status) {
            this.setState({ displayData: json.data, display_image: json.display_image });
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    closeDrawer = () => {
        this.drawer._root.close()
    };

    renderLeftHeader = () => {
        return (
            <View style={styles.row}>
                <TouchableWithoutFeedback onPress={this.openDrawer}>
                    <Image source={require('../../assets/bar.png')} style={styles.icon} />
                </TouchableWithoutFeedback>
                <Image source={require('../../assets/hlogo.png')} style={styles.headerLogo} />
            </View>
        )
    }

    renderRightHeader = (props) => {
        return (
            <View style={styles.row}>
                <TouchableWithoutFeedback onPress={() => { props.navigate('SwitchStudent') }}>
                    <Icon name="exchange" type="font-awesome" color="#ffffff" size={25} style={{ marginRight: wp('1') }} />
                </TouchableWithoutFeedback>
            </View>
        )
    }
    goToDetails = (url) => {
        this.props.navigation.navigate(url)
    }
    goToLearningAnalysis = () => {
        this.props.navigation.navigate('LearningAnalysis')
    }
    openDrawer = () => {
        this.drawer._root.open()
    };
    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <Drawer ref={(ref) => { this.drawer = ref; }} content={<SideBar navigation={this.props.navigation} />} onClose={() => this.closeDrawer()} >
                <View style={styles.container}>
                    <StatusBar hidden />
                    <Header
                        leftComponent={() => this.renderLeftHeader()}
                        rightComponent={() => this.renderRightHeader(this.props.navigation)}
                        containerStyle={styles.header}
                    />
                    <View>
                        <Image source={require('../../assets/tcurve.png')} resizeMode="stretch" style={styles.topCurveImage} />
                        <View style={styles.profileMainContainer}>
                            <View style={styles.profileImageContainer}>
                                <View style={styles.round1}>
                                    <View style={styles.round2}>
                                        {
                                            (
                                                this.state.display_image ?
                                                    <Image source={{ uri: this.state.display_image }} style={styles.profileImage} /> :
                                                    <View>
                                                        {
                                                            this.state.gender == "male" ?
                                                                <Image source={require('../../assets/Boy.png')} style={styles.profileImage} />
                                                                :
                                                                <Image source={require('../../assets/Girl.png')} style={styles.profileImage} />
                                                        }
                                                    </View>
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                        {
                            this.state.payment_done == "yes" ?
                                <View style={styles.reportContainer}>
                                    <View style={styles.profileMainContainer}>
                                        <TouchableWithoutFeedback onPress={this.goToLearningAnalysis}>
                                            <Image source={require('../../assets/report.png')} style={styles.reportImage} />
                                        </TouchableWithoutFeedback>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#7c3f82' }}>Reports</Text>
                                    </View>

                                </View> : null
                        }
                    </View>
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.day}>Good Day</Text>
                        <Text style={styles.name}>{this.state.student_name}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
                        <FlatList
                            data={this.state.displayData}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
                                        {
                                            (item.menu_type == "Dashboard Menu" && item.status == "Active") &&
                                            <View>
                                                <TouchableWithoutFeedback onPress={() => { this.goToDetails(item.url) }}>
                                                    <Card containerStyle={styles.card}>
                                                        <View style={styles.cardImage}>
                                                            <Image source={{ uri: item.image }} style={styles.menuImage} resizeMode="contain" />
                                                        </View>
                                                        <View style={styles.cardTitle}>
                                                            <Text style={styles.cardText}>{item.title}</Text>
                                                            <Text style={styles.cardText1}>{item.subtitle}</Text>
                                                        </View>
                                                    </Card>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        }
                                    </View>
                                )
                            }}
                            ListEmptyComponent={this.ListEmptyView}
                            keyExtractor={(item, index) => index}
                        />
                        <View style={{ padding: '8%' }}></View>
                    </View>
                    <View style={styles.bottomCurve}>
                        <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    </View>
                </View>
            </Drawer>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    header: {
        backgroundColor: '#b198eb',
        borderBottomColor: '#b198eb'
    },
    row: {
        flexDirection: 'row'
    },
    headerLogo: {
        width: 78,
        height: 30,
        marginLeft: wp('7')
    },
    icon: {
        width: 25,
        height: 25,
    },
    icon1: {
        width: 25,
        height: 25,
        marginLeft: wp('7')
    },
    profileImage: {
        width: 100,
        height: 100
    },
    profileImageContainer: {
        position: 'absolute',
        bottom: 0
    },
    profileMainContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileTextContainer: {
        marginTop: '1%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    day: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13
    },
    name: {
        fontFamily: 'Poppins-SemiBold',
        color: '#7c3f82',
        fontSize: 17
    },
    secondContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '3%'
    },
    reportContainer: {
        position: 'absolute',
        right: 35,
        top: 53
    },
    reportImage: {
        width: 45,
        height: 45
    },
    bottomCurve: {
        flex: 0.1,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('11')
    },
    card: {
        width: wp('40'),
        height: hp('16'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        margin: '2%',
        marginBottom: "3%"
    },
    cardImage: {
        flex: 1,
        alignItems: 'flex-end'
    },
    menuImage: {
        width: 50,
        height: 50
    },
    cardTitle: {
        marginTop: hp('5')
    },
    cardText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13
    },
    round1: {
        width: 130,
        height: 130,
        borderRadius: 130 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    round2: {
        backgroundColor: '#e9e9e9',
        width: 120,
        height: 120,
        borderRadius: 130 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cloudImage: {
        width: 35,
        height: 35
    },
    cloudContainer: {
        marginLeft: wp('6'),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2%'
    },
    letterMainContainer: {
        marginLeft: wp('6'),
        marginTop: hp('2')
    },
    cloudClassContainer: {
        backgroundColor: '#d31d33',
        justifyContent: 'center',
        alignItems: 'center',
        height: 17,
        padding: '2%',
        marginTop: hp('1'),
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    cloudText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 9,
        color: '#ffffff',
    },
    countMainContainer: {
        position: 'absolute',
        right: -13,
        bottom: 11
    },
    countContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7e3086',
        width: 22,
        height: 22,
        borderRadius: 22 / 2,
        padding: '1%'
    },
    count: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
        color: '#ffffff',
    },
    letterContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ef1718',
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        padding: '1%'
    },
    letter: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 23,
        color: '#ffffff',
    },
    coinsContainer: {
        position: 'absolute',
        top: 15,
        left: 6
    },
    coinImage: {
        width: 30,
        height: 30
    },
    coinNumberContinaer: {
        justifyContent: 'center',
        marginLeft: '2%'
    },
    coinNunber: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 17,
        color: '#ffffff',
    }
})