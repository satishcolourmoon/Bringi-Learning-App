import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer';
import AsyncStorage from '@react-native-community/async-storage';
export default class LearningGapsType extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : false,
            student_id : ''
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id:student_id});
        })
    }

    goToLearningGuide = () => {
        this.props.navigation.navigate('GuideVideos',{
            sheet_id : this.props.route.params.sheet_id,
            backScreen : 'LearningGapsType'
        })
    }

    goToResubmit = () => {
        this.props.navigation.navigate('SubmitSheet2',{
            qr_code : this.props.route.params.sheet_id,
            student_id : this.state.student_id,
            backScreen : 'LearningGapsType'
        });
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
                <Header title="Learning" title1="Gaps" backScreen={this.props.route.params.backScreen}  headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{flex:0.9}}>
                    <View style={styles.aboutContainer}>
                        <TouchableWithoutFeedback onPress={this.goToLearningGuide}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText1}>LEARN</Text>
                                    <View style={styles.nextContainer}>
                                        <Image source={require('../../../assets/next.png')}  style={styles.icon}/>
                                    </View>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback  onPress={this.goToResubmit}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText1}>RESUBMIT</Text>
                                    <View style={styles.nextContainer}>
                                        <Image source={require('../../../assets/next.png')}  style={styles.icon}/>
                                    </View>
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