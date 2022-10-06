import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import Loader from '../Loader';
import AsyncStorage from '@react-native-community/async-storage';
export default class LearningGaps extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            subjects: [],
            data: [],
            subject_id: null
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id }, () => {
                this.getSubjects(student_id)
            });
        })

    }

    // getSubjects = async() => {
    //     let postData = {
    //         action : 'subjectlist'
    //     }
    //     const json = await apiCall(postData);
    //     if(json.status){
    //         this.setState({loader:false,subjects:json.subjects})
    //     }else{
    //         this.setState({loader:false})
    //     }
    // }
    getSubjects = async (student_id) => {
        let postData = {
            action: 'subscribedSubjectlist',
            student_id: student_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, subjects: [] });
        } else if (json.status) {
            this.setState({ loader: false, subjects: json.subjects, subject_id: json.subjects[0].id }, () => {
                this.getSubjectWiseLearningSheet(json.subjects[0].id)
            })
        }
    }
    getSheets = async (subject_id) => {
        this.setState({
            subject_id,
            loader: true
        }, () => {
            this.getSubjectWiseLearningSheet(subject_id)
        })
    }

    getSubjectWiseLearningSheet = async (subject_id) => {
        this.setState({ loader: true });
        let postData = {
            action: 'learning_gaps_subject_wise_sheets',
            subject_id,
            student_id: this.state.student_id
        }
        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ data: json.data, loader: false })
        } else {
            this.setState({ data: [], loader: false })
        }
    }

    goBack = () => {
        this.props.navigation.navigate('SheetMenu');
    }

    goToLearningGapsType = (sheet_id) => {
        this.props.navigation.navigate('LearningGapsType', {
            sheet_id,
            backScreen: 'LearningGaps'
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
                <Header title="Learning Gaps" title1="" backScreen="Home" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.secondContainer}>
                            <View style={styles.row}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {
                                        this.state.subjects.map((item, index) => {
                                            return (
                                                <TouchableWithoutFeedback onPress={() => this.getSheets(item.id)}>
                                                    <View key={item.id}>
                                                        <View style={styles.round}>
                                                            <View>
                                                                <Image source={{ uri: item.image }} style={styles.icon} />
                                                            </View>
                                                        </View>
                                                        <View style={styles.center}>
                                                            <Text style={this.state.subject_id == item.id ? styles.circleText1 : styles.circleText}>{item.title}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                            {
                                !this.state.subject_id && <Text style={styles.note}>Please select your subject</Text>
                            }
                            {
                                this.state.subject_id && <View>
                                    {
                                        this.state.data.length > 0 ? this.state.data.map((item, index) => {
                                            return (
                                                <TouchableWithoutFeedback onPress={() => this.goToLearningGapsType(item.worksheet_id)} key={index.toString()}>
                                                    <Card containerStyle={styles.card}>
                                                        <View style={styles.row}>
                                                            <View style={styles.cardTitle}>
                                                                <Text style={styles.cardText1}>{item.worksheet_id}</Text>
                                                                <Text style={styles.cardText2}>{item.chapter_name}</Text>
                                                                <Text style={styles.cardText3}>{item.topic_name}</Text>
                                                            </View>
                                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                <Image source={require('../../../assets/next.png')} style={styles.nextImage} />
                                                            </View>
                                                        </View>
                                                    </Card>
                                                </TouchableWithoutFeedback>
                                            )

                                        }) : <Text style={styles.note}>Hey Congratulations! You have cleared all your sheets</Text>
                                    }
                                </View>
                            }
                        </View>
                    </ScrollView>
                    <View style={{ padding: 12 }} />
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
        justifyContent: 'center',
        marginLeft: '2%',
        width: wp('65')
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    cardText2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#874b89'
    },
    cardText3: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#6e6e6e'
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
    row: {
        flexDirection: 'row'
    },
    round: {
        width: 90,
        height: 90,
        borderRadius: 90 / 2,
        backgroundColor: '#c12b4e',
        margin: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2%'
    },
    icon: {
        width: 45,
        height: 45
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000'
    },
    circleText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#df2238',
    },
    nextImage: {
        width: 35,
        height: 35
    },
    note: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 11,
        color: '#df2238',
        marginTop: 35
    }
})