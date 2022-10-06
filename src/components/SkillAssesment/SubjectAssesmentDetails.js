import React from 'react';
import { View, StyleSheet, StatusBar, Image, ProgressBarAndroid, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Card, Divider } from 'react-native-elements';
import Loader from '../Loader';
import qs from 'qs';
import { baseUrl } from '../../constants';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import AsyncStorage from '@react-native-community/async-storage';
import { apiCall } from '../../utils';
export default class SubjectAssesmentDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            data: {
                learning_gap: [],
                skillwise_analysis: {
                    memorizing: 0,
                    understanding: 0,
                    application: 0,
                    evalution: 0
                }
            },
            subject_id: '',
            user_id: '',
            student_id: "",
            learningData: []
        }
    }
    componentDidMount() {
        var subject_id = this.props.route.params.subject_id;
        var user_id = this.props.route.params.user_id;
        this.setState({ subject_id: subject_id, user_id: user_id, loader: true })
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.getSubjectWiseLearningSheet(subject_id, student_id)
            this.setState({ student_id: student_id }, () => {
            });
        })
        this.getReportCardDetails(subject_id, user_id)
    }
    goBack = () => {
        this.props.navigation.navigate('SheetStatus');
    }
    getSubjectWiseLearningSheet = async (subject_id, student_id) => {
        let postData = {
            action: 'learning_gaps_subject_wise_sheets',
            subject_id,
            student_id
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ learningData: json.data, loader: false })
        } else {
            this.setState({ learningData: [], loader: false })
        }
    }
    getReportCardDetails = (subject_id, user_id) => {
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'getSubjectwisesheets',
                subject_id: subject_id,
                user_id: user_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    this.setState({ loader: false });
                } else if (json.status) {
                    this.setState({ loader: false, data: json.data });
                }
            })
            .catch((error) => {
                this.setState({ loader: false });
            });
    }
    CircularProgressChildren = (e) => {
        return (
            <Text style={styles.reading}>{parseInt(e)}%</Text>
        )
    }
    goToImageView = (url) => {
        this.props.navigation.navigate('ImageViewer', {
            uri: url,
            backScreen: 'SheetReportDetails'
        })
    }
    goToLearningGapsType = (sheet_id) => {
        this.props.navigation.navigate('LearningGapsType', {
            sheet_id: sheet_id,
            backScreen: 'SubjectAssesmentDetails'
        })
    }
    render() {
        const memorizing = this.state.data.skillwise_analysis.memorizing / 100;
        const understanding = this.state.data.skillwise_analysis.understanding / 100;
        const application = this.state.data.skillwise_analysis.application / 100;
        const evalution = this.state.data.skillwise_analysis.evalution / 100;
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <Header title="Learning Analysis" title1={this.props.route.params.subject_name} backScreen="LearningAnalysis" headerImage="la" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.learningContianer}>
                            <View style={styles.row}>
                                <View style={styles.center}>
                                    <View style={{ width: wp('45') }}>
                                        <AnimatedCircularProgress
                                            size={130}
                                            prefill={0}
                                            width={20}
                                            fill={this.state.data.percentage ? parseInt(this.state.data.percentage) : 0}
                                            tintColor="#ea364f"
                                            onAnimationComplete={() => console.log('onAnimationComplete')}
                                            backgroundColor="#3d5875"
                                            children={this.CircularProgressChildren}
                                        />
                                    </View>
                                </View>
                                <View style={styles.qnsContainer}>
                                    <View style={{ alignItems: 'center', margin: '4%' }}>
                                        <Image source={require('../../../assets/question.png')} style={styles.questionImage} />
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={styles.sub}>Questions Score</Text>
                                            <Text style={styles.number}>{this.state.data.corrected ? this.state.data.corrected : '0'}/{this.state.data.total ? this.state.data.total : '0'}</Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center', margin: '4%' }}>
                                        <Image source={require('../../../assets/minutes.png')} style={styles.timeImage} />
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={styles.sub}>Avg Time Question</Text>
                                            <Text style={styles.number}>{this.state.data.average_time ? this.state.data.average_time : '0'} min</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.analysisContianer}>
                            <Text style={styles.skillheading}>SkillWise Analysis</Text>
                            <Text style={styles.skillSUb}>Based on your performance in tests</Text>
                            <View style={{ justifyContent: 'center' }}>
                                <View style={styles.row}>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('7') }}>
                                        <Image source={require('../../../assets/brain.png')} style={styles.aImage} />
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('25') }}>
                                        <Text style={styles.skillText}>Memorising</Text>
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center' }}>
                                        <View style={styles.progressContainer}>
                                            <ProgressBarAndroid
                                                styleAttr="Horizontal"
                                                indeterminate={false}
                                                progress={memorizing ? memorizing : 0}
                                                color="#ff8801"
                                            />
                                        </View>
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center' }}>
                                        <Text style={styles.skillText}>{parseInt(this.state.data.skillwise_analysis.memorizing)}%</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('7') }}>
                                        <Image source={require('../../../assets/under.png')} style={styles.aImage} />
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('25') }}>
                                        <Text style={styles.skillText}>Understanding</Text>
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center' }}>
                                        <View style={styles.progressContainer}>
                                            <ProgressBarAndroid
                                                styleAttr="Horizontal"
                                                indeterminate={false}
                                                progress={understanding ? understanding : 0}
                                                color="#ff8801"
                                            />
                                        </View>
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center' }}>
                                        <Text style={styles.skillText}>{parseInt(this.state.data.skillwise_analysis.understanding)}%</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('7') }}>
                                        <Image source={require('../../../assets/app.png')} style={styles.aImage} />
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('25') }}>
                                        <Text style={styles.skillText}>Applications</Text>
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center' }}>
                                        <View style={styles.progressContainer}>
                                            <ProgressBarAndroid
                                                styleAttr="Horizontal"
                                                indeterminate={false}
                                                progress={application ? application : 0}
                                                color="#ff8801"
                                            />
                                        </View>
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center' }}>
                                        <Text style={styles.skillText}>{parseInt(this.state.data.skillwise_analysis.application)}%</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('7') }}>
                                        <Image source={require('../../../assets/eval.png')} style={styles.aImage} />
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('25') }}>
                                        <Text style={styles.skillText}>Evaluation</Text>
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center' }}>
                                        <View style={styles.progressContainer}>
                                            <ProgressBarAndroid
                                                styleAttr="Horizontal"
                                                indeterminate={false}
                                                progress={evalution ? evalution : 0}
                                                color="#ff8801"
                                            />
                                        </View>
                                    </View>
                                    <View style={{ margin: '1.8%', justifyContent: 'center' }}>
                                        <Text style={styles.skillText}>{parseInt(this.state.data.skillwise_analysis.evalution)}%</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {
                            this.state.learningData.length > 0 && <View>
                                <Divider />
                                <View style={styles.row}>
                                    <View style={styles.center}>
                                        <Text style={styles.filesText}>Learning Gaps</Text>
                                    </View>
                                </View>
                                {
                                    this.state.learningData.length > 0 && <View>{
                                        this.state.learningData.map((item1, index) => {
                                            return (
                                                <TouchableWithoutFeedback onPress={() => this.goToLearningGapsType(item1.worksheet_id)}>
                                                    <Card containerStyle={styles.card1} key={index}>
                                                        <Text style={styles.pathTitle}>{item1.worksheet_id}</Text>
                                                        <Text style={styles.pathsubTitle}>{item1.chapter_name}</Text>
                                                        <Text style={styles.pathsubTitle}>{item1.topic_name}</Text>
                                                    </Card>
                                                </TouchableWithoutFeedback>

                                            )
                                        })
                                    }
                                    </View>
                                }
                                {/* {
                                    this.state.data.learning_gap.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => this.goToLearningGapsType(item.worksheet_id)}>
                                                <Card containerStyle={styles.card1} key={index}>
                                                    <Text style={styles.pathTitle}>{item.worksheet_id}</Text>
                                                    <Text style={styles.pathsubTitle}>{item.chapter_name}</Text>
                                                    <Text style={styles.pathsubTitle}>{item.topics_name}</Text>
                                                </Card>
                                            </TouchableWithoutFeedback>

                                        )
                                    })
                                } */}
                            </View>
                        }
                        <View style={{ padding: 20 }}></View>
                    </ScrollView>
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
    pathTitleContainer: {
        marginLeft: wp('7')
    },
    aImage: {
        width: 20,
        height: 20
    },
    skillText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
    pathTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    pathsubTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
    bottomCurve: {
        flex: 0.1,
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
        width: wp('81'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
    },
    card1: {
        width: wp('87'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        marginLeft: wp('7'),
        margin: 6
    },
    cardTitle: {
        justifyContent: 'center',
        marginLeft: '2%'
    },
    cardText1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
    },
    cardText2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#868686'
    },
    descContainer: {
        marginLeft: wp('4')
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238'
    },
    skillheading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
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
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        backgroundColor: '#c12b4e',
        margin: '1%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%'
    },
    icon: {
        width: 35,
        height: 35
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 11,
    },
    profileImage: {
        width: 75,
        height: 80
    },
    userContainer: {
        position: 'absolute',
        top: 60,
        right: 60
    },
    ratingContainer: {
        width: wp('85'),
        padding: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#823488',
        borderRadius: 8,
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2%'
    },
    ratingText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#ffffff'
    },
    questionImage: {
        width: 20,
        height: 33
    },
    timeImage: {
        width: 33,
        height: 33
    },
    qnsContainer: {
        marginBottom: '2%'
    },
    number: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14
    },
    sub: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    skillSUb: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    analysisContianer: {
        marginLeft: wp('7'),
        marginBottom: '2%'
    },
    progressContainer: {
        width: wp('35')
    },
    learningContianer: {
        marginLeft: wp('7'),
        marginTop: hp('2'),
        marginBottom: '2%'
    },
    pathContianer: {
        marginTop: hp('2'),
        marginBottom: '2%'
    },
    reading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 15
    },
    filesText: {
        fontFamily: 'Poppins-SemiBold',
        marginTop: '3%',
        marginBottom: '2%',
        marginLeft: '7%',
        fontSize: 13,
        color: '#df2238'
    },
    docContainer: {
        marginLeft: wp('7'),
        marginTop: '3%',
        marginBottom: '4%',
    },
    docImageContainer: {
        borderWidth: 1,
        borderColor: '#e8e8e8',
        borderRadius: 8,
        margin: 5,
        padding: 4,
        elevation: 0.5
    }

})