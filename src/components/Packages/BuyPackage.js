import React from 'react';
import Package from './Package';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import Asyncstorage from '@react-native-community/async-storage';
import { apiCall } from '../../utils';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
export default class BuyPackage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            data: [],
            package_id: '',
            details: {}
        }
    }
    componentDidMount() {
        Asyncstorage.getItem('student_id').then((student_id) => {
            this.getPackages(student_id)
        })

    }
    getPackages = async (student_id) => {
        let postData = {
            action: 'getPackages',
            student_id: student_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, data: [], details: {}, });
        } else if (json.status) {
            this.setState({ loader: false, data: json.packages, details: json.packages[0], package_id: json.packages[0].id });
        }
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    selectPackage = (item) => {
        this.setState({ details: item, package_id: item.id })
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
                <Header title="Buy Package" title1="" backScreen="PackageMenu" headerImage="subject" navigation={this.props.navigation} />
                <View style={styles.tabVContainer}>
                    <View style={styles.scrollContianer}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.state.data.map((item, index) => {
                                    return (
                                        <TouchableWithoutFeedback key={item.id} onPress={() => this.selectPackage(item, index)}>
                                            <View style={this.state.package_id == item.id ? styles.qnsContainer1 : styles.qnsContiner2}>
                                                <Text style={this.state.package_id == item.id ? styles.questionNo : styles.questionNo1}>{item.package_name}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    <ScrollView>
                        <Package data={this.state.details} navigation={this.props.navigation} />
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
    descContainer: {
        marginLeft: wp('4'),
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
    },
    tabVContainer: {
        flex: 0.9,
        backgroundColor: '#ffffff'
    },
    scrollContianer: {
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    qnsContiner2: {
        width: wp('38'),
        height: hp('6'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    qnsContainer1: {
        backgroundColor: '#b29aeb',
        width: wp('38'),
        height: hp('6'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionNo: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#ffffff',
        textAlign: 'center'
    },
    questionNo1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#000000',
        textAlign: 'center'
    },
})