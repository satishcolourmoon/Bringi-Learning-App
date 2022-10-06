import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, FlatList, ScrollView, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../Loader';
import AsyncStorage from '@react-native-community/async-storage';
import Nodata from '../NoData';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils/';

export default class LearningAnalysis extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            student_id: '',
            data: [],
            selectedId: 0,
            subjects: []
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id, loader: true }, () => { this.getUserAsesmentList(student_id); this.getSubjectsList(student_id) })
        });
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.navigate('Home');
        return true;
    }

    getUserAsesmentList = async (student_id) => {
        let postData = {
            action: 'getUserTestLists',
            user_id: student_id,
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, data: [] });
        } else if (json.status) {
            this.setState({ loader: false, data: json.data });
        }
    }

    getSubjectsList = async (student_id) => {
        let postData = {
            action: 'subscribedSubjectlist',
            student_id: student_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, subjects: [] });
        } else if (json.status) {
            this.setState({ loader: false, subjects: json.subjects });
        }
    }

    goBack = () => {
        this.props.navigation.navigate('Home');
    }

    goToReportCard = (item) => {
        this.props.navigation.navigate('ReportCard',
            {
                test_id: item.test_id,
                student_name: item.student_name,
                class: item.class,
                board: item.board

            });
    }

    getAnalysisData = () => {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id: student_id, loader: true, selectedId: 0 }, () => {
                this.getUserAsesmentList(student_id)
            })
        });
    }

    getSubjectAnalysis = (subject_id, name) => {
        this.props.navigation.navigate('SubjectAssesmentDetails', {
            subject_id: subject_id,
            user_id: this.state.student_id,
            subject_name: name
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
                <Header title="Learning" title1="Analysis" backScreen="SkillAssessment" headerImage="la" navigation={this.props.navigation} />
                <View style={styles.secondContainer}>
                    <View style={styles.horizontalContainer}>
                        <View style={styles.row}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <TouchableWithoutFeedback onPress={() => this.getAnalysisData()}>
                                    <View>
                                        <View style={styles.round}>
                                            <View>
                                                <Image source={require('../../../assets/face.png')} style={styles.icon} />
                                            </View>
                                        </View>
                                        <View style={styles.center}>
                                            <Text style={this.state.selectedId == 0 ? styles.circleText1 : styles.circleText}>Assessment</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                {
                                    this.state.subjects.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => { this.getSubjectAnalysis(item.id, item.title) }}>
                                                <View key={index}>
                                                    <View style={styles.round}>
                                                        <View>
                                                            <Image source={{ uri: item.image }} style={styles.icon} />
                                                        </View>
                                                    </View>
                                                    <View style={styles.center}>
                                                        <Text style={this.state.selectedId == item.id ? styles.circleText1 : styles.circleText}>{item.title}</Text>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                    <FlatList
                        ListEmptyComponent={
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Nodata title="No Tests Found.Please check back later" />
                            </View>
                        }
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableWithoutFeedback onPress={() => this.goToReportCard(item)}>
                                    <Card containerStyle={styles.card}>
                                        <View style={styles.row}>
                                            <Image source={require('../../../assets/profile.png')} style={styles.profileImage} />
                                            <View style={styles.cardTitle}>
                                                <Text style={styles.cardText1}>{item.student_name}</Text>
                                                <Text style={styles.cardText2}>{item.class},{item.board}</Text>
                                                <Text style={styles.cardText2}>{item.subject_name}</Text>
                                            </View>
                                        </View>
                                    </Card>
                                </TouchableWithoutFeedback>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ backgroundColor: '#ffffff', paddingBottom: '5%' }}
                    />
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
        width: wp('86'),
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
        width: 85,
        height: 85,
        borderRadius: 85 / 2,
        backgroundColor: '#c12b4e',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#c12b4e'
    },
    secondContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2%',
        flex: 0.9
    },
    icon: {
        width: 50,
        height: 50
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
    },
    profileImage: {
        width: 75,
        height: 80
    },
    horizontalContainer: {
        marginBottom: 15
    }
})