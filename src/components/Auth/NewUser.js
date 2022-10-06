import React from 'react';
import { View , Text , StyleSheet , StatusBar , Image , ScrollView ,Picker , TextInput , KeyboardAvoidingView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Button from '../Button';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Loader from '../../common/Loader';
import { apiCall } from '../../utils';
import AwesomeAlert from 'react-native-awesome-alerts';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
export default class NewUser extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true,
            gender : '',
            classes : [],
            boards : [],
            student_name : '',
            gender : '',
            dob : '', 
            email : '',
            class_id : '',
            board_id : '',
            error_message : '',
            showAlert : false,
            btnLoader : false
        }
        AsyncStorage.getItem('device_token').then((device_token) => {
            this.state.device_token=device_token;
          })
    }
    componentDidMount(){
        this.getClasses();
        this.getBoard();
    }
    getClasses = async() => {
        let postData = { 
            action : 'classes'
        }
        const json = await apiCall(postData)
        if(!json.status){
            this.setState({classes:[]});
        }else if(json.status){
            this.setState({classes:json.classes});
        }
    }
    getBoard = async() => {

        let postData = { 
            action : 'boardlist'
        }
        const json = await apiCall(postData)
        if(!json.status){
            this.setState({boards:[],loader : false});
        }else if(json.status){
            this.setState({boards:json.boardlist,loader : false});
        }

      
    }
    registerStudent = async() => {

        if(this.state.student_name){

            if(this.state.gender){

                if(this.state.dob){

                    if(this.state.email){

                        if(this.state.class_id){

                            if(this.state.board_id){
                                this.setState({btnLoader : true});
                                let postData = { 
                                    action : 'student_register',
                                    parent_id:this.props.route.params.parent_id,
                                    student_name : this.state.student_name,
                                    gender : this.state.gender,
                                    dob : this.state.dob,
                                    email : this.state.email,
                                    class_id : this.state.class_id,
                                    board_id : this.state.board_id,
                                    token:this.state.device_token
                                }
                                const json = await apiCall(postData)
                                this.setState({btnLoader : false});  
                                if(!json.status){
                                    this.setState({showAlert:true,error_message:json.message});
                                }else if(json.status){
                                    this.setState({showAlert:true,error_message:"Student registered successfully"});
                                    this.props.navigation.navigate('Login')
                                }
                            }else{
                                this.setState({showAlert:true,error_message:"Select your board"});
                            }

                        }else{
                            this.setState({showAlert:true,error_message:"Select your class"});
                        }

                    }else{
                        this.setState({showAlert:true,error_message:"Email id is required"});
                    }

                }else{
                    this.setState({showAlert:true,error_message:"Date of birth is required"});
                }

            }else{
                this.setState({showAlert:true,error_message:"Select your gender"});
            }

        }else{
            this.setState({showAlert:true,error_message:"Student name is required"});
        }
    }
    goToLogin = () => {
        this.props.navigation.navigate('Login')
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
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={true}
                        cancelButtonColor="#b7a3ef"
                        showCancelButton={true}
                        cancelText="Okay"
                        onCancelPressed={() => {
                            this.setState({showAlert:false});
                        }}
                    />
                    <StatusBar hidden />
                    <View style={styles.topCurve}>
                        <Image source={require('../../../assets/tcurve.png')} resizeMode="stretch" style={styles.topCurveImage} />
                    </View>
                    <KeyboardAvoidingView behavior='position'>
                        <ScrollView>
                            <View style={styles.logoContainer}>
                                <Image source={require('../../../assets/logo.png')}  style={styles.logoImage} resizeMode="contain"/>
                            </View> 
                            <View style={styles.secondContainer}>
                                <Text style={styles.heading}>Register</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Student name"
                                            style={styles.input}
                                            onChangeText={(student_name)=>this.setState({student_name:student_name})}
                                            value={this.state.student_name}
                                            placeholderTextColor="#000"
                                            
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={this.state.gender}
                                            style={{ height: 48,  width : wp('75') }}
                                            onValueChange={(gender) => this.setState({gender:gender})}
                                        >
                                            <Picker.Item label="Select gender" value="" />
                                            <Picker.Item label="Male" value="male" />
                                            <Picker.Item label="Female" value="female" />
                                        </Picker>
                                    </View>
                                    <View style={styles.inputContainer}>
                                    <DatePicker
                                        style={{width: wp('73')}}
                                        date={this.state.dob}
                                        mode="date"
                                        placeholder="DOB"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateInput: {
                                            borderColor : '#ececec',
                                            borderWidth : 0,
                                            marginRight : wp('40'),
                                            color : 'red'
                                        },
                                        placeholderText:{
                                            color : '#000',
                                            fontFamily : 'Roboto-Regular'
                                        }
                                        // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {this.setState({dob: date})}}
                                />
                                    </View> 
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Email address"
                                            style={styles.input}
                                            onChangeText={(email)=>this.setState({email:email})}
                                            value={this.state.email}
                                            placeholderTextColor="#000"
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={this.state.class_id}
                                            style={{ height: 48,  width : wp('75') }}
                                            onValueChange={(class_id) => this.setState({class_id:class_id})}
                                        >
                                        <Picker.Item label="Select class" value="" />
                                            {
                                                this.state.classes.map((item)=>{
                                                    return(
                                                        <Picker.Item label={item.title} value={item.id} key={item.id} />
                                                    )
                                                })
                                            }
                                        </Picker>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={this.state.board_id}
                                            style={{ height: 48,  width : wp('75') }}
                                            onValueChange={(board_id) => this.setState({board_id:board_id})}
                                        >
                                        <Picker.Item label="Select board" value="" />
                                            {
                                                this.state.boards.map((item)=>{
                                                    return(
                                                        <Picker.Item label={item.title} value={item.id} key={item.id} />
                                                    )
                                                })
                                            }
                                        </Picker>
                                    </View>
                                <View>
                                    <Button onPress={this.registerStudent}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="SUBMIT"  loader={this.state.btnLoader}/>
                                </View>
                                <View style={styles.row}>
                                <Text style={styles.subtext}>Already have an account </Text>
                                <TouchableWithoutFeedback onPress={this.goToLogin}>
                                    <Text style={styles.loginText}>Login</Text>
                                </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <View style={styles.bottomCurve}>
                        <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    </View>
                </View>
           
        )
    }
} 
const styles  = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff'
    },
    topCurve : {
        justifyContent:'flex-start'
    },
    bottomCurve : {
        flex : 1,
        justifyContent : 'flex-end',
    },
    topCurveImage : {
        width : wp('100'),
        height : hp('15')
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('12')
    },
    logoContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        marginBottom : '5%'
    },
    logoImage : {
        width : 200,
        height : 66
    },
    secondContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : '2%'
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 16,
        margin : '1%'
    },
    subtext : {
        color : '#6b6b6b',
        fontFamily : 'Poppins-Regular',
        fontSize : 15
    },
    row : {
        flexDirection : 'row',
        margin : 8
    },
    loginText : {
        color : '#833485',
        fontFamily : 'Poppins-SemiBold',
        textDecorationLine : 'underline',
        fontSize : 15
    },
    input:{
        backgroundColor:'#ececec',
        width : wp('75'),
        borderColor : '#ececec',
        borderRadius : 30,
        fontFamily:'Poppins-Regular',
    },
    input1:{
        backgroundColor:'#ececec',
        width : wp('75'),
        borderColor : '#ececec',
        borderRadius : 20,
        fontFamily:'Poppins-Regular',
    },
    inputContainer:{
        backgroundColor:'#ececec',
        borderRadius : 30,
        paddingLeft : wp('5'),
        margin : '0.4%'
    }
})