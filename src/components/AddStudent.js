import React from 'react';
import { View , Text , StyleSheet , StatusBar , Image , ScrollView ,Picker , TextInput , KeyboardAvoidingView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Button from '../components/Button';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Loader from '../components/Loader';
import qs from 'qs';
import { baseUrl } from '../constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import DatePicker from 'react-native-datepicker';
import Asyncstorage from '@react-native-community/async-storage';
export default class AddStudent extends React.Component{
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
            user_id : ''
        }
    }
    componentDidMount(){
        Asyncstorage.getItem('user_id').then((user_id)=>{
            this.setState({user_id : user_id});
        })
        this.getClasses();
        this.getBoard();
    }
    getClasses = () => {
        fetch(baseUrl+'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body:qs.stringify({ 
                action : 'classes'
            })
            }).then((response) => response.json())
            .then((json) => {
            if(!json.status){
                this.setState({classes:[]});
            }else if(json.status){
                this.setState({classes:json.classes});
              }
            })
            .catch((error) => {
                this.setState({loader : false});  
                console.error(error);
            });
    }
    getBoard = () => {

        fetch(baseUrl+'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body:qs.stringify({ 
                action : 'boardlist'
            })
            }).then((response) => response.json())
            .then((json) => {
            this.setState({loader : false});  
            if(!json.status){
                this.setState({boards:[]});
            }else if(json.status){
                this.setState({boards:json.boardlist});
            }
            })
            .catch((error) => {
             this.setState({loader : false});  
             console.error(error);
        });
    }
    registerStudent = () => {

        if(this.state.student_name){

            if(this.state.gender){

                if(this.state.dob){

                    if(this.state.email){

                        if(this.state.class_id){

                            if(this.state.board_id){

                                this.setState({loader : true});
                                fetch(baseUrl+'user', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'content-type': 'application/x-www-form-urlencoded',
                                    },
                                    body:qs.stringify({ 
                                        action : 'student_register',
                                        parent_id:this.state.user_id,
                                        student_name : this.state.student_name,
                                        gender : this.state.gender,
                                        dob : this.state.dob,
                                        email : this.state.email,
                                        class_id : this.state.class_id,
                                        board_id : this.state.board_id
                                    })
                                    }).then((response) => response.json())
                                    .then((json) => {
                                        this.setState({loader : false});  
                                        if(!json.status){
                                            this.setState({showAlert:true,error_message:json.message});
                                        }else if(json.status){
                                            this.setState({showAlert:true,error_message:"Student registered successfully"});
                                            setTimeout(()=>{this.props.navigation.navigate('Home')},1500)
                                        }
                                    })
                                    .catch((error) => {
                                        this.setState({loader : false});  
                                        console.error(error);
                                 });

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
    goBack = () => {
        this.props.navigation.navigate('SwitchStudent');
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
                     <View style={styles.backMainContainer}>
                        <TouchableWithoutFeedback onPress={this.goBack}>
                            <Image  source={require('../../assets/back.png')} style={styles.backIcon}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.topCurveImageContainer}>
                        <Image source={require('../../assets/kn.png')} resizeMode="stretch" style={styles.topCurveImage} />
                    </View>
                    <StatusBar hidden />
                    
                    <KeyboardAvoidingView behavior='position'>
                        <ScrollView>
                            <View style={styles.secondContainer}>
                                <Text style={styles.heading}>New Student</Text>
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
                                        placeholder="Date of Birth"
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
                                    <Button onPress={this.registerStudent}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="SUBMIT" />
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <View style={styles.bottomCurve}>
                        <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
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
    bottomCurve : {
        flex : 1,
        justifyContent : 'flex-end',
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
    topCurveImageContainer : {
        alignItems : 'flex-end'
    },
})