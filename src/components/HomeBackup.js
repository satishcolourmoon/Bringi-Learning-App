import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, Card, Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import qs from 'qs';
import { baseUrl } from '../constants';
export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            student_name: '',
            payment_done: ''
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('student_name').then((student_name) => {
            AsyncStorage.getItem('student_id').then((student_id) => {
                AsyncStorage.getItem('payment_done').then((payment_done) => {
                    this.setState({ student_name: student_name, payment_done: payment_done }, () => { this.updateCompletedExamStatus(student_id) });
                })
            })
        });
    }
    updateCompletedExamStatus = (student_id) => {
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                user_id: student_id,
                action: 'updatetest_status'
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ loader: false });
                if (json.status) {
                    console.log('Exam status updated to completed')
                }
            })
            .catch((error) => {
                this.setState({ loader: false });
                console.error(error);
            });
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    openDrawer = () => {
        this.props.navigation.openDrawer();
    }
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
                    <Icon name="exchange" type="font-awesome" color="#ffffff" size={25} style={{ marginRight: wp('7') }} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <Image source={require('../../assets/bell.png')} style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <Image source={require('../../assets/cart.png')} style={styles.icon1} />
                </TouchableWithoutFeedback>
            </View>
        )
    }
    goToAboutUs = () => {
        this.props.navigation.navigate('AboutUs')
    }
    goToSkillAssessment = () => {
        this.props.navigation.navigate('SkillAssessment')
    }
    goToFreeCounselling = () => {
        this.props.navigation.navigate('FreeCounselling')
    }
    goToBuyPackage = () => {
        this.props.navigation.navigate('BuyPackage')
    }
    goToReportCard = () => {
        this.props.navigation.navigate('ReportCard')
    }
    goToSubmitSheet = () => {
        this.props.navigation.navigate('SheetMenu')
    }
    goToSupport = () => {
        this.props.navigation.navigate('Support')
    }
    goToScheduleWork = () => {
        this.props.navigation.navigate('ScheduleWork')
    }
    goToLearnSelectSubject = () => {
        this.props.navigation.navigate('LearnSelectSubject')
    }
    goToAskDoubts = () => {
        this.props.navigation.navigate('AskDoubts')
    }
    goToCloudClasses = () => {
        this.props.navigation.navigate('CloudClasses')
    }
    goToRewards = () => {
        this.props.navigation.navigate('Rewards')
    }
    goToOnlinePractise = () => {
        this.props.navigation.navigate('OnlineMenu')
    }
    goToUpcommingVideoCalls = () => {
        this.props.navigation.navigate('UpcommingVideoCalls')
    }
    goToLearningGuide = () => {
        this.props.navigation.navigate('LearningGuide')
    }
    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <ScrollView>
                <View style={styles.container}>
                    <StatusBar hidden />
                    <Header
                        leftComponent={this.renderLeftHeader}
                        rightComponent={() => this.renderRightHeader(this.props.navigation)}
                        containerStyle={styles.header}
                    />
                    <View>
                        <Image source={require('../../assets/tcurve.png')} resizeMode="stretch" style={styles.topCurveImage} />
                        {/* <View style={styles.coinsContainer} >
                         <TouchableWithoutFeedback onPress={this.goToRewards}>
                         <View style={styles.row}>
                            <Image source={require('../../assets/coins.png')}  style={styles.coinImage}/>
                            <View style={styles.coinNumberContinaer}>
                                <Text style={styles.coinNunber}>200</Text>
                            </View>
                         </View>
                         </TouchableWithoutFeedback>
                     </View> */}
                        <View style={styles.profileMainContainer}>
                            <View style={styles.profileImageContainer}>
                                <View style={styles.round1}>
                                    <View style={styles.round2}>
                                        <Image source={require('../../assets/profile.png')} resizeMode="stretch" style={styles.profileImage} />
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* <View style={styles.reportContainer}>
                         <TouchableWithoutFeedback onPress={this.goToReportCard}>
                                <Image source={require('../../assets/report.png')}  style={styles.reportImage} />
                         </TouchableWithoutFeedback>
                    </View> */}
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.day}>Good Day</Text>
                            <Text style={styles.name}>{this.state.student_name}</Text>
                        </View>
                        {/* <TouchableWithoutFeedback onPress={this.goToCloudClasses}>
                        <View style={styles.cloudContainer}>
                            <Image  source={require('../../assets/cloud.png')} style={styles.cloudImage}/>
                            <View style={styles.cloudClassContainer}>
                                <Text style={styles.cloudText}>Cloud Class</Text>
                                <View style={styles.countMainContainer}>
                                    <View style={styles.countContainer}>
                                    <Text style={styles.count}>10</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback> */}
                        {
                            this.state.payment_done == "yes" ?

                                <View style={styles.secondContainer}>
                                    <View style={styles.row}>
                                        <TouchableWithoutFeedback onPress={this.goToAboutUs}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/m1.png')} resizeMode="contain" style={styles.menuImage} />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>Know</Text>
                                                    <Text style={styles.cardText1}>BRINGI</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={this.goToSkillAssessment}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/m2.png')} resizeMode="contain" style={styles.menuImage} />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>SKILL</Text>
                                                    <Text style={styles.cardText1}>ASSESSMENT</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    </View>

                                    <View style={styles.row}>
                                        <TouchableWithoutFeedback onPress={this.goToSubmitSheet}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/sls.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>SUBMIT</Text>
                                                    <Text style={styles.cardText1}>SHEETS</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={this.goToSubmitSheet}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/lg.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>LEARNING</Text>
                                                    <Text style={styles.cardText1}>GAPS</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    {/* <View style={styles.row}>
                            <TouchableWithoutFeedback onPress={this.goToAskDoubts}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../assets/doubts.png')}  style={styles.menuImage} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>ASK</Text>
                                        <Text style={styles.cardText1}>DOUBTS</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.goToUpcommingVideoCalls}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../assets/one.png')}  style={styles.menuImage} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>1:1 VIDEO</Text>
                                        <Text style={styles.cardText1}>CALLS</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.row}>
                            <TouchableWithoutFeedback onPress={this.goToCloudClasses}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../assets/cc.png')}  style={styles.menuImage} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>CLOUD</Text>
                                        <Text style={styles.cardText1}>CLASSES</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.goToRewards}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../assets/rr.png')}  style={styles.menuImage} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>REDEEM</Text>
                                        <Text style={styles.cardText1}>REWARDS</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.row}>
                            <TouchableWithoutFeedback onPress={this.goToLearnSelectSubject}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../assets/lm.png')}  style={styles.menuImage} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>LEARN</Text>
                                        <Text style={styles.cardText1}>MORE</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.goToOnlinePractise}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../assets/op.png')}  style={styles.menuImage} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>ONLINE</Text>
                                        <Text style={styles.cardText1}>PRACTICE</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback>
                        </View> */}
                                    <View style={styles.row}>
                                        {/* <TouchableWithoutFeedback onPress={this.goToSupport}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../assets/support.png')}  style={styles.menuImage} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>SUPPORT</Text>
                                        <Text style={styles.cardText1}>CLICK HERE</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback> */}
                                        <TouchableWithoutFeedback onPress={this.goToLearningGuide}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/in6.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>LEARNING</Text>
                                                    <Text style={styles.cardText1}>GUIDE</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={this.goToScheduleWork}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/swi.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>SCHEDULE</Text>
                                                    <Text style={styles.cardText1}>MY WORK</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.row}>
                                        <TouchableWithoutFeedback onPress={this.goToBuyPackage}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/m3.png')} resizeMode="contain" style={styles.menuImage} />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>BUY</Text>
                                                    <Text style={styles.cardText1}>PACKAGE</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                        {/* <TouchableWithoutFeedback onPress={this.goToFreeCounselling}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../assets/m4.png')} resizeMode="contain"  style={styles.menuImage}/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>FREE</Text>
                                        <Text style={styles.cardText1}>COUNSELLING</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback> */}
                                    </View>
                                </View> :
                                <View style={styles.secondContainer}>
                                    <View style={styles.row}>
                                        <TouchableWithoutFeedback onPress={this.goToAboutUs}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/m1.png')} resizeMode="contain" style={styles.menuImage} />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>Know</Text>
                                                    <Text style={styles.cardText1}>BRINGI</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={this.goToSkillAssessment}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/m2.png')} resizeMode="contain" style={styles.menuImage} />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>SKILL</Text>
                                                    <Text style={styles.cardText1}>ASSESSMENT</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    </View>

                                    <View style={styles.row}>
                                        <TouchableWithoutFeedback onPress={this.goToSubmitSheet}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/sls.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>SUBMIT</Text>
                                                    <Text style={styles.cardText1}>SHEETS</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={this.goToSubmitSheet}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/lg.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>LEARNING</Text>
                                                    <Text style={styles.cardText1}>GAPS</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    {/* <View style={styles.row}>
                        <TouchableWithoutFeedback onPress={this.goToAskDoubts}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/doubts.png')}  style={styles.menuImage} resizeMode="contain"/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>ASK</Text>
                                    <Text style={styles.cardText1}>DOUBTS</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToUpcommingVideoCalls}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/one.png')}  style={styles.menuImage} resizeMode="contain"/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>1:1 VIDEO</Text>
                                    <Text style={styles.cardText1}>CALLS</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.row}>
                        <TouchableWithoutFeedback onPress={this.goToCloudClasses}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/cc.png')}  style={styles.menuImage} resizeMode="contain"/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>CLOUD</Text>
                                    <Text style={styles.cardText1}>CLASSES</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToRewards}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/rr.png')}  style={styles.menuImage} resizeMode="contain"/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>REDEEM</Text>
                                    <Text style={styles.cardText1}>REWARDS</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.row}>
                        <TouchableWithoutFeedback onPress={this.goToLearnSelectSubject}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/lm.png')}  style={styles.menuImage} resizeMode="contain"/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>LEARN</Text>
                                    <Text style={styles.cardText1}>MORE</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToOnlinePractise}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/op.png')}  style={styles.menuImage} resizeMode="contain"/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>ONLINE</Text>
                                    <Text style={styles.cardText1}>PRACTICE</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                    </View> */}
                                    <View style={styles.row}>
                                        {/* <TouchableWithoutFeedback onPress={this.goToSupport}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/support.png')}  style={styles.menuImage} resizeMode="contain"/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>SUPPORT</Text>
                                    <Text style={styles.cardText1}>CLICK HERE</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback> */}
                                        <TouchableWithoutFeedback onPress={this.goToLearningGuide}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/in6.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>LEARNING</Text>
                                                    <Text style={styles.cardText1}>GUIDE</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={this.goToScheduleWork}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/swi.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>SCHEDULE</Text>
                                                    <Text style={styles.cardText1}>MY WORK</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.row}>
                                        <TouchableWithoutFeedback onPress={this.goToBuyPackage}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../assets/m3.png')} resizeMode="contain" style={styles.menuImage} />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>BUY</Text>
                                                    <Text style={styles.cardText1}>PACKAGE</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                        {/* <TouchableWithoutFeedback onPress={this.goToFreeCounselling}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/m4.png')} resizeMode="contain"  style={styles.menuImage}/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>FREE</Text>
                                    <Text style={styles.cardText1}>COUNSELLING</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback> */}
                                    </View>
                                </View>

                        }

                    </View>
                    <View style={styles.letterMainContainer}>
                        <View style={styles.letterContainer}>
                            <Text style={styles.letter}>K</Text>
                        </View>
                    </View>
                    <View style={styles.bottomCurve}>
                        <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    </View>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
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
        width: 80,
        height: 80
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
        alignItems: 'center'
    },
    reportContainer: {
        position: 'absolute',
        right: 46,
        top: 53
    },
    reportImage: {
        width: 45,
        height: 45
    },
    bottomCurve: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('15')
    },
    card: {
        width: wp('40'),
        height: hp('16'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        margin: '2%'
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