import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text , TextInput , ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Button from '../../components/Button';
import Loader from '../../common/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiCall } from '../../utils';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer';
var moment = require('moment');
export default class FreeCounselling extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : false,
            showAlert : false,
            error_message : '',
            student_id : '',
            select_time : new Date(),
            showPicker : false,
            mobile : '',
            cities : [],
            btnLoader : false,
            dateValue : '',
            btnLoader : false
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id : student_id})
        })
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    submitRequest = async() => {
        if(this.state.mobile){
            if(this.state.city_id){
            this.setState({btnLoader : true,error_message:''});  
            let postData = {
                action : 'add_freeCounselling',
                student_id : this.state.student_id,
                mobile : this.state.mobile,
                select_time : this.state.dateValue,
                city_id : this.state.city_id
            }
            const json = await apiCall(postData);
            if(!json.status){
                this.setState({showAlert:true,error_message:"Error occured.please try later",btnLoader : false});
            }else if(json.status){
                this.setState({mobile:'',btnLoader:false,showAlert:true,error_message:"Request submitted.We will get back to you soon",loader : false});
                setTimeout(()=>{this.props.navigation.navigate('Home')},1300)
            }
            }else{
                this.setState({showAlert:true,error_message:'City is required'});
            }
        }else{
            this.setState({showAlert:true,error_message:'Mobile number is required'});
        }
    }
    onChange = (e) => {
        if(e.type == "set"){
            var timestamp = new Date(e.nativeEvent.timestamp);
            
            var local_time = moment.utc(timestamp).toDate();
           
            var local = moment(local_time).local().format('YYYY-MM-DD HH:mm:ss');
           
            this.setState({showPicker:false,select_time:local,dateValue:local})
        }
    }
    showTimePicker = () => {
        this.setState({showPicker:true});
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
                <Header title="Free" title1="Counselling" backScreen="Home"  headerImage="subject" navigation={this.props.navigation} />
                   <View style={{flex:0.9, backgroundColor : '#ffffff'}}>
                       <ScrollView>
                        <View style={styles.aboutContainer}>
                            <Image source={require('../../../assets/fc.png')}  style={styles.image}/>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputContainer2}>
                                    <TextInput
                                        placeholder="Parent Mobile number"
                                        style={styles.input}
                                        keyboardType="numeric"
                                        onChangeText={(mobile)=>this.setState({mobile:mobile})}
                                        value={this.state.mobile}
                                        maxLength={10}
                                    />
                                </View>
                                <View style={styles.inputContainer2}>
                                    <TextInput
                                        placeholder="City"
                                        style={styles.input}
                                        onChangeText={(city_id)=>this.setState({city_id:city_id})}
                                        value={this.state.city_id}
                                    
                                    />
                                </View>
                                <TouchableWithoutFeedback onPress={this.showTimePicker}>
                                    <View style={styles.inputContainer1}>
                                        <Text style={{fontFamily:'Poppins-Regular',fontSize:13}}>{this.state.dateValue ? this.state.dateValue : 'Select Date' }</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View>
                                    {
                                        this.state.showPicker &&  <DateTimePicker
                                            testID="dateTimePicker"
                                            value={this.state.select_time}
                                            mode={'datetime'}
                                            is24Hour={false}
                                            onChange={this.onChange}
                                            style ={{backgroundColor: "blue"}}
                                        />
                                    }
                                </View>
                                <View style={{marginTop:'2%'}}>
                                    <Button onPress={this.submitRequest}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="SUBMIT" loader={this.state.btnLoader} />
                                </View>
                            </View>
                        </View>
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
        backgroundColor : '#ffffff'
    },
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : hp('2')
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
    assImage : {
        width : 90,
        height : 105
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
    descContainer : {
        marginLeft : wp('4')
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    searchImage : {
        height : 100,
        width : 100 
    },
    image : {
        width : 250,
        height : 160
    },
    inputContainer : {
        marginTop : hp('1')
    },
    input:{
        backgroundColor:'#ececec',
        width : wp('75'),
        borderColor : '#ececec',
        borderRadius : 30,
        fontFamily:'Poppins-SemiBold',
    },
    input1:{
        backgroundColor:'#ececec',
        width : wp('75'), 
        borderColor : '#ececec',
        borderRadius : 20,
        fontFamily:'Poppins-SemiBold',
    },
    inputContainer2:{
        backgroundColor:'#ececec',
        borderRadius : 30,
        paddingLeft : wp('5'),
        marginTop : '2%'
    },
    inputContainer1:{
        backgroundColor:'#ececec',
        borderRadius : 30,
        paddingLeft : wp('5'),
        marginTop : '2%',
        padding : '4%'
    }
})