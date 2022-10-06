import React from 'react';
import { FlatList, View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Orientation from 'react-native-orientation-locker';
import Nodata from '../../common/NoData';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
export default class ChapterDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            sheet_id: '',
            data: {
                learning_guide: '',
            },
            videos: []
        }
    }
    componentDidMount() {
        var sheet_id = this.props.route.params.sheet_id;
        this.setState({ sheet_id: sheet_id }, () => { this.getLearningSheetKeyData(sheet_id) });
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            Orientation.lockToPortrait();
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    getLearningSheetKeyData = async (sheet_id) => {
        let postData = {
            worksheet_id: sheet_id,
            action: 'learningsheet_report'
        }
        const json = await apiCall(postData)
        if (json.status) {
            this.setState({ data: json.data, videos: json.data.videos, loader: false });
        } else {
            this.setState({ data: this.state.data, videos: [], loader: false });
        }
    }
    goBack = () => {
        this.props.navigation.navigate('LearningGuide');
    }
    goToChapterDetails = () => {
        this.props.navigation.navigate('ChapterDetails');
    }
    goToVideo = (url, type) => {
        if (type == 'youtube_video') {
            this.props.navigation.navigate('YoutubeVideo', {
                video_url: url,
                backScreen: 'GuideVideos'
            });
        } else {
            this.props.navigation.navigate('VideoComponent', {
                video_url: url
            });
        }
    }
    pdfView = (pdf_url) => {
        this.props.navigation.navigate('PdfViewer',
            {
                url: pdf_url,
                backScreen: 'GuideVideos'
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
                <Header title={this.props.route.params.sheet_id} title1="" backScreen={this.props.route.params.backScreen} headerImage="confirmSubmit" navigation={this.props.navigation} />
                {
                    this.state.data !== "invalid" ?
                        <View style={{ flex: 0.9 }}>
                            <View style={styles.aboutContainer}>
                                {
                                    this.state.data.learning_guide != "" && <TouchableWithoutFeedback onPress={() => this.pdfView(this.state.data.learning_guide)}>
                                        <Card containerStyle={styles.card}>
                                            <View style={styles.cardImage}>
                                                <Image source={require('../../../assets/m1.png')} style={styles.menuImage} resizeMode="contain" />
                                            </View>
                                            <View style={styles.cardTitle}>
                                                <Text style={styles.cardText}>View Guide Sheet</Text>
                                                <Text style={styles.cardText1}>CLICK HERE</Text>
                                            </View>
                                        </Card>
                                    </TouchableWithoutFeedback>
                                }
                                {
                                    this.state.data.learning_guide == "" && <Text style={styles.cardText1}>No Pdf Found</Text>
                                }
                            </View>
                            <View style={styles.selectContainer}>
                                <Text style={styles.chapter}>GUIDE VIDEOS</Text>
                            </View>
                            <View style={styles.aboutContainer}>
                                <FlatList
                                    data={this.state.videos}
                                    renderItem={({ item }) => (
                                        <TouchableWithoutFeedback onPress={() => this.goToVideo(item.k_video, item.video_type)} key={item.id}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardImage}>
                                                    <Image source={require('../../../assets/video.png')} style={styles.menuImage} resizeMode="contain" />
                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText}>See Video</Text>
                                                    <Text style={styles.cardText1}>CLICK HERE</Text>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    )
                                    }
                                    horizontal={false}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    keyExtractor={item => { item.id }}
                                    contentContainerStyle={{ paddingBottom: '3%', marginTop: '4%' }}
                                />
                            </View>
                        </View>
                        :
                        <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.noDataText}> it's a test sheet solve without help.  Thank you!</Text>
                        </View>
                }
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
        flex: 0.2,
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
        width: wp('37'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '3%'
    },
    cardText1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        marginTop: '3%',
        textAlign: 'center'
    },
    descContainer: {
        marginLeft: wp('4')
    },
    noDataText: {
        fontFamily: 'Poppins-Regular',
        color: 'red'
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
        flexDirection: 'row'
    },
    pdfImage: {
        width: 80,
        height: 70
    },
    playImage: {
        width: 60,
        height: 60
    },
    card: {
        borderRadius: 10,
        elevation: 4,
        width: wp('42'),
        height: hp('14'),
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%',
        padding: '2%'
    },
    card1: {
        borderRadius: 10,
        elevation: 4,
        width: wp('84'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: wp('84'),
        height: hp('24'),
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
        width: 100,
        height: 100
    },
    cardTitle: {
        marginTop: hp('10')
    },
    cardText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13
    },
});