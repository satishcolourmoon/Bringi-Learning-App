import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';

export default class ChapterDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            pdfs: [],
            videos: [],
            message_show: false
        }
    }
    componentDidMount() {
        this.getChapterDetails()
    }
    goBack = () => {
        this.props.navigation.navigate('SelectChapter');
    }
    goToChapterDetails = () => {
        this.props.navigation.navigate('ChapterDetails');
    }
    getChapterDetails = async () => {
        let postData = {
            action: 'learnmore_data',
            board_id: this.props.route.params.board_id,
            subject_id: this.props.route.params.subject_id,
            medium_id: this.props.route.params.medium_id,
            chapter_id: this.props.route.params.chapter_id,
            class_id: this.props.route.params.class_id,
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ pdfs: json.boardlist.materials, videos: json.boardlist.videos, loader: false });
        } else {
            this.setState({ pdfs: [], videos: [], loader: false, message_show: true });
        }
    }
    goToYoutubePlayer = (url) => {
        this.props.navigation.navigate('YoutubeVideo', {
            video_url: url,
            backScreen: 'ChapterDetails'
        });
    }
    goToPdfViewer = (pdf_url) => {
        this.props.navigation.navigate('PdfViewer',
            {
                url: pdf_url,
                backScreen: 'ChapterDetails'
            }
        )
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
                <Header title="Learn More" title1="" backScreen="SelectChapter" headerImage="learn_more" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        {this.state.pdfs.length !== 0 &&
                            <View>
                                <View style={styles.selectContainer}>
                                    <Text style={styles.heading1}>{this.props.route.params.title}</Text>
                                </View>
                                <View style={styles.aboutContainer}>
                                    <View style={styles.row}>
                                        {
                                            this.state.pdfs.map((item, index) => {
                                                return (
                                                    <TouchableWithoutFeedback onPress={() => this.goToPdfViewer(item.material)}>
                                                        <Card containerStyle={styles.card}>
                                                            <View style={styles.row}>
                                                                <View style={{ width: wp('20') }}>
                                                                    <Image source={require('../../../assets/pdf.png')} resizeMode="contain" style={styles.pdfImage} />
                                                                </View>
                                                                <View style={{ width: wp('60') }}>
                                                                    <View style={styles.cardTitle}>
                                                                        <Text style={styles.cardText1}>{item.title}</Text>
                                                                        <Text style={styles.cardText2}>{item.description}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </Card>
                                                    </TouchableWithoutFeedback>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        }
                        {this.state.videos.length !== 0 &&
                            <View>
                                {/* <View style={styles.selectContainer}>
                                    <Text style={styles.heading1}>Chapter Videos</Text>
                                </View> */}
                                <View style={styles.aboutContainer}>
                                    <View style={styles.row}>
                                        {
                                            this.state.videos.map((item, index) => {
                                                return (
                                                    <TouchableWithoutFeedback onPress={() => this.goToYoutubePlayer(item.video_id)}>
                                                        <Card containerStyle={styles.card}>
                                                            <View style={styles.row}>
                                                                <View style={{ width: wp('20') }}>
                                                                    <Image source={require('../../../assets/cloud.png')} resizeMode="contain" style={styles.pdfImage} />
                                                                </View>
                                                                <View style={{ width: wp('60') }}>
                                                                    <View style={styles.cardTitle}>
                                                                        <Text style={styles.cardText1}>{item.title}</Text>
                                                                        <Text style={styles.cardText2}>{item.description}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </Card>
                                                    </TouchableWithoutFeedback>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        }
                        {this.state.message_show == true &&
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", }}>
                                <Text style={{ fontSize: 18, color: "red", fontFamily: "poppins-Bold", textAlign: "center", marginTop: hp('30') }}> No Data Found</Text>
                            </View>
                        }
                        <View style={{ padding: 15 }} />
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
    bottomCurve: {
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('15')
    },
    aboutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        width: wp('90'),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8
    },
    cardTitle: {

        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        textAlign: 'justify'
    },
    cardText2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        textAlign: 'justify'
    },
    descContainer: {
        marginLeft: wp('4')
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238'
    },
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#df2238'
    },
    chapter: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        marginTop: wp('2')
    },
    icon: {
        height: 25,
        width: 25
    },
    nextContainer: {
        position: 'absolute',
        right: 0
    },
    selectContainer: {
        marginLeft: wp('7'),
        marginTop: '2%'
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pdfImage: {
        width: 80,
        height: 70
    },
    playImage: {
        width: 135,
        height: 135
    }
})