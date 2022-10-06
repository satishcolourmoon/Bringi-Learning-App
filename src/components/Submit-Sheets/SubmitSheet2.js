import React from 'react';
import { View , StyleSheet , StatusBar , Text , TextInput } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Button';
import  {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import StarRating from 'react-native-star-rating';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer'; 
var radio_props = [
    {label: 'Easy', value: 'easy' },
    {label: 'Medium', value: 'medium' },
    {label: 'Hard', value: 'hard'},
  ];
export default class SubmitSheet2 extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : false,
            qr_code : '',
            time_hours : '',
            time_min : '',
            difficulty_level : 'easy',
            rating: 1,
            remarks : '',
            frontSheetUploaded : false,
            backSheetUploaded : false,
            roughSheetUploaded : false,
            VideoUploaded : false,
            showAlert : false,
            showAlert1 : false,
            error_message : '',
            upload_front_sheet : '',
            upload_back_sheet : '',
            upload_rough_sheet : '',
            upload_video : '',
            student_id : '',
        }
    }
    
    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id:student_id});
        })
    }
    showActionSheet = (type) => {
        if(type == "front"){
            this.ActionSheet1.show()
        }else if(type == "back"){
            this.ActionSheet2.show()
        }else if(type == "rough"){
            this.ActionSheet3.show()
        }else if(type == "video"){
            this.ActionSheet4.show()
        }
        
    }
    goBack = () => {
        this.props.navigation.navigate('SheetMenu');
    }
    goToSubmitSuccess = () => {
        this.props.navigation.navigate('ConfirmSubmit',{
            qr_code : this.props.route.params.qr_code,
           
        });
    }
    onStarRatingPress(rating) {
        this.setState({
            rating: rating
        });
    }
    SubmitSheet = () => {
        if(this.props.route.params.qr_code){
            if(this.state.time_hours){
                if(this.state.time_min){
                    if(this.state.difficulty_level){
                        if(this.state.rating){
                            this.props.navigation.navigate('SubmitSheet3',{
                                qr_code : this.props.route.params.qr_code,
                                time_hours : this.state.time_hours,
                                time_min : this.state.time_min,
                                difficulty_level : this.state.difficulty_level,
                                rating : this.state.rating,
                                remarks : this.state.remarks,
                                student_id : this.props.route.params.student_id
                            })
                        }else{
                            this.setState({showAlert:true,error_message:'Rating is required'});
                        } 
                    }else{
                        this.setState({showAlert:true,error_message:'Difficulty level is required'});
                    }
                }else{
                    this.setState({showAlert:true,error_message:'Time in min is required'});
                }
            }else{
                this.setState({showAlert:true,error_message:'Time in hours is required'});
            }
        }else{
            this.setState({showAlert:true,error_message:'Invalid Request.Try again'});
            setTimeout(()=>{this.props.navigation.navigate('SubmitSheet')},1200);
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
                <Header title="Submit" title1="Learning Sheet" backScreen={this.props.route.params.backScreen}  headerImage="submitSheet" navigation={this.props.navigation} />  
                  <View style={{flex:0.9,justifyContent:'center',alignItems:'center'}}>
                     <ScrollView>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Time Taken</Text>
                            <View style={styles.row}>
                                <View style={{width:wp('43')}}>
                                    <View style={styles.inputContainer2}>
                                        <TextInput
                                            placeholder="Hours"
                                            style={styles.input2}
                                            value={this.state.time_hours}
                                            keyboardType="number-pad"
                                            onChangeText={(time_hours)=>{this.setState({time_hours:time_hours})}}
                                        />
                                    </View>
                                </View>
                                <View style={{width:wp('43')}}>
                                    <View style={styles.inputContainer2}>
                                        <TextInput 
                                            placeholder="Minutes"
                                            style={styles.input2}
                                            value={this.state.time_min}
                                            keyboardType="number-pad"
                                            onChangeText={(time_min)=>{this.setState({time_min:time_min})}}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Difficulty Level</Text>
                            <View style={{marginTop:'2%',flexDirection:'row',marginLeft : '2%'}}>
                            { 
                                radio_props.map((obj, i) => (
                                    <RadioButton labelHorizontal={true} key={i} >
                                        <RadioButtonInput
                                            obj={obj}
                                            index={i}
                                            onPress={()=>{this.setState({difficulty_level:obj.value})}}
                                            isSelected={this.state.difficulty_level == obj.value}
                                            borderWidth={1}
                                            buttonInnerColor={'#e74c3c'}
                                            buttonOuterColor={this.state.difficulty_level == obj.value ? '#2196f3' : '#000'}
                                            buttonSize={15}
                                            buttonOuterSize={20}
                                        />
                                        <RadioButtonLabel
                                            obj={obj}
                                            onPress={()=>{console.log('hii')}}
                                            index={i}
                                            labelHorizontal={true}
                                            labelStyle={{fontSize: 13, color: '#000',fontFamily:'Poppins-Regular',marginRight:15}}
                                            labelWrapStyle={{margin:0}}
                                        />
                                    </RadioButton>
                                ))
                            }  
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Rating</Text>
                            <StarRating
                                disabled={false}
                                rating={this.state.rating}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                starSize={30}
                                containerStyle={{marginLeft : '2%',marginTop:'2%'}}
                                halfStarEnabled={false}
                                fullStarColor="#df2238"
                            />
                        </View>  
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Remark</Text>
                            <View>
                                <View style={styles.inputContainer1}>
                                    <TextInput
                                        placeholder=""
                                        style={styles.input1}
                                        onChangeText={(remarks)=>this.setState({remarks:remarks})}
                                        value={this.state.remarks}
                                        multiline={true}
                                        numberOfLines={5}
                                    />
                                </View>
                            </View>
                        </View>  
                        <View style={{marginTop:'5%'}}>
                            <Button onPress={this.SubmitSheet}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="NEXT"  />
                        </View>
                        <View style={{padding:'3%'}}></View>
                        </ScrollView>
                    </View>
                <Footer />
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
        flex : 0.1,
        justifyContent : 'flex-end'
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('12')
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
    or : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    qrImage : {
        width : 80,
        height : 80
    },
    secondContainer : {
         margin : '7%'
    },
    label : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : '#000000',
        marginLeft : '2%'
    },
    label1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : '#000000',
        marginLeft : '9%'
    },
    inputContainer : {
        marginTop : '3%',
    },
    row : {
        flexDirection : 'row'
    },
    timeContainer : {
        backgroundColor : '#ececec',
        height : hp('6'),
        width : wp('30'),
        borderRadius : 30,
        justifyContent : 'center',
        alignItems : 'center',
        margin : '1%'
    },
    timeText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
    },
    frontImage : {
        width : 120,
        height : 150
    },
    scanImage : {
        width : 120,
        height : 120,
        position : 'absolute'
    },
    input1:{
        backgroundColor:'#ececec',
        width : wp('75'),
        borderColor : '#ececec',
        borderRadius : 30,
        fontFamily:'Poppins-SemiBold'
    },
    input2 : {
        backgroundColor:'#ececec',
        width : wp('30'),
        borderColor : '#ececec',
        borderRadius : 30,
        fontFamily:'Poppins-SemiBold'
    },
    inputContainer1:{
        backgroundColor:'#ececec',
        borderRadius : 30,
        paddingLeft : wp('5'),
        margin : '0.4%'
    },
    inputContainer2:{
        backgroundColor:'#ececec',
        borderRadius : 30,
        paddingLeft : wp('5'),
        margin : '0.4%'
    },
    uploadedText : {
        fontFamily : 'Poppins-SemiBold',
        marginLeft : '2%'
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
      },
      textBold: {
        fontWeight: '500',
        color: '#000'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        
      },
      cameraStyle : {
          width : 150,
          height : 50,
      },
      Qrcontainer : {
        flex : 0.3,
        width : 150,
        height : 50,
      }
})