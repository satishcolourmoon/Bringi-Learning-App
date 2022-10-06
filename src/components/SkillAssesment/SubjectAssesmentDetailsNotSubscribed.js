import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from '../Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
export default class NotSubscribed extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : false
        }
    }
    componentDidMount(){
        //setTimeout(()=>{this.setState({loader:false})},600)
    }
    render(){
        if(this.state.loader){
            return(
                <Loader />
            )
        }
        return(
            <View style={styles.container}>
                <StatusBar hidden />
                <Header title="Submit" title1="Learning Sheet" backScreen="SheetMenu"  headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={styles.aboutContainer}>
                    <Image source={require('../../../assets/success.png')}  style={styles.successImage} />
                    <Text style={styles.successText}>Thank you for submitting the worksheet</Text>
                    <Text style={styles.successText}>Below is your sheet id</Text>
                    <Text style={styles.successId}>{this.props.route.params.qr_code}</Text>
                </View>
                <Footer />
            </View>
        )
    }
}
const styles =  StyleSheet.create({
    container:{
        flex : 1,
        backgroundColor : '#ffffff'
    },
    topCurveImageContainer : {
        alignItems : 'flex-end'
    },
    bottomCurve : {
        flex : 1,
        justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('15')
    },
    aboutContainer : {
        flex : 0.9,
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : '4%'
    },
    backMainContainer : {
        position : 'absolute',
        top : 30,
        left : 10
    },
    backContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        elevation : 5,
        backgroundColor : '#eeeeee',
        borderRadius : 8
    },
    backIcon : {
        width : 55,
        height : 55
    },
    successImage : {
        width : 150,
        height : 150
    },
    successText : {
        fontFamily : 'Poppins-Regular',
        marginTop : '2%'
    },
    successId : {
        fontFamily : 'Poppins-SemiBold',
        marginTop : '1%',
        fontSize : 17
    }
})