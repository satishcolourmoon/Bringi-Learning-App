import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';

export default class OnlineMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true
        }
    }
    componentDidMount() {
        setTimeout(() => { this.setState({ loader: false }) }, 600)
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    goToExtraPractise = () => {
        this.props.navigation.navigate('ExtraPractise');
    }
    goToAdaptivePractise = () => {
        this.props.navigation.navigate('PathToSuccess');
    }
    goToCompetativePractise = () => {
        this.props.navigation.navigate('CompetativePractise');
    }
    goToReport = () => {
        this.props.navigation.navigate('Report');
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
                    <View style={styles.row}>
                        <TouchableWithoutFeedback onPress={this.goToExtraPractise}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../../assets/in3.png')} resizeMode="contain" style={styles.menuImage} />
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>EXTRA</Text>
                                    <Text style={styles.cardText1}>PRACTICE</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToAdaptivePractise}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../../assets/ass.png')} resizeMode="contain" style={styles.menuImage} />
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>ADAPTIVE</Text>
                                    <Text style={styles.cardText1}>PRACTICE</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.row}>
                        <TouchableWithoutFeedback onPress={this.goToCompetativePractise}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../../assets/s2.png')} resizeMode="contain" style={styles.menuImage} />
                                </View>
                                <View style={styles.cardTitle1}>
                                    <Text style={styles.cardText}>COMPETITIVE</Text>
                                    <Text style={styles.cardText1}>PRACTICE</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.goToReport}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../../assets/report.png')} resizeMode="contain" style={styles.menuImage} />
                                </View>
                                <View style={styles.cardTitle1}>
                                    <Text style={styles.cardText}>Online</Text>
                                    <Text style={styles.cardText1}>Report</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
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
    descContainer: {
        marginLeft: wp('4')
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238'
    },
    secondContainer: {
        flex: 0.9,
        alignItems: 'center'
    },
    card: {
        width: wp('40'),
        height: hp('17'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
    },
    cardImage: {
        flex: 1,
        alignItems: 'flex-end'
    },
    menuImage: {
        width: 50,
        height: 50
    },
    cardTitle: {
        marginTop: hp('5')
    },
    cardTitle1: {
        marginTop: hp('7')
    },
    cardText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13
    },
    row: {
        flexDirection: 'row'
    }
})