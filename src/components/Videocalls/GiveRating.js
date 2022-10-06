import React from 'react';
import { View, StyleSheet, StatusBar, Text, ScrollView, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import StarRating from 'react-native-star-rating';
import Button from '../../components/Button';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class GiveRating extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rating: 1,
            btnLoader: false,
            user_remark: '',
            student_id: '',
            video_id: '',
            showAlert: false,
            error_message: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            const { video_id } = this.props.route.params;
            this.setState({ student_id, video_id })
        })
    }

    onStarRatingPress = (rating) => {
        this.setState({ rating: rating })
    }

    giveFeedback = async () => {
        this.setState({ btnLoader: true });
        let postData = {
            action: 'student_video_rating',
            student_id: this.state.student_id,
            video_id: this.state.video_id,
            rating: this.state.rating,
            user_remark: this.state.user_remark
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ showAlert: true, error_message: json.message, btnLoader: false });
            setTimeout(() => { this.props.navigation.navigate('PreviousVideoCalls') }, 1000)
        } else {
            this.setState({ showAlert: true, error_message: json.message, btnLoader: false });
        }
    }

    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
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
                <StatusBar hidden />
                <Header title="1:1 Video calls" title1="" backScreen="SheetVideo" headerImage="vc" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.modalcontainer}>
                            <View style={{ padding: 10 }} />
                            <View style={styles.center}>
                                <View style={styles.modalFirstContainer}>
                                    <View style={styles.center}>
                                        <Text style={styles.feedbackText}>GIVE FEEDBACK</Text>
                                        <View>
                                            <StarRating
                                                disabled={false}
                                                maxStars={5}
                                                rating={this.state.rating}
                                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                                starStyle={styles.star}
                                                emptyStarColor="#fff"
                                                fullStarColor="#ffc933"
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Remark</Text>
                                    <View>
                                        <View style={styles.inputContainer1}>
                                            <TextInput
                                                placeholder=""
                                                style={styles.input1}
                                                onChangeText={(user_remark) => this.setState({ user_remark })}
                                                value={this.state.remarks}
                                                multiline={true}
                                                numberOfLines={5}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ margin: 10 }} />
                                <View>
                                    <Button onPress={this.giveFeedback} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="SUBMIT" loader={this.state.btnLoader} />
                                </View>
                            </View>
                        </View>
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
    inputContainer: {
        marginTop: '3%',
    },
    inputContainer1: {
        backgroundColor: '#ececec',
        borderRadius: 30,
        paddingLeft: wp('5'),
        margin: '0.4%'
    },
    input1: {
        backgroundColor: '#ececec',
        width: wp('75'),
        borderColor: '#ececec',
        borderRadius: 30,
        fontFamily: 'Poppins-SemiBold'
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '2%'
    },
    aboutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '6%'
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
        width: wp('30'),
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('30'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('30'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab2: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('30'),
        backgroundColor: '#ac90e7',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30
    },
    tabText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#ffffff',
    },
    tabText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#000000',
    },
    card: {
        width: wp('88'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
    },
    cardTitle: {
        flexDirection: 'row'
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#000000'
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
    time: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#88428b'
    },
    statusText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff'
    },
    statusContainer: {
        backgroundColor: '#ef1718',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4%',
        borderRadius: 8
    },
    selectContainer: {
        marginLeft: wp('7'),
        marginTop: '2%'
    },
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#df2238'
    },
    addCoinMainContainer: {
        position: 'absolute',
        right: 0,
        top: 10
    },
    addCoinContainer: {
        backgroundColor: '#ef1718',
        padding: '3%',
        width: wp('25'),
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addCoinText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#ffffff',
    },
    modalcontainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 13
    },
    modalFirstContainer: {
        backgroundColor: '#ac90e7',
        padding: 7,
        width: wp('80'),
        borderRadius: 13
    },
    feedbackText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#fff'
    },
    star: {
        padding: 10,
    },
    cancelAbsoluteContainer: {
        position: 'absolute',
        zIndex: 99999,
        top: 0,
        right: 0
    }
})
