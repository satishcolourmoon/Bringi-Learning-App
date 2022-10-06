import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Asyncstorage from '@react-native-community/async-storage';
export default class Package extends React.Component {
    constructor(props) {
        super(props)
    }
    goToMakePayment = (month, package_name, package_id) => {
        Asyncstorage.getItem('student_id').then((student_id) => {
            Asyncstorage.getItem('student_name').then((student_name) => {
                Asyncstorage.getItem('class_name').then((class_name) => {
                    this.props.navigation.navigate('MakePayment', {
                        month: month,
                        student_name: student_name,
                        class_name: class_name,
                        package_name: package_name,
                        student_id: student_id,
                        package_id: package_id
                    });
                });
            });
        });
    }
    render() {
        const details = this.props.data;
        const description = details.description
        const features = description.split('?');
        return (
            <View style={styles.packageContainer}>
                <Text style={styles.packageHeader}>{details.package_name}</Text>
                <View style={styles.priceContainer}>
                    <View>
                        <View style={styles.strikeContainer}>
                            <Text style={styles.price}>₹{details.original_amount}</Text>
                        </View>
                        <View style={styles.strike}></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.offerprice}>₹{details.amount}</Text>
                        <Text style={styles.offerprice1}>/SUBJECT</Text>
                    </View>
                </View>
                <View style={styles.featureContainer}>
                    {
                        features.map((item, index) => {
                            return (
                                <Text style={styles.feature} key={index}>✓ {item}</Text>
                            )
                        })
                    }
                </View>
                <View style={styles.center}>
                    <TouchableWithoutFeedback onPress={() => this.goToMakePayment(details.month, details.package_name, details.id)}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>BUY NOW</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    packageContainer: {
        backgroundColor: '#ee1818',
        padding: '5%',
        marginLeft: '7%',
        marginRight: '7%',
        marginTop: '5%',
        borderRadius: 6
    },
    packageHeader: {
        fontFamily: 'Poppins-SemiBold',
        color: '#ffffff',
        fontSize: 16
    },
    priceContainer: {
        padding: '6%',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        height: heightPercentageToDP('10'),
        borderRadius: 6,
        marginTop: heightPercentageToDP('1')
    },
    strike: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginTop: 9,
        width: 43
    },
    strikeContainer: {
        position: 'absolute',
        zIndex: 99999,
        top: 0,
        bottom: 0
    },
    price: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13
    },
    offerprice: {
        fontFamily: 'Poppins-Bold',
        fontSize: 27,
        color: '#ed1918'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    offerprice1: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        color: '#ee1818',
    },
    feature: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff'
    },
    featureContainer: {
        margin: '2%'
    },
    buttonContainer: {
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        width: 110,
        height: 38,
        padding: '3%',
        borderRadius: 20,
        margin: '2%'
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: '#ee1818'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})