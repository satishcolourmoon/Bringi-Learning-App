import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, Dimensions, ProgressBarAndroid, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Card, Divider } from 'react-native-elements';
import Loader from '../../components/Loader';
import qs from 'qs';
import { baseUrl } from '../../constants';
import StarRating from 'react-native-star-rating';
import Orientation from 'react-native-orientation-locker';
import Header from '../../common/Header';
import Footer from '../../common/Footer';

export default class VideoSheetReportDetails extends React.Component {
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
        Orientation.lockToPortrait();
        var sheet_id = this.props.route.params.sheet_id;
        this.setState({ sheet_id: sheet_id, loader: true }, () => { this.getReportCardDetails(sheet_id) })

    }
    goBack = () => {
        this.props.navigation.goBack();
    }
    getReportCardDetails = (sheet_id) => {
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'student_learninganalysis_video',
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
    onStarRatingPress(rating) {
        this.setState({
            rating: rating
        });
    }
    goToVideoPlayer = (data) => {
        this.props.navigation.navigate('VideoPlayer', {
            url: data.upload_video,
            sheet_id: this.props.route.params.sheet_id
        })
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
                <StatusBar hidden />
                {/* <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={() => { this.props.navigation.goBack() }}>
                        <Image source={require('../../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>Video</Text>
                        <Text style={styles.heading}>Performance</Text>
                    </View>
                </View> */}
                <Header title="Video" title1="Performance" backScreen="LearningAnalysis" headerImage="la" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.learningContianer}>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>OVER ALL PERFORMANCE</Text>
                                <StarRating
                                    disabled={true}
                                    rating={data.star_ratting}
                                    starSize={40}
                                    halfStarEnabled={false}
                                    fullStarColor="#ffbb00"
                                    emptyStarColor="#fff"
                                    starStyle={{ margin: 4 }}
                                />
                            </View>
                        </View>
                        <Divider />
                        <View style={styles.center}>
                            <View style={styles.docContainer}>
                                <TouchableWithoutFeedback onPress={() => { this.goToVideoPlayer(data) }}>
                                    <View style={styles.row}>
                                        <View style={{ width: wp('65'), justifyContent: "center" }}>
                                            <Text style={styles.myVideoText}>My Video</Text>
                                        </View>
                                        <View style={styles.playContainer}>
                                            <Icon name="play" type="font-awesome" color="red" size={20} />
                                        </View>
                                    </View>

                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <Divider />
                        <View style={{ marginTop: 15 }}>
                            <Card containerStyle={styles.card1}>
                                <View style={styles.row}>
                                    <View style={{ width: wp('65') }}>
                                        <Text style={styles.pathTitle}>Remark</Text>
                                    </View>
                                </View>
                                <Text style={styles.pathsubTitle}>{data.remark ? data.remark : 'N/A'}</Text>
                                <View style={{ margin: 5 }} />
                                <View style={styles.row}>
                                    <View style={{ width: wp('65') }}>
                                        <Text style={styles.pathTitle}>Description</Text>
                                    </View>
                                </View>
                                <Text style={styles.pathsubTitle}>{data.video_description ? data.video_description : 'N/A'}</Text>
                            </Card>
                        </View>
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
        // position: 'absolute',
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
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
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
        width: wp('85'),
        padding: '3%',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#823488',
        marginTop: 15,
        marginBottom: 15
    },
    docImageContainer: {
        borderWidth: 1,
        borderColor: '#e8e8e8',
        borderRadius: 8,
        margin: 5,
        padding: 4,
        elevation: 0.5
    },
    viewText: {
        fontFamily: 'Poppins-SemiBold',
        color: 'blue'
    },
    remarkContainer: {
        width: wp('90'),
        marginLeft: 20,
        marginTop: 4
    },
    remark: {
        fontFamily: 'Poppins-SemiBold',
    },
    description: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    myVideoText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14
    },
    playContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        borderColor: 'red',
        borderWidth: 1.5
    }

})