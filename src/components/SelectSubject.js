import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text ,ScrollView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { baseUrl } from '../constants';
import AwesomeAlert from 'react-native-awesome-alerts';
export default class SelectSubject extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loader : true,
            showAlert : false,
            error_message : '',
            data : [],
            student_id : '',
            showAlert : false,
            error_message : ''
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('class_id').then((class_id)=>{
            AsyncStorage.getItem('board_id').then((board_id)=>{
                AsyncStorage.getItem('student_id').then((student_id)=>{
                    this.setState({student_id},() => {
                        this.getSubjects(class_id,board_id,student_id);
                    })
                   
                })
            });
        });
    }

    getSubjects = (class_id,board_id,student_id)  => {
        fetch(baseUrl+'user', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
        },
        body:qs.stringify({ 
            action : 'subjectlist',
            class_id : class_id,
            board_id : board_id,
            user_id : student_id
        })
        }).then((response) => response.json())
        .then((json) => {
            if(!json.status){
                this.setState({loader : false,data:[]});
            }else if(json.status){
                this.setState({loader : false,data:json.subjects});
            }
        })
        .catch((error) => {
            this.setState({loader : false});  
            console.error(error);
        });
    }

    goBack = () => {
        this.props.navigation.navigate('SkillAssessment');
    }

    goToSelectTest = (subject_id,subject_title,assessment_status,message)  => {
        if(assessment_status){
            this.props.navigation.navigate('Subject',{subject_id:subject_id,subject_title:subject_title});
        }else{
            this.setState({showAlert:true,error_message:message});
            this.props.navigation.navigate('LearningAnalysis')
        }
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
                <AwesomeAlert
                    show={this.state.showAlert}
                    title="Attention!"
                    message={this.state.error_message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({showAlert:false});
                    }}
                />
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image  source={require('../../assets/back.png')} style={styles.backIcon}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>Select  Subject</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/subject.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <ScrollView style={{flex:.8}} showsVerticalScrollIndicator={false}>
                <View style={styles.aboutContainer}>
                    {
                        this.state.data.map((item)=>{
                            return(
                                <TouchableWithoutFeedback onPress={()=>this.goToSelectTest(item.id,item.title,item.assessment_status,item.message)} key={item.id}>
                                    <Card containerStyle={styles.card}>
                                        <View style={styles.cardTitle}>
                                            <Text style={styles.cardText1}>{item.title}</Text>
                                            <View style={styles.nextContainer}>
                                                <Image source={require('../../assets/next.png')}  style={styles.icon}/>
                                            </View>
                                        </View>
                                    </Card>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </View>
            </ScrollView>
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
        flex : 0.2,
        justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('15')
    },
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        margin : '5%'
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