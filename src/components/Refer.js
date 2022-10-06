import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Input from '../components/TextInputs';
import Button from '../components/Button';
import Loader from '../components/Loader';
export default class Refer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true
        }
    }
    componentDidMount(){
        setTimeout(()=>{this.setState({loader:false})},600)
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
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
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image  source={require('../../assets/back.png')} style={styles.backIcon}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>Refer a Friend</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/subject.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                
                <View style={styles.aboutContainer}>
                     <Image source={require('../../assets/refer.png')}  style={styles.image}/>
                     <View style={styles.boardContainer}>
                        <Text style={styles.referText}>Refer Friends</Text>
                        <Text style={styles.referText}>& Earn Upto</Text>
                        <Text style={styles.price}>₹5000</Text>
                     </View>
                 </View>
                 <View style={styles.contentDescription}>
                        <Text style={styles.desc}>Refer a friend and earn Rs.100.Your</Text>
                        <Text style={styles.desc}>friend earns Rs.50 when they use you</Text>
                        <Text style={styles.desc}>referal code.Earn additional Rs.100</Text>
                        <Text style={styles.desc}>everytime your friend makes a</Text>
                        <Text style={styles.desc}>purchase</Text>
                        <View style={styles.buttonContainer}>
                            <Button onPress={this.goToHome}  backgroundColor="#0f9a3d" buttonTextColor="#ffffff" borderColor="#0f9a3d" borderWidth={1.5}  text="REFERAL CODE : C15JHG" />
                        </View>
                 </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    <View style={styles.shareContainer}>
                        <Text style={styles.shareText}>SHARE</Text>
                        <View style={styles.row}>
                            <Image source={require('../../assets/fb.png')}  style={styles.shareImage} />
                            <Image source={require('../../assets/wts.png')}  style={styles.shareImage} />
                        </View>
                    </View>
                </View>
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
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : hp('2')
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
    descContainer : {
        marginLeft : wp('4')
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    image : {
        width : 320,
        height : 170
    },
    boardContainer : {
       position : 'absolute'
    },
    referText : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 15,
        color : '#ffffff'
    },
    price : {
        fontFamily : 'Poppins-SemiBold',
        color : '#d9fe00',
        fontSize : 22,
    },
    desc : {
        fontFamily : 'Poppins-Regular',
        color : '#000000',
        fontSize : 14,
        textAlign : 'center'
    },
    contentDescription : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    buttonContainer : {
        marginTop : hp('1')
    },
    shareContainer : {
        position : 'absolute',
        right : 20,
        bottom : 15
    },
    row : {
        flexDirection : 'row'
    },
    shareImage : {
        width : 35,
        height : 35,
        marginLeft : wp('2')
    },
    shareText : {
        fontFamily : 'Poppins-Regular',
        marginLeft : wp('4'),
        color : '#ffffff',
        fontSize : 14
    }
})