import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, Dimensions, ProgressBarAndroid, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Card, Divider } from 'react-native-elements';
import Loader from '../components/Loader';
import qs from 'qs';
import { baseUrl } from '../constants';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
export default class SheetReportDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            data: {
                correction_data: [],
                docs: {}
            },
            sheet_id: ''
        }
    }
    componentDidMount() {
        var sheet_id = this.props.route.params.sheet_id;
        this.setState({ sheet_id: sheet_id, loader: true }, () => { this.getReportCardDetails(sheet_id) })
    }
    goBack = () => {
        this.props.navigation.navigate('SheetStatus');
    }
    getReportCardDetails = (sheet_id) => {
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'student_learninganalysis',
                sheet_id: sheet_id,
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    this.setState({ loader: false, data: {} });
                } else if (json.status) {
                    this.setState({ loader: false, data: json.sheets });
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
    render() {
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
                        <Text style={styles.heading}>Sheet Report</Text>
                        <Text style={styles.heading}>Details</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/la.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
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
                                            fill={parseInt(this.state.data.overall_percentage)}
                                            tintColor="#ea364f"
                                            onAnimationComplete={() => console.log('onAnimationComplete')}
                                            backgroundColor="#3d5875"
                                            children={this.CircularProgressChildren}
                                        />
                                    </View>
                                </View>
                                <View style={styles.qnsContainer}>
                                    <View style={{ alignItems: 'center', margin: '4%' }}>
                                        <Image source={require('../../assets/question.png')} style={styles.questionImage} />
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={styles.sub}>Questions Score</Text>
                                            <Text style={styles.number}>{this.state.data.correct_answer}/{this.state.data.total_questions}</Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center', margin: '4%' }}>
                                        <Image source={require('../../assets/minutes.png')} style={styles.timeImage} />
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={styles.sub}>Avg Time Question</Text>
                                            <Text style={styles.number}>{this.state.data.average_time} min</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </View>
                        <Divider />
                        <View>
                            <View style={styles.row}>
                                <View style={styles.center}>
                                    <Text style={styles.filesText}>Submitted Attachments</Text>
                                </View>
                            </View>
                            <View style={styles.docContainer}>
                                <View style={styles.row}>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {
                                            this.state.data.docs.front_sheet !== "" && this.state.data.docs.front_sheet != null &&
                                            <TouchableWithoutFeedback onPress={() => this.goToImageView(this.state.data.docs.front_sheet)}>
                                                <View style={styles.docImageContainer}>
                                                    <Image source={{ uri: this.state.data.docs.front_sheet }} style={{ width: 150, height: 150, borderRadius: 8 }} resizeMode="contain" />
                                                    <View style={styles.center}>
                                                        <Text style={styles.sub}>Front Sheet</Text>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        }
                                        {
                                            this.state.data.docs.back_sheet !== "" && this.state.data.docs.back_sheet != null &&
                                            <TouchableWithoutFeedback onPress={() => this.goToImageView(this.state.data.docs.back_sheet)}>
                                                <View style={styles.docImageContainer}>
                                                    <Image source={{ uri: this.state.data.docs.back_sheet }} style={{ width: 150, height: 150, borderRadius: 8 }} resizeMode="contain" />
                                                    <View style={styles.center}>
                                                        <Text style={styles.sub}>Back Sheet</Text>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        }
                                        {
                                            this.state.data.docs.rough_sheet !== "" && this.state.data.docs.rough_sheet != null &&
                                            <TouchableWithoutFeedback onPress={() => this.goToImageView(this.state.data.docs.rough_sheet)}>
                                                <View style={styles.docImageContainer}>
                                                    <Image source={{ uri: this.state.data.docs.rough_sheet }} style={{ width: 150, height: 150, borderRadius: 8 }} resizeMode="contain" />
                                                    <View style={styles.center}>
                                                        <Text style={styles.sub}>Rough Sheet</Text>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                        <Divider />
                        <View style={styles.row}>
                            <View style={styles.center}>
                                <Text style={styles.filesText}>Question wise report</Text>
                            </View>
                        </View>
                        {
                            this.state.data.correction_data.map((item1, index) => {
                                return (
                                    <Card containerStyle={styles.card1} key={index}>
                                        <View style={styles.row}>
                                            <View style={{ width: wp('65') }}>
                                                <Text style={styles.pathTitle}>Qno)  {item1.qid}</Text>
                                            </View>
                                            <View style={styles.row}>
                                                {
                                                    item1.answer == 'correct' ?
                                                        <Icon name="check" size={16} type={'font-awesome'} color={'green'} /> :
                                                        <Icon name="times" size={16} type={'font-awesome'} color={'red'} />
                                                }
                                            </View>
                                        </View>
                                        {
                                            item1.remark != "" && item1.remark != null && <Text style={styles.pathsubTitle}>Remark : {item1.remark ? item1.remark : 'N/A'}</Text>
                                        }
                                        {
                                            item1.description != "" && item1.description != null && <Text style={styles.pathsubTitle}>Description : {item1.description ? item1.description : 'N/A'}</Text>
                                        }
                                    </Card>
                                )
                            })
                        }
                        <View style={{ padding: 20 }}></View>
                    </ScrollView>
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