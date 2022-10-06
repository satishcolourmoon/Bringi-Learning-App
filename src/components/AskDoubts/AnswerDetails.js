import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import Loader from '../../common/Loader';
import { apiCall } from '../../utils';
import Orientation from 'react-native-orientation-locker';
export default class AnswerDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            data: {}
        }
    }
    componentDidMount() {
        this.getAnswerDetails();
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                Orientation.lockToPortrait();
            }
        );
    }
    getAnswerDetails = async () => {
        let postData = {
            action: 'askDoubtdetails',
            ask_doubt_id: this.props.route.params.id
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ data: json.data, loader: false })
        } else {
            this.setState({ data: {}, loader: false })
        }
    }
    goToPlayer = (type, url) => {
        if (type == "youtube_url") {
            this.props.navigation.navigate('YoutubeVideo', {
                video_url: url,
                backScreen: 'AnswerDetails'
            });
        } else if (type == "normal_video") {
            this.props.navigation.navigate('VideoComponent', {
                video_url: url,
                backScreen: 'AnswerDetails'
            });
        }
    }

    goToPdfViewer = (pdf_url) => {
        this.props.navigation.navigate('PdfViewer',
            {
                url: pdf_url,
                backScreen: 'AnswerDetails'
            }
        )
    }

    goToImageView = (image) => {
        this.props.navigation.navigate('ImageViewer', {
            uri: image,
            backScreen: 'AnswerDetails'
        })
    }
    render() {
        const item = this.state.data
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <Header title="Ask Doubts" title1="" backScreen="DoubtsList" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.selectContainer}>
                            <Text style={styles.heading1}>Asked Doubt Description</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.info}>{this.props.route.params.description}</Text>
                        </View>
                        <View>
                            <TouchableWithoutFeedback onPress={() => this.goToImageView(this.props.route.params.image)}>
                                <Card containerStyle={styles.card}>
                                    <Image source={{ uri: this.props.route.params.image }} resizeMode="contain" style={styles.pdfImage} />
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText1}>Asked Doubt Image</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.divider}></View>
                        <View style={styles.selectContainer}>
                            <Text style={styles.heading1}>Admin comment</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.info}>{item.admin_description}.</Text>
                        </View>
                        <View style={styles.selectContainer}>
                            <Text style={styles.heading1}>Documents</Text>
                        </View>
                        <View style={styles.row}>
                            {
                                item.sol_image !== "" &&
                                <TouchableWithoutFeedback onPress={() => this.goToImageView(item.sol_image)}>
                                    <Card containerStyle={styles.card}>
                                        <Image source={{ uri: item.sol_image }} resizeMode="contain" style={styles.pdfImage} />
                                        <View style={styles.cardTitle}>
                                            <Text style={styles.cardText1}>Solution Image</Text>
                                        </View>
                                    </Card>
                                </TouchableWithoutFeedback>
                            }
                            {
                                item.sol_pdf !== "" &&
                                <TouchableWithoutFeedback onPress={() => this.goToPdfViewer(item.sol_pdf)}>
                                    <Card containerStyle={styles.card}>
                                        <Image source={require('../../../assets/pdf.png')} resizeMode="contain" style={styles.pdfImage} />
                                        <View style={styles.cardTitle}>
                                            <Text style={styles.cardText1}>Solution Pdf</Text>
                                        </View>
                                    </Card>
                                </TouchableWithoutFeedback>
                            }
                        </View>
                        <View style={styles.row}>
                            {
                                item.sol_video !== "" &&
                                <TouchableWithoutFeedback onPress={() => this.goToPlayer(item.video_type, item.sol_video)}>
                                    <View style={{ width: wp('40') }}>
                                        <Image source={require('../../../assets/cloud.png')} style={styles.playImage} />
                                        <Text style={styles.cardText1}>Solution Video</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            }
                        </View>
                    </ScrollView>
                    <View style={{ padding: 15 }} />
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
    card: {
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        width: wp('37'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10,
        width: wp('37'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    pdfImage: {
        width: 80,
        height: 70
    },
    cardTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '3%',

    },
    cardText1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        marginTop: '3%',
        textAlign: 'center'
    },
    selectContainer: {
        marginLeft: wp('7'),
        marginTop: '2%'
    },
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#f4141c'
    },
    playImage: {
        width: 135,
        height: 135
    },
    selectContainer: {
        marginLeft: wp('7'),
        marginTop: '2%'
    },
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#f4141c'
    },
    infoContainer: {
        marginLeft: wp('7'),
        marginRight: wp('7'),
        marginBottom: 10
    },
    info: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        textAlign: 'justify'
    },
    divider: {
        height: 1,
        backgroundColor: '#868686',
        marginTop: 20,
        marginBottom: 10
    }

})