import React from 'react';
import { StyleSheet, View, StatusBar, Image, TouchableWithoutFeedback } from 'react-native';
import Pdf from 'react-native-pdf';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default class PdfExample extends React.Component {
    constructor(props) {
        super(props)
    }
    goBack = () => {
        const backScreen = this.props.route.params.backScreen;
        this.props.navigation.goBack()
    }
    render() {
        const source = { uri: this.props.route.params.url };
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image source={require('../../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                </View>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        //console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        //console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        //console.log(error);
                    }}
                    onPressLink={(uri) => {
                        //console.log(`Link presse: ${uri}`)
                    }}
                    horizontal={true}
                    style={styles.pdf}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    pdf: {
        flex: 1,
        width: wp('100'),
        height: hp('100'),
        backgroundColor: 'black'
    },
    backMainContainer: {
        position: 'absolute',
        top: 30,
        left: 10,
        zIndex: 999999
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
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
});