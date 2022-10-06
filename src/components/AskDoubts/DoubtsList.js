import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Header from '../../common/Header';
import Loader from '../../common/Loader';
import { apiCall } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import NoData from '../../common/NoData';
export default class DoubtsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            data: []
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.getDoubtsList(student_id);
        })
    }
    goToNewDoubt = () => {
        this.props.navigation.navigate('NewDoubts');
    }

    goToanswerDetails = (status, id, image, description) => {
        if (status == "Answered") {
            this.props.navigation.navigate('AnswerDetails', {
                id: id,
                image,
                description
            })
        }
    }

    getDoubtsList = async (student_id) => {
        let postData = {
            action: 'askdoubt_list',
            student_id: student_id
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ data: json.data, loader: false })
        } else {
            this.setState({ data: [], loader: false })
        }
    }

    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        if (this.state.data.length == 0) {
            return (
                <View style={styles.container}>
                    <StatusBar hidden />
                    <Header title="Ask Doubts" title1="" backScreen="AskDoubts" headerImage="confirmSubmit" navigation={this.props.navigation} />
                    <View style={{ flex: 0.9 }}>
                        <NoData title="No data found" />
                    </View>
                    <View style={styles.bottomCurve}>
                        <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                        <View style={styles.proceedContainer}>
                            <TouchableWithoutFeedback onPress={this.goToNewDoubt}>
                                <Text style={styles.proceedText}>ASK NEW + </Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <Header title="Ask Doubts" title1="" backScreen="AskDoubts" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.selectContainer}>
                            <Text style={styles.heading1}>General Doubts</Text>
                        </View>
                        <View style={styles.center}>
                            {
                                this.state.data.map((item, index) => {
                                    return (
                                        <TouchableWithoutFeedback onPress={() => this.goToanswerDetails(item.status, item.id, item.image, item.description)}>
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.row}>
                                                    <Image source={{ uri: item.image }} style={styles.calImage} />
                                                    <View style={styles.cardTitle}>
                                                        <Text style={styles.cardText1}>{item.subject_id}</Text>
                                                        <View style={{ width: wp('55') }}>
                                                            <Text style={styles.cardText2}>{item.description} </Text>
                                                        </View>
                                                        <Text style={item.status == "Not Answered" ? styles.redText : styles.greenText}>{item.status == "Not Answered" ? "Not Answered" : "Answered"}</Text>
                                                    </View>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                        <View style={{ padding: 30 }}></View>
                    </ScrollView>
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    <View style={styles.proceedContainer}>
                        <TouchableWithoutFeedback onPress={this.goToNewDoubt}>
                            <Text style={styles.proceedText}>ASK NEW + </Text>
                        </TouchableWithoutFeedback>
                    </View>
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
    bottomCurve: {
        flex: 0.1,
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
        width: wp('85'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
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
        color: '#868686',
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
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#f4141c'
    },
    calImage: {
        width: 80,
        height: 80,
        backgroundColor: '#fff'
    },
    row: {
        flexDirection: 'row'
    },
    greenText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#187a01'
    },
    redText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#c51915'
    },
    proceedContainer: {
        position: 'absolute',
        right: 20,
        bottom: 15
    },
    proceedText: {
        fontFamily: 'Poppins-SemiBold',
        marginLeft: wp('4'),
        color: '#ffffff',
        fontSize: 15
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})