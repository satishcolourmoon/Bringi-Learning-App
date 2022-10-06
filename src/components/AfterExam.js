import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from './Loader';
import { Card } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { baseUrl } from '../constants';
export default class AfterExam extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : false,
            student_id : '',
            data : {}
        } 
    }
    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id:student_id},()=>{this.getTestBasicReport(student_id)})
        });
    }
    getTestBasicReport = (student_id) => {
        this.setState({loader : true});  
        fetch(baseUrl+'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body:qs.stringify({ 
                action : 'getUsertestReport',
                user_id : student_id,
                test_id : this.props.route.params.test_id
            })
            }).then((response) => response.json())
            .then((json) => {
                if(!json.status){
                    this.setState({loader : false,data:{}});
                }else if(json.status){
                    this.setState({loader : false,data:json.data});
                }
            })
            .catch((error) => {
                this.setState({loader : false});  
                console.error(error);
            });
    }
    goBack = () => {
        this.props.navigation.navigate('Subject');
    }
    goToQuestionPaper = () => {
        this.props.navigation.navigate('Questions');
    }
    goToLearningAnalysis = () => {
        this.props.navigation.navigate('LearningAnalysis');
    }
    retakeTest = () => {
        fetch(baseUrl+'user', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
        },
        body:qs.stringify({ 
            action : 'exam_start_timer',
            test_id : this.props.route.params.test_id,
            user_id : this.state.student_id
        })
        }).then((response) => response.json())
        .then((json) => {
            if(!json.status){
                this.setState({showAlert : true,error_message:json.message});
            }else if(json.status){
                this.props.navigation.navigate('Questions',{
                    test_id:this.props.route.params.test_id,
                    subject_id:this.state.data.subject_id,
                    subject_title : this.state.data.subject,
                    test_name : this.state.data.test_name,
                    loader : false
                });  
            }
        }).catch((error) => {
            this.setState({loader : false});  
            console.error(error);
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
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image  source={require('../../assets/back.png')} style={styles.backIcon}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>{this.state.data.subject}</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/maths.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View>
                    <View style={styles.textContainer}>
                      <Text style={styles.dearText}>Dear {this.state.data.student_name},</Text>
                      <View style={styles.row}>
                         <Text style={styles.dearsubText}>You Have already taken </Text>
                         <Text style={styles.gradeText}>{this.state.data.grade}</Text>
                      </View>
                      <View style={styles.row}>
                         <Text style={styles.subjectText}>{this.state.data.subject} </Text>
                         <Text style={styles.dearsubText}>Assessment</Text>
                      </View>
                    </View>
                    <View style={styles.center}>
                        <TouchableWithoutFeedback onPress={this.goToLearningAnalysis}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/ass1.png')}  style={styles.searchImage}/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>LEARNING</Text>
                                    <Text style={styles.cardText1}>ANALYSIS</Text>
                                    <Text style={styles.cardText2}>Click Here</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.retakeTest}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../assets/ass.png')}  style={styles.assImage}/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>RETAKE</Text>
                                    <Text style={styles.cardText1}>TEST</Text>
                                    <Text style={styles.cardText2}>Click Here</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    {/* <View style={styles.proceedContainer}>
                        <Text style={styles.proceedText}>SUBMIT </Text>
                    </View> */}
                </View>
            </View>
        )
    }
}
const styles =  StyleSheet.create({
    container:{
        flex : 1,
    },
    topCurveImageContainer : {
        alignItems : 'flex-end'
    },
    row : {
        flexDirection : 'row'
    },
    bottomCurve : {
        flex : 1,
      justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('13')
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
        marginLeft : wp('4'),
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238',
    },
    dearText : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 15,
    },
    subheading : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
    },
    proceedContainer : {
        position : 'absolute',
        right : 20,
        bottom : 15
    },
    proceedText : {
        fontFamily : 'Poppins-SemiBold',
        marginLeft : wp('4'),
        color : '#ffffff',
        fontSize : 15
    },
    textContainer : {
        marginLeft : wp('7')
    },
    dearsubText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
    },
    gradeText : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 14,
        color : '#e51b27'
    },
    subjectText : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 14,
        color : '#87418a'
    },
    cardTitle : {
        marginTop : hp('8')
    },
    cardText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 16
    },
    cardText1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 16,
        color : '#8b418e'
    },
    cardText2 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 12
    },
    card : {
        width : wp('75'),
        height : hp('23'),
        borderRadius : 12,
        backgroundColor : '#ffffff',
        elevation: 10
    },
    cardImage : {
        flex : 1,
        alignItems : 'flex-end'
    },
    searchImage : {
        height : 100,
        width : 100 
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    assImage : {
        width : 90,
        height : 105
    },
})