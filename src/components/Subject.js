import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text , FlatList} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import Nodata from '../components/NoData';
import { Divider } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import qs from 'qs';
import { baseUrl } from '../constants';
import AwesomeAlert from 'react-native-awesome-alerts';
export default class Subject extends React.Component{
    
    constructor(props){
        super(props)
        this.state = { 
            loader : true,
            data : [],
            showAlert : false,
            error_message : ''
        } 
    }

    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id:student_id},()=>{this.getTests(student_id)})
        });
     }

     getTests = (student_id)  => {
        fetch(baseUrl+'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body:qs.stringify({ 
                action : 'getTestlist',
                student_id : student_id,
                subject_id :this.props.route.params.subject_id
            })
            }).then((response) => response.json())
            .then((json) => {
                if(!json.status){
                    this.setState({loader : false,data:[]});
                }else if(json.status){
                    this.setState({loader : false,data:json.test_list});
                }
            })
            .catch((error) => {
                this.setState({loader : false});  
                console.error(error);
            });
    }

    goBack = () => {
        this.props.navigation.navigate('SelectSubject');
    }

    goToQuestions = (test_id,title,status) => {
        if(status == "pending"){
            fetch(baseUrl+'user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body:qs.stringify({ 
                    action : 'exam_start_timer',
                    test_id : test_id,
                    user_id : this.state.student_id
                })
                }).then((response) => response.json())
                .then((json) => {
                if(!json.status){
                    this.setState({showAlert : true,error_message:json.message});
                }else if(json.status){
                    this.props.navigation.navigate('Questions',{
                            test_id:test_id,
                            subject_id:this.props.route.params.subject_id,
                            subject_title : this.props.route.params.subject_title,
                            test_name : title,
                            loader : false
                        });
                    }
                }).catch((error) => {
                    this.setState({loader : false});  
                    console.error(error);
                });
        }else{
            this.setState({showAlert:true,error_message:'Test already completed'})
            setTimeout(()=>{this.props.navigation.navigate('AfterExam',{test_id:test_id})},1200)
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
                  <AwesomeAlert
                        show={this.state.showAlert}
                        title="Attention!"
                        message={this.state.error_message}
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        cancelButtonColor="#b7a3ef"
                        showCancelButton={true}
                        cancelText="Okay"
                        onCancelPressed={() => {
                            this.setState({showAlert:false});
                        }}
                    />
                   <StatusBar hidden />
                    <View style={styles.backMainContainer}>
                        <TouchableWithoutFeedback onPress={this.goBack}>
                            <Image  source={require('../../assets/back.png')} style={styles.backIcon}/>
                        </TouchableWithoutFeedback>
                        <View style={styles.descContainer}>
                            <Text style={styles.heading}>{this.props.route.params.subject_title}</Text>
                        </View>
                    </View>
                    <View style={styles.topCurveImageContainer}>
                        <Image source={require('../../assets/maths.png')} resizeMode="stretch" style={styles.topCurveImage} />
                    </View>
                   <View style={{flex:.8,backgroundColor:'#ffffff'}}>
                        <FlatList
                            ListEmptyComponent={
                                <View style={{justifyContent:'center',alignItems:'center'}}>
                                    <Nodata title="No Tests Found.Please check back later"/>
                                </View>
                            }
                            data={this.state.data}
                            renderItem={({ item }) => (
                                <View>
                                    <TouchableWithoutFeedback onPress={() => this.goToQuestions(item.id,item.exam_name,item.test_status)}>
                                        <View style={styles.boxContainer}>
                                            <Text style={styles.boxHeader}>{item.exam_name}</Text>
                                            <View>
                                                <Image source={require('../../assets/box.png')}  style={styles.boxBackImage}/>
                                                <View style={styles.noteContainer}>
                                                    <Image source={require('../../assets/note.png')}  style={styles.noteImage}/>
                                                    <Text style={styles.start}>START TEST</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <Divider  style={styles.divider}/>
                                </View>  
                            )}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{backgroundColor:'#ffffff'}}
                        />  
                   </View>
                    <View style={{paddingBottom:'5%'}}></View>
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
        backgroundColor : '#ffffff',
    },
    topCurveImageContainer : {
        alignItems : 'flex-end'
    },
    bottomCurve : {
        flex : 0.2,
        justifyContent : 'flex-end'
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
    descContainer : {
        marginLeft : wp('4')
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    boxContainer : {
        justifyContent : 'center',
        marginLeft : wp('6')
        // alignItems : 'center',
    },
    boxHeader : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 16,
        margin : '1%'
    },
    boxBackImage : {
        width : 200,
        height : 150
    },
    noteContainer : {
        position : 'absolute',
        top : 20,
        left : 70
    },
    noteImage : {
        width : 70,
        height : 80
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    start : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 12,
        marginTop : '3%',
        color : '#83448a'
    },
    divider : {
        marginTop : '4%'
    }
})