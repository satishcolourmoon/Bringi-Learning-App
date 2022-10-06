import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, Dimensions, ProgressBarAndroid, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Card } from 'react-native-elements';
import Loader from '../components/Loader';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { baseUrl } from '../constants';
export default class ReportCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            data: {
                difculti_level: {
                    memorizing: "",
                    understanding: "",
                    application: "",
                    evalution: ""
                },
                questions_report: {
                    noof_questions: "0",
                    correct_answer: "0",
                    average_time: "0"
                },
                chapters: [],
                learning_path: {
                    oldpath: [],
                    newpath: []
                }
            }
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id, loader: true }, () => { this.getReportCard(student_id) })
        });
    }
    goBack = () => {
        this.props.navigation.navigate('LearningAnalysis');
    }
    getReportCard = (student_id) => {
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'getTestReport',
                user_id: student_id,
                test_id: this.props.route.params.test_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    this.setState({ loader: false, data: {} });
                } else if (json.status) {
                    this.setState({ loader: false, data: json.data });
                }
            })
            .catch((error) => {
                this.setState({ loader: false });
                console.error(error);
            });
    }
    render() {
        const chart_wh = 250
        const series = [123, 321, 123, 789, 537]
        const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
        const memorizing = this.state.data.difculti_level.memorizing / 100;
        const understanding = this.state.data.difculti_level.understanding / 100;
        const application = this.state.data.difculti_level.application / 100;
        const evalution = this.state.data.difculti_level.evalution / 100;
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (

            <View style={styles.container}>
                <StatusBar hidden />
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image source={require('../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>Learning</Text>
                        <Text style={styles.heading}>Analysis</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/la.png')} resizeMode="stretch" style={styles.topCurveImage} />
                    <View style={styles.userContainer}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../../assets/profile.png')} style={styles.profileImage} resizeMode="contain" />
                        </View>
                        <View style={styles.studentNameContainer}>
                            <View style={{ width: wp('40') }}>
                                <Text style={styles.cardText1}>{this.props.route.params.student_name}</Text>
                                <Text style={styles.cardText2}>{this.props.route.params.class}</Text>
                                <Text style={styles.cardText2}>{this.props.route.params.board}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.8 }}>
                    <ScrollView>
                        <View style={styles.secondContainer}>
                            <View style={styles.row}>
                                <View>
                                    <View style={styles.round}>
                                        <View>
                                            <Image source={require('../../assets/face.png')} style={styles.icon} />
                                        </View>
                                    </View>
                                    <View style={styles.center}>
                                        <Text style={styles.circleText}>Assessment</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>OVER ALL PERFORMANCE</Text>
                                <View style={styles.row}>
                                    <Icon name="star" color={this.state.data.questions_report.rating > 0 ? '#facc21' : '#ffffff'} size={30} />
                                    <Icon name="star" color={this.state.data.questions_report.rating > 1 ? '#facc21' : '#ffffff'} size={30} />
                                    <Icon name="star" color={this.state.data.questions_report.rating > 2 ? '#facc21' : '#ffffff'} size={30} />
                                    <Icon name="star" color={this.state.data.questions_report.rating > 3 ? '#facc21' : '#ffffff'} size={30} />
                                    <Icon name="star" color={this.state.data.questions_report.rating > 4 ? '#facc21' : '#ffffff'} size={30} />
                                </View>
                            </View>
                            <View style={styles.qnsContainer}>
                                <View style={styles.row}>
                                    <View style={{ alignItems: 'center', margin: '4%' }}>
                                        <Image source={require('../../assets/question.png')} style={styles.questionImage} />
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={styles.sub}>Questions Score</Text>
                                            <Text style={styles.number}>{this.state.data.questions_report.correct_answer}/{this.state.data.questions_report.noof_questions}</Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center', margin: '4%' }}>
                                        <Image source={require('../../assets/minutes.png')} style={styles.timeImage} />
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={styles.sub}>Avg Time Question</Text>
                                            <Text style={styles.number}>{this.state.data.questions_report.average_time} min</Text>
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
                                        <Image source={require('../../assets/brain.png')} style={styles.aImage} />
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
                                        <Text style={styles.skillText}>{parseInt(this.state.data.difculti_level.memorizing)}%</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('7') }}>
                                        <Image source={require('../../assets/under.png')} style={styles.aImage} />
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
                                        <Text style={styles.skillText}>{parseInt(this.state.data.difculti_level.understanding)}%</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('7') }}>
                                        <Image source={require('../../assets/app.png')} style={styles.aImage} />
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
                                        <Text style={styles.skillText}>{parseInt(this.state.data.difculti_level.application)}%</Text>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={{ margin: '1.8%', justifyContent: 'center', width: wp('7') }}>
                                        <Image source={require('../../assets/eval.png')} style={styles.aImage} />
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
                                        <Text style={styles.skillText}>{parseInt(this.state.data.difculti_level.evalution)}%</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* <View style={styles.learningContianer}>
                            <Text style={styles.skillheading}>Learning Style</Text>
                            <View style={{flex:1}}>
                                <PieChart
                                    data={data}
                                    width={wp('80')}
                                    height={135}
                                    chartConfig={chartConfig}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    absolute={false}
                                />
                            </View>
                        
                        </View>  */}
                        <View style={styles.pathContianer}>
                            <View style={styles.pathTitleContainer}>
                                <Text style={styles.skillheading}>Path To Success</Text>
                            </View>
                            {
                                this.state.data.learning_path.oldpath.map((item, index) => {
                                    return (
                                        <Card containerStyle={styles.card1} key={index}>
                                            <Text style={styles.pathTitle}>{item.class}</Text>
                                            <Text style={styles.pathsubTitle}>{item.chapter}</Text>
                                        </Card>
                                    )
                                })
                            }
                            {
                                this.state.data.learning_path.newpath.map((item, index) => {
                                    return (
                                        <Card containerStyle={styles.card1} key={index}>
                                            <Text style={styles.pathTitle}>{item.class}</Text>
                                            <Text style={styles.pathsubTitle}>{item.chapter}</Text>
                                        </Card>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                </View>
            </View>
        )
    }
}
const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};
const data = [
    {
        name: "Visual",
        population: 60,
        color: "#ffb401",
        legendFontColor: "#ffb401",
        legendFontSize: 10
    },
    {
        name: "Kinesthetic",
        population: 25,
        color: "#e41c26",
        legendFontColor: "#e41c26",
        legendFontSize: 10
    },
    {
        name: "Auditary",
        population: 20,
        color: "#823488",
        legendFontColor: "#823488",
        legendFontSize: 10
    }
];
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
        flex: 0.2,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('15')
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
        width: wp('85'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        marginLeft: wp('7')
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
        width: 70,
        height: 70
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
    studentNameContainer: {
        zIndex: 99999,
        backgroundColor: '#ffffff',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 8
    }
})