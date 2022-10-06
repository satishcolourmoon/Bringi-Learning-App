import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, Icon } from 'react-native-elements';
import Loader from '../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { apiCall } from '../utils';
export default class SwitchStudent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            showAlert: false,
            error_message: '',
            data: [],
            student_id: '',
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_id').then((user_id) => {
            this.getStudents(user_id);
        });
    }
    getStudents = async (user_id) => {
        let postData = {
            action: 'studentListWithParent',
            parent_id: user_id
        }
        const json = await apiCall(postData);
        AsyncStorage.getItem('student_id').then((student_id) => {
            if (!json.status) {
                this.setState({ loader: false, data: [], student_id: student_id, });
            } else if (json.status) {
                this.setState({ loader: false, data: json.students, student_id: student_id, });
            }
        })
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    selectStudent = (id, name, class_name, class_id, paymentstatus, gender) => {
        try {
            AsyncStorage.setItem('student_id', id.toString());
            AsyncStorage.setItem('student_name', name);
            AsyncStorage.setItem('class_name', class_name);
            AsyncStorage.setItem('class_id', class_id);
            AsyncStorage.setItem('payment_done', paymentstatus)
            AsyncStorage.setItem('gender', gender)
            this.setState({ student_id: id, showAlert: true, error_message: 'Account switched successfully' });
            setTimeout(() => { this.props.navigation.navigate('MainNavigator') }, 1200)
        } catch (e) {
            console.log(e)
        }
    }
    goToAddStudent = () => {
        this.props.navigation.navigate('AddStudent');
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
                <Header title="Switch Student" title1="" backScreen="Home" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <TouchableWithoutFeedback onPress={this.goToAddStudent}>
                    <View style={styles.cloudContainer}>
                        <View style={styles.cloudClassContainer}>
                            <Text style={styles.cloudText}>+ Add Student</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ flex: 0.9 }}>
                    <View style={styles.aboutContainer}>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback onPress={() => this.selectStudent(item.id, item.student_name, item.class_name, item.class_id, item.paymentstatus, item.gender)} key={item.id}>
                                    <Card containerStyle={styles.card}>
                                        <View style={styles.cardTitle}>
                                            <View style={styles.row}>
                                                <View style={{ width: wp('70'), flexDirection: 'row', alignItems: 'center' }}>
                                                    {
                                                        (
                                                            item.display_image ?
                                                                <Image source={{ uri: item.display_image }} style={styles.profileImage} /> :
                                                                <View>
                                                                    {
                                                                        item.gender == "male" ?
                                                                            <Image source={require('../../assets/Boy.png')} style={styles.profileImage} />
                                                                            :
                                                                            <Image source={require('../../assets/Girl.png')} style={styles.profileImage} />
                                                                    }
                                                                </View>
                                                        )
                                                    }
                                                    <Text style={styles.cardText1}>{item.student_name}  ({item.gender})</Text>
                                                </View>
                                                <View style={{ width: wp('10'), flexDirection: 'row', alignItems: 'center' }}>
                                                    {
                                                        this.state.student_id == item.id ?
                                                            <View style={{ marginLeft: wp('1'), flexDirection: 'row', alignItems: 'center' }}>
                                                                <View style={styles.round}>
                                                                    <Icon name="check" type="font-awesome" size={10} color="#ffffff" />
                                                                </View>
                                                            </View> :
                                                            null
                                                    }
                                                </View>
                                            </View>
                                            <Text style={styles.cardText}>{item.email}</Text>
                                            <Text style={styles.cardText}>{item.class_name}</Text>
                                        </View>
                                    </Card>
                                </TouchableWithoutFeedback>
                            )
                            }
                            horizontal={false}
                            contentContainerStyle={{ paddingBottom: '12 %', marginTop: '4%' }}
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
        margin: '3%'
    },
    cardImage: {
        flex: 1,
        alignItems: 'flex-end'
    },
    menuImage: {
        width: 50,
        height: 50
    },
    cardText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#868686',
        marginTop: '1%'
    },
    cardText1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        marginLeft: wp('2')
    },
    row: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    profileImage: {
        width: 20,
        height: 20,
        bottom: 2
    },
    round: {
        height: 16,
        width: 16,
        borderRadius: 16 / 2,
        backgroundColor: 'green',
        padding: '2%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cloudClassContainer: {
        backgroundColor: '#d31d33',
        justifyContent: 'center',
        alignItems: 'center',
        height: 17,
        padding: '4%',
        borderRadius: 5
    },
    cloudText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff',
    },
    countMainContainer: {
        position: 'absolute',
        right: -13,
        bottom: 11
    },
    cloudContainer: {
        marginLeft: wp('5'),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2%'
    },
})