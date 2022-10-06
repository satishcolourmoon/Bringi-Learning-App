import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import { Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { apiCall } from '../../utils';
import Nodata from '../../common/NoData';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class OnlineExams extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            showAlert: false,
            error_message: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.getExams(student_id)
        })
    }

    getExams = async (student_id) => {
        let postData = {
            action: 'compitative_tests_list',
            student_id,
            exam_id: this.props.route.params.test_id
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

    goToQuestions = () => {
        this.props.navigation.navigate('Questions');
    }
    attemptExam = (test_id, is_finished) => {
        if (!is_finished) {
            this.props.navigation.navigate('CompetativeQuestionPaper', {
                test_id
            });
        } else {
            this.setState({ showAlert: true, error_message: "This test has already been completed" }, () => {
                // this.props.navigation.navigate('CompetativeReport')
                this.props.navigation.navigate('CompetativeSheetReport', {
                    test_id: test_id
                })
            })
        }
    }

    render() {
        const { name, desc } = this.props.route.params;
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
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({ showAlert: false });
                    }}
                />
                <StatusBar hidden />
                <Header title="Online" title1="Practice" backScreen="Home" headerImage="submitSheet" navigation={this.props.navigation} />
                <View style={styles.secondContainer}>
                    <View style={styles.selectContainer}>
                        <Text style={styles.heading1}>Competitive Practice</Text>
                        <Text style={styles.subheading}>{name} ({desc})</Text>
                    </View>
                    <View>
                        <FlatList
                            data={this.state.data}
                            ListEmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Nodata title="No data Found.Please check back later" />
                                </View>
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <View>
                                        <TouchableWithoutFeedback onPress={() => this.attemptExam(item.id, item.is_finished)}>
                                            <View>
                                                <View style={styles.boxContainer}>
                                                    <View>
                                                        <Image source={require('../../../assets/box.png')} style={styles.boxBackImage} />
                                                        <View style={styles.noteContainer}>
                                                            <Image source={require('../../../assets/note.png')} style={styles.noteImage} />
                                                            <Text style={styles.start}>{item.exam_name}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                {
                                                    !item.is_finished &&
                                                    <View style={styles.buttonMainContainer}>
                                                        <Text style={styles.attempt}>ATTEMPT</Text>
                                                    </View>
                                                }
                                                {
                                                    item.is_finished &&
                                                    <View style={styles.buttonMainContainer1}>
                                                        <Text style={styles.attempt}>ATTEMPTED</Text>
                                                    </View>
                                                }
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <Divider style={styles.divider} />
                                    </View>
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
        backgroundColor: '#ffffff',
    },
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
    bottomCurve: {
        flex: 1,
        justifyContent: 'flex-end'
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
    descContainer: {
        marginLeft: wp('4')
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238'
    },
    boxContainer: {
        justifyContent: 'center',
        marginLeft: wp('6'),
        marginTop: hp('1.5')
        // alignItems : 'center',
    },
    boxHeader: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        margin: '1%'
    },
    boxBackImage: {
        width: 200,
        height: 150
    },
    noteContainer: {
        position: 'absolute',
        top: 20,
        left: 70
    },
    noteImage: {
        width: 70,
        height: 80
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    start: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        marginTop: '3%',
        color: '#83448a',
        textAlign: 'center'
    },
    divider: {
        marginTop: '4%'
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
    subheading: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#000'
    },
    buttonMainContainer: {
        position: 'absolute',
        right: 0,
        top: 70,
        backgroundColor: '#ef1718',
        padding: '6%',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('23'),
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    buttonMainContainer1: {
        position: 'absolute',
        right: 0,
        top: 70,
        backgroundColor: '#1dc702',
        padding: '6%',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('23'),
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    attempt: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff'
    },
    secondContainer: {
        flex: 0.9
    }
})