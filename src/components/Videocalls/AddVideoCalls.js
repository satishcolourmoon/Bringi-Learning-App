import React from 'react';
import { View , StyleSheet , StatusBar  , TouchableWithoutFeedback , Text, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer'; 
import { apiCall } from '../../utils';
import RazorpayCheckout from 'react-native-razorpay';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from 'react-native-check-box';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class AddVideoCalls extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            loader : true,
            quantity : 1,
            single_video_price : 0,
            total_amount : 0,
            final_amount : 0,
            student_id : '',
            coins : 0,
            isCoinSelected : false,
            btnLoader : false
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id},() => {
                this.getSingleVideoCallPrice();
                this.getTotalCoins(student_id);
            })
        })
    }

    getSingleVideoCallPrice = async() => {
        let postData = {
            action : 'one_video_callPrice'
        }
        const json = await apiCall(postData);
        this.setState({single_video_price : json.price},() => {
            this.calculateTotal(this.state.quantity,json.price,this.state.coins,this.state.isCoinSelected,'first');
        })
    }

    getTotalCoins = async(student_id) => {
        let postData = {
            action : 'student_reward_points',
            student_id  : student_id
        }
        const json = await apiCall(postData);
        if(json.status){
            this.setState({coins : json.data.reward_points,loader:false,})
        }else{
            this.setState({coins : 0,loader:false,})
        }
    }

    calculateTotal = (quantity,price,coins,isCoinSelected,type) => {
        let total_amount;
        total_amount = Number(quantity)*Number(price);
        if(total_amount > coins){
            if(isCoinSelected){
                total_amount =  total_amount - coins;
            }
        }else{
            if(type == "second"){
                this.setState({isCoinSelected:false,showAlert:true,error_message:"Total amount should be greater than reward amount",loader:false});    
            }
        }
        this.setState({total_amount,final_amount:total_amount})
    }

    increaseQuantity = () => {
        let tempqty = this.state.quantity;
        tempqty = Number(this.state.quantity)+1;
        this.setState({quantity:tempqty},() => {
            this.calculateTotal(tempqty,this.state.single_video_price,this.state.coins,this.state.isCoinSelected,'second')
        })
    }

    decreaseQuantity = () => {
        let tempqty = this.state.quantity;
        tempqty = Number(this.state.quantity)-1;
        if(tempqty > 0){
            this.setState({quantity:tempqty},() => {
                this.calculateTotal(tempqty,this.state.single_video_price,this.state.coins,this.state.isCoinSelected,'second')
            })
        }
    }

    buyVideoCalls = async() => {
        if(this.state.final_amount){
            this.setState({btnLoader:true});
            let postData  = {
                action : 'student_video_calls_order_id',
                total_amount : this.state.final_amount,
                student_id : this.state.student_id
            }
            const json = await apiCall(postData);
            if(json.status == "valid"){
                var options = {
                    description: 'Credits towards Bringi Learning',
                    image: 'https://bringilearning.com/admin/assets/images/fav_icon_30_01_2021.png',
                    currency: 'INR',
                    key: 'rzp_live_vhmr5uWsBwJr93', 
                    amount: this.state.final_amount*100,
                    name: 'Bringi Learning',
                    order_id: json.data.order_id,
                    prefill: {
                        email: json.data.email,
                        contact: json.data.mobile,
                        name: json.data.name
                    },
                    theme: {color: '#894290'}
                } 
                RazorpayCheckout.open(options).then((data) => {
                    this.doPaymentSuccessAction(data,json.data.order_id);
                }).catch((error) => {
                    this.setState({showAlert:true,error_message:"Payment cancelled or Razorpay error occured.Try again later",btnLoader:false});
                });
            }else{
                this.setState({showAlert:true,error_message:"Order id not generated.Please try again later",btnLoader:false});
            }
        }else{
            this.setState({showAlert:true,error_message:"Total amount should be greater than zero",btnLoader:false});
        }
    }

    doPaymentSuccessAction = async(data,order_id) => {
        if(data.razorpay_payment_id){
            let postData  = {
                action : 'add_student_video_calls',
                student_id : this.state.student_id,
                video_calls : this.state.quantity,
                total_price  : this.state.final_amount,
                order_id,
                payment_id : data.razorpay_payment_id,
                razorpay_signature : data.razorpay_signature,
                totalCoins : this.state.coins,
                isCoinsStatus : this.state.isCoinSelected
            }
            const json = apiCall(postData);
            if(json.status){
                this.setState({showAlert:true,error_message:json.message,btnLoader:false});
                setTimeout(() => {
                    this.props.navigation.goBack()
                },1500);
            }else{
                this.setState({showAlert:true,error_message:json.message,btnLoader:false});
            }
        }else{
            this.setState({showAlert:true,error_message:"There might be problem with server.Try again later",btnLoader:false});
        }
    }

    handleCheckBox = () => {
        let current_checked = this.state.isCoinSelected;
        let updated_checked = !current_checked;
        this.setState({isCoinSelected:updated_checked},() => {
            if(updated_checked){
                this.calculateTotal(this.state.quantity,this.state.single_video_price,this.state.coins,updated_checked,'second');
            }else{
                this.calculateTotal(this.state.quantity,this.state.single_video_price,0,updated_checked,'second');
            }
        })
    }

    render(){
        const { quantity,total_amount,final_amount } = this.state;
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
                  <Header title="1:1 Video calls" title1="" backScreen="SheetVideo"  headerImage="vc" navigation={this.props.navigation} />
                    <View style={{flex:0.9}}>
                        <View style={styles.summaruContainer}>
                            <View style={styles.row}>
                                <View style={styles.leftWidth}>
                                    <Text style={styles.summaryHeading}>Video calls</Text>
                                </View>
                                <View style={styles.rightWidth}>
                                    <Text style={styles.summaryHeading}>Price</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.leftWidth}>
                                    <View style={styles.row}>
                                        <TouchableWithoutFeedback onPress={this.increaseQuantity}>
                                            <View style={styles.increaseContainer}>
                                                <Text style={styles.addText}>+</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <Text style={styles.number}>{quantity}</Text>
                                        <TouchableWithoutFeedback onPress={this.decreaseQuantity}>
                                            <View style={styles.increaseContainer}>
                                                <Text style={styles.addText}>-</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <View style={styles.rightWidth}>
                                    <Text style={styles.summaryvalue}>₹{total_amount}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.coinContainer}>
                            <View style={styles.row}>
                                <View style={{width:wp('10'),justifyContent:'center'}}>
                                    <Image source={require('../../../assets/coins.png')}  style={styles.coinImage}/>
                                </View>
                                <View style={{width:wp('23'),justifyContent:'center'}}>
                                    <Text style={styles.coinsText}> Use Coins</Text>
                                </View>
                                <View style={{width:wp('38.5'),justifyContent:'center'}}>
                                    <CheckBox
                                        style={{flex: 1}}
                                        onClick={this.handleCheckBox}
                                        isChecked={this.state.isCoinSelected}
                                        leftText={""}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.summaryvalue}>₹{this.state.coins}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{margin:8}} />
                        <View style={styles.bgWhite}>
                            <View style={styles.totalContainer}>
                                <View style={styles.row}>
                                    <View style={styles.leftWidth}>
                                        <Text style={styles.total}>Total</Text>
                                    </View>
                                    <View style={styles.rightWidth}>
                                        <Text style={styles.total}>₹{final_amount}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{margin:10}} />
                        <View style={styles.center}> 
                            <Button onPress={this.buyVideoCalls}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="Buy" loader={this.state.btnLoader} />
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
    coinContainer : {
        marginLeft : 25,
        marginTop : 7
    },
    coinsText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14
    },
    bottomCurve : {
        flex : 1,
        justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('13')
    },
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : '6%'
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
    coinImage : {
        width : 30,
        height : 30
    },
    backIcon : {
        width : 55,
        height : 55
    },
    successImage : {
        width : 150,
        height : 150
    },
    successText : {
        fontFamily : 'Poppins-Regular',
        marginTop : '2%'
    },
    successId : {
        fontFamily : 'Poppins-SemiBold',
        marginTop : '1%',
        fontSize : 17
    },
    descContainer : {
        marginLeft : wp('4'),
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238',
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    summaruContainer : {
        marginLeft : '6%',
        padding : '2%'
    },
    totalContainer : {
        marginLeft : '6%',
        padding : '2%'
    },
    leftWidth : {
       width :  wp('70')
    },
    rightWidth : {
        width :  wp('20')
    },
    summaryHeading : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13
    },
    summaryvalue : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 15
    },
    total : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 16,
        color : '#8a4190'
    },
    row : {
        flexDirection : 'row'
    },
    increaseContainer : {
        backgroundColor : '#894290',
        justifyContent : 'center',
        alignItems : 'center',
        padding : '2%',
        borderRadius : 8,
        marginTop :'0.5%',
        width : wp('9'),
        margin : '1%'
    },
    addText : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : '#ffffff'
    },
    number : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
        marginTop : '2%',
        marginLeft : '4%',
        marginRight : '4%'
    },
    bgWhite : {
        backgroundColor : '#ececec',
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
    }
})