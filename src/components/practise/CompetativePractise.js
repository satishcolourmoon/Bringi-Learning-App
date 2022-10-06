import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import AsyncStorage from '@react-native-community/async-storage';
import { apiCall } from '../../utils';
import Nodata from '../../common/NoData';

export default class CompetativePractise extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.getExamList(student_id)
        })
    }

    getExamList = async (student_id) => {
        let postData = {
            action: 'exam_list',
            student_id
        }
        this.setState({ btnLoader: true });
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ data: json.data, loader: false })
        } else {
            this.setState({ data: [], loader: false })
        }
    }

    goBack = () => {
        this.props.navigation.navigate('OnlineMenu');
    }

    goToTestsList = (item) => {
        this.props.navigation.navigate('OnlineExams', {
            test_id: item.id,
            name: item.exam_name,
            desc: item.description
        });
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
                <Header title="Online" title1="Practice" backScreen="Home" headerImage="submitSheet" navigation={this.props.navigation} />
                <View style={styles.secondContainer}>
                    <View style={styles.selectContainer}>
                        <Text style={styles.heading1}>Competitive Practice</Text>
                    </View>
                    <View style={styles.aboutContainer}>
                        <FlatList
                            data={this.state.data}
                            ListEmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Nodata title="No data Found.Please check back later" />
                                </View>
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableWithoutFeedback onPress={() => this.goToTestsList(item)}>
                                        <Card containerStyle={styles.card}>
                                            <View style={styles.cardTitle}>
                                                <Text style={styles.cardText1}>{item.exam_name}</Text>
                                                <View style={styles.nextContainer}>
                                                    <Image source={require('../../../assets/next.png')} style={styles.icon} />
                                                </View>
                                            </View>
                                        </Card>
                                    </TouchableWithoutFeedback>
                                )
                            }}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ backgroundColor: '#ffffff', paddingBottom: hp('10') }}
                        />
                    </View>
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
        flex: 1,
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
        width: wp('86'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
    },
    cardTitle: {
        flexDirection: 'row'
    },
    cardText1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#8a4190'
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
    secondContainer: {
        flex: 0.9
    }
})