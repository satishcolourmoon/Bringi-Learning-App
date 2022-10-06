import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native';
import { images } from '../constants';
export default function Header(props) {

    const goBack = (props) => {
        if ((props.title == "Learning" && props.title1 == "Analysis") || (props.title == "Submit Learning" && props.title1 == "Sheet Success")) {
            props.navigation.navigate('Home')
        } else {
            props.navigation.goBack()
        }

    }

    if (props.headerImage == "submitSheet") {
        var source = images.submit_sheet
    } else if (props.headerImage == "confirmSubmit") {
        var source = images.confirm_submit
    } else if (props.headerImage == "la") {
        var source = images.la
    } else if (props.headerImage == "subject") {
        var source = images.subject
    } else if (props.headerImage == "learn_more") {
        var source = images.learn_more
    } else if (props.headerImage == "rewards") {
        var source = images.rewards
    } else if (props.headerImage == "support") {
        var source = images.support
    } else if (props.headerImage == "vc") {
        var source = images.vc
    }

    return (
        <View>
            <View style={styles.backMainContainer}>
                <TouchableWithoutFeedback onPress={() => goBack(props)}>
                    <Image source={require('../../assets/back.png')} style={styles.backIcon} />
                </TouchableWithoutFeedback>
                <View style={styles.descContainer}>
                    <Text style={styles.heading}>{props.title}</Text>
                    {
                        props.title1 ?
                            <Text style={styles.heading1}>{props.title1}</Text>
                            : null
                    }
                </View>
            </View>
            <View style={styles.topCurveImageContainer}>
                <Image source={source} resizeMode="stretch" style={styles.topCurveImage} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
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
        marginLeft: wp('4'),
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
    },
    heading1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
        bottom: 8
    },
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
})