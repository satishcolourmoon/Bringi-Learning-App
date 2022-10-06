import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import { baseUrl } from '../../constants';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
export default class Status extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            type: 1,
            student_id: '',
            data: []
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('student_id').then((student_id) => {
                this.setState({ student_id: student_id }, () => {
                    this.getStatusList(student_id)
                })
            })
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    getStatusList = async (student_id) => {
        this.setState({ loader: true })
        var postData = {
            action: 'support_status',
            student_id
        };

        const json = await apiCall(postData);
        if (json.status) {
            this.setState({ data: json.data, loader: false })
        } else {
            this.setState({ data: [], loader: false })
        }
    }

    goBack = () => {
        this.props.navigation.navigate('Support');
    }

    goToCreate = () => {
        this.props.navigation.navigate('Support');
    }

    noAction = () => {
        console.log('No action')
    }

    goToFeedBack = (item) => {
        this.props.navigation.navigate('SendFeedBack', {
            status_item: item
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
                <Header title="Support" title1="" backScreen="Home" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.aboutContainer}>
                            <View style={styles.tabContianer}>
                                <TouchableWithoutFeedback onPress={this.goToCreate}>
                                    <View style={styles.tab}>
                                        <Text style={styles.tabText1}>CREATE</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={styles.tab2}>
                                    <Text style={styles.tabText}>STATUS</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.center}>
                            {
                                this.state.data.map((item, index) => {
                                    return (
                                        <TouchableWithoutFeedback onPress={item.status == "CLOSE" ? () => this.goToFeedBack(item) : this.noAction}>
                                            <Card containerStyle={styles.card}>
                                                <View style={{ position: 'absolute', right: 0 }}>
                                                    {
                                                        item.status == "OPEN" && <View style={styles.statusContainer}>
                                                            <Text style={styles.statusText}>OPEN</Text>
                                                        </View>
                                                    }
                                                    {
                                                        item.status == "CLOSE" && <View style={styles.statusContainer1}>
                                                            <Text style={styles.statusText}>CLOSED</Text>
                                                        </View>
                                                    }

                                                </View>
                                                <View style={styles.cardTitle}>
                                                    <Text style={styles.cardText1}>{item.department}</Text>
                                                </View>
                                                <Text style={styles.desc}>{item.description}</Text>
                                            </Card>
                                        </TouchableWithoutFeedback>

                                    )
                                })
                            }
                        </View>
                        <View style={{ padding: 20 }} />
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
        marginTop: '4%'
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
        width: wp('46'),
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('46'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('46'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab2: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('46'),
        backgroundColor: '#ac90e7',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30
    },
    tabText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#ffffff',
    },
    tabText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
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
    statusText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        color: '#ffffff'
    },
    statusContainer: {
        backgroundColor: '#1cc800',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        borderRadius: 8
    },
    statusContainer1: {
        backgroundColor: '#f61511',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        borderRadius: 8
    }
})