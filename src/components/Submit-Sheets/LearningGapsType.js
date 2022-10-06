import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../components/Loader';
export default class LearningGapsType extends React.Component{
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
        this.props.navigation.navigate('LearningGaps'); 
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
                        <Text style={styles.heading}>Learning</Text>
                        <Text style={styles.heading}>Gaps</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/subject.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                
                <View style={styles.aboutContainer}>
                    <TouchableWithoutFeedback onPress={this.goToSubject}>
                        <Card containerStyle={styles.card}>
                            <View style={styles.cardTitle}>
                                <Text style={styles.cardText1}>LEARN</Text>
                                <View style={styles.nextContainer}>
                                    <Image source={require('../../assets/next.png')}  style={styles.icon}/>
                                </View>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback  onPress={this.goToSubject}>
                        <Card containerStyle={styles.card}>
                            <View style={styles.cardTitle}>
                                <Text style={styles.cardText1}>RESUBMIT</Text>
                                <View style={styles.nextContainer}>
                                    <Image source={require('../../assets/next.png')}  style={styles.icon}/>
                                </View>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
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
        alignItems : 'center'
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
    card : {
        width : wp('86'),
        borderRadius : 12,
        backgroundColor : '#ffffff',
        elevation: 10
    },
    cardTitle : {
        flexDirection : 'row'
    },
    cardText1 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
        color : '#8a4190'
    },
    descContainer : {
        marginLeft : wp('4')
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    icon : {
        height : 25,
        width : 25
    },
    nextContainer : {
        position : 'absolute',
        right : 0
    }
})