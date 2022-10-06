import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text , Alert} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../Loader';
import { ScrollView } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import Button from '../Button';
import Modal from 'react-native-modal';
const options = [
    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>CANCEL</Text>,
    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>NEWLY ADDED</Text>,
    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>PRICE- LOW TO HIGH</Text>,
    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>PRICE- HIGH TO LOW</Text>,
    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>POPULAR</Text> 
]
const options1 = [
    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>CANCEL</Text>,
    <View style={{flexDirection:'row'}}>
        <View style={{width:wp('70')}}>
            <Text style={{fontFamily:'Poppins-Regular',fontSize:14}}>COINS</Text>
        </View>
        <View style={{ justifyContent : 'center',alignItems : 'center',width:wp('20')}}>
            <View style={{flexDirection:'row'}}>
                <View style={{  backgroundColor : '#894290',
                                justifyContent : 'center',
                                alignItems : 'center',
                                padding : '2%',
                                borderRadius : 8,
                                marginTop :'0.5%',
                                width : wp('7'),
                                margin : '1%'}}>
                    <Text style={{fontFamily : 'Poppins-SemiBold',
                    fontSize : 11,
                    color : '#ffffff'}}>+</Text>
                </View>
                <Text style={{ fontFamily : 'Poppins-Regular',
                    fontSize : 14,
                    marginTop : '2%',
                    marginLeft : '4%',
                    marginRight : '4%'}}>2</Text>
                <View style={{
                    backgroundColor : '#894290',
                    justifyContent : 'center',
                    alignItems : 'center',
                    padding : '2%',
                    borderRadius : 8,
                    marginTop :'0.5%',
                    width : wp('7'),
                    margin : '1%'
                }}>
                    <Text style={{fontFamily : 'Poppins-SemiBold',
                        fontSize : 11,
                        color : '#ffffff'}}>-</Text>
                </View>
            </View>
        </View>
    </View>,
    <View style={{flexDirection:'row'}}>
        <View style={{width:wp('70')}}>
            <Text style={{fontFamily:'Poppins-Regular',fontSize:14}}>TOTAL</Text>
        </View>
        <View  style={{width:wp('20'),justifyContent : 'center',alignItems : 'center'}}>
            <Text style={{fontFamily:'Poppins-Regular',fontSize:14,paddingRight:'5%'}}>₹ 60</Text>
        </View>
   </View>,
    <View style={{marginTop:'2%',marginBottom:'4%'}}>
        <Button   backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="PROCEED TO PAY" />
    </View>
]
export default class Rewards extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true,
            showModal : false
        }
    }
    
    componentDidMount(){
        setTimeout(()=>{this.setState({loader:false})},600)
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    showActionSheet = () => {
        this.ActionSheet1.show()
    }
    showActionSheet1 = () => {
        this.ActionSheet2.show()
    }
    openModal = () => {
        Alert.alert(
            "REDEEM",
            "Do you want to redeem this reward?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
    }
    render(){
        if(this.state.loader){
            return(
                <Loader />
            )
        }
        return(
            <ScrollView>
                 <ActionSheet
                    ref={o => this.ActionSheet1 = o}
                    title={<Text style={{color: '#000', fontSize: 13,fontFamily:'Poppins-SemiBold'}}>FILTER</Text>}
                    options={options}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { /* do something */ }}
                />
                 <ActionSheet
                    ref={o => this.ActionSheet2 = o}
                    title={<Text style={{color: '#000', fontSize: 13,fontFamily:'Poppins-SemiBold'}}>ADD COINS</Text>}
                    options={options1}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { /* do something */ }}
                />
            <View style={styles.container}>
                
                <StatusBar hidden />
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image  source={require('../../assets/back.png')} style={styles.backIcon}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>Redeem</Text>
                        <Text style={styles.heading}>Rewards</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/rer.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={styles.addCoinMainContainer}>
                    <TouchableWithoutFeedback onPress={this.showActionSheet1}>
                        <View style={styles.addCoinContainer}>
                            <Text style={styles.addCoinText}> + Add Coin</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.coinContainer}>
                    <View style={styles.row}>
                        <Image source={require('../../assets/coins.png')}  style={styles.coinImage}/>
                        <View style={styles.coinNumberContinaer}>
                            <Text style={styles.coinNunber}>200</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.aboutContainer}>
                    <View style={styles.tabContianer}>
                        <TouchableWithoutFeedback onPress={this.showActionSheet}>
                            <View style={styles.tab}>
                                <View style={styles.row}>
                                        <Image source={require('../../assets/sort.png')} style={styles.filterImage} />
                                        <Text style={styles.tabText1}>SORT</Text>
                                </View>
                            </View> 
                        </TouchableWithoutFeedback>    
                        <View style={{borderRightWidth : 1,borderColor : '#d7d7d7'}}></View>
                        <TouchableWithoutFeedback onPress={this.showActionSheet}>
                            <View style={styles.tab}>
                                <View style={styles.row}>
                                    <Image source={require('../../assets/filter.png')} style={styles.filterImage} />
                                    <Text style={styles.tabText1}>FILTER</Text>
                                </View>
                            </View> 
                        </TouchableWithoutFeedback>    
                    </View>
                    <TouchableWithoutFeedback  onPress={this.goToReportCard}>
                         <Card containerStyle={styles.card}>
                            <View style={styles.row}>
                                <Image  source={require('../../assets/rr.png')} resizeMode="contain" style={styles.calImage}/>
                                <View style={styles.cardTitle}>
                                    <View style={styles.row}>
                                        <View style={{width:wp('37')}}>
                                            <Text style={styles.cardText1}>Pencil Box</Text>
                                        </View>
                                       <View>
                                           <View style={{flexDirection:'row'}}>
                                                <Image source={require('../../assets/ec.png')}  style={styles.coin}/>
                                                <Text style={styles.coinNunber}>200</Text>
                                           </View>
                                       </View>
                                    </View>
                                    <View style={{width:wp('50')}}>
                                       <Text style={styles.cardText2}>Lorem ipsum is a placeholder text commonly</Text>
                                    </View>
                                    <TouchableWithoutFeedback onPress={this.openModal}>
                                        <View style={styles.redeemContainer}>
                                        <Text style={styles.redeemText}>REDEEM</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    
                                </View>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback  onPress={this.goToReportCard}>
                         <Card containerStyle={styles.card}>
                            <View style={styles.row}>
                                <Image  source={require('../../assets/rr.png')} resizeMode="contain" style={styles.calImage}/>
                                <View style={styles.cardTitle}>
                                    <View style={styles.row}>
                                        <View style={{width:wp('37')}}>
                                            <Text style={styles.cardText1}>Pencil Box</Text>
                                        </View>
                                       <View>
                                           <View style={{flexDirection:'row'}}>
                                                <Image source={require('../../assets/ec.png')}  style={styles.coin}/>
                                                <Text style={styles.coinNunber}>200</Text>
                                           </View>
                                       </View>
                                    </View>
                                    <View style={{width:wp('50')}}>
                                       <Text style={styles.cardText2}>Lorem ipsum is a placeholder text commonly</Text>
                                    </View>
                                    <TouchableWithoutFeedback onPress={this.openModal}>
                                        <View style={styles.redeemContainer}>
                                        <Text style={styles.redeemText}>REDEEM</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback  onPress={this.goToReportCard}>
                         <Card containerStyle={styles.card}>
                            <View style={styles.row}>
                                <Image  source={require('../../assets/rr.png')} resizeMode="contain" style={styles.calImage}/>
                                <View style={styles.cardTitle}>
                                    <View style={styles.row}>
                                        <View style={{width:wp('37')}}>
                                            <Text style={styles.cardText1}>Pencil Box</Text>
                                        </View>
                                       <View>
                                           <View style={{flexDirection:'row'}}>
                                                <Image source={require('../../assets/ec.png')}  style={styles.coin}/>
                                                <Text style={styles.coinNunber}>200</Text>
                                           </View>
                                       </View>
                                    </View>
                                    <View style={{width:wp('50')}}>
                                       <Text style={styles.cardText2}>Lorem ipsum is a placeholder text commonly</Text>
                                    </View>
                                    <TouchableWithoutFeedback onPress={this.openModal}>
                                        <View style={styles.redeemContainer}>
                                        <Text style={styles.redeemText}>REDEEM</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback  onPress={this.goToReportCard}>
                         <Card containerStyle={styles.card}>
                            <View style={styles.row}>
                                <Image  source={require('../../assets/rr.png')} resizeMode="contain" style={styles.calImage}/>
                                <View style={styles.cardTitle}>
                                    <View style={styles.row}>
                                        <View style={{width:wp('37')}}>
                                            <Text style={styles.cardText1}>Pencil Box</Text>
                                        </View>
                                       <View>
                                           <View style={{flexDirection:'row'}}>
                                                <Image source={require('../../assets/ec.png')}  style={styles.coin}/>
                                                <Text style={styles.coinNunber}>200</Text>
                                           </View>
                                       </View>
                                    </View>
                                    <View style={{width:wp('50')}}>
                                       <Text style={styles.cardText2}>Lorem ipsum is a placeholder text commonly</Text>
                                    </View>
                                    <TouchableWithoutFeedback onPress={this.openModal}>
                                        <View style={styles.redeemContainer}>
                                        <Text style={styles.redeemText}>REDEEM</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                </View>    
               <View style={{marginBottom:'2%'}}></View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                </View>
            </View>
         </ScrollView>   
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
        justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('15')
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
    tabContianer : {
        backgroundColor : '#eeeeee',
        flexDirection : 'row',
        borderRadius : 30
    },
    tab : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('43'),
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30
    },
    tab1 : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('40'),
        backgroundColor : '#ac90e7',
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30
    },
    tab1 : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('40'),
        backgroundColor : '#ac90e7',
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30
    },
    tab2 : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('40'),
        backgroundColor : '#ac90e7',
        borderTopRightRadius:30,
        borderBottomRightRadius:30
    },
    tabText : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : '#ffffff',
    },
    tabText1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : '#000000',
        marginLeft : '3%'
    },
    filterImage : {
        width : 20,
        height : 20
    },
    row : {
        flexDirection:'row'
    },
    addCoinContainer : {
        backgroundColor : '#ef1718',
        padding : '2%',
        width : wp('25'),
        borderTopLeftRadius : 8,
        borderBottomLeftRadius : 8,
        justifyContent : 'center',
        alignItems : 'center'
    },
    addCoinText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
        color : '#ffffff',
    },
    addCoinMainContainer : {
        position : 'absolute',
        right : 0,
        top : 170
    },
    coinImage : {
        width : 30,
        height : 30
    },
    coinNumberContinaer : {
        justifyContent : 'center',
        marginLeft : '2%'
    },
    coinNunber : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 14,
        color : '#000',
    },
    coinContainer : {
        marginLeft : wp('7'),
        marginTop : 17
    },
    card : {
        width : wp('86'),
        borderRadius : 12,
        backgroundColor : '#ffffff',
        elevation: 10
    },
    cardTitle : {
        justifyContent : 'center',
        marginLeft : '5%'
    },
    cardText1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 14,
    },
    cardText2 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 12,
        color : '#868686'
    },
    calImage : {
        width : 70,
        height : 70,
        backgroundColor : '#fff'
    },
    redeemContainer : {
        backgroundColor : '#ed181a',
        width : wp('20'),
        justifyContent : 'center',
        alignItems : 'center',
        padding : '1%',
        borderRadius : 20
    },
    redeemText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 12,
        color : '#ffffff'
    },
    coin : {
        width : 18,
        height : 18
    },
    profileImage : {
        width : 80,
        height : 80
    },
    profileImageContainer : {
        position : 'absolute',
        top : -40
    },
    profileMainContainer : {
        justifyContent : 'center',
        alignItems : 'center',
       
    },
    profileTextContainer : {
       marginTop : '1%', 
       justifyContent : 'center',
       alignItems : 'center'
    },
})