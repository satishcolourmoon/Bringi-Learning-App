import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text , Alert} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import { ScrollView } from 'react-native-gesture-handler';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer';
import { apiCall } from '../../utils'; 
import AsyncStorage from '@react-native-community/async-storage';
export default class MyRewards  extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loader : true,
            data : [], 
            student_id : ''
        }
    }
    
    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id})
            this.getStudentRewards(student_id);
        })
       
    }

    getStudentRewards = async(student_id) => {
        let postData = { 
            action : 'student_rewards',
            student_id 
        }
        const json = await apiCall(postData);
        if(!json.status){
            this.setState({data : [], loader:false});
        }else if(json.status){
            this.setState({data:json.data, loader:false});
        }
    }

    render(){
        const { data } = this.state;
        
        if(this.state.loader){
            return(
                <Loader />
            )
        }

        return(
            <View style={styles.container}>
                
                    <StatusBar hidden />
                    <Header title="My" title1="Rewards" backScreen="Home"  headerImage="rewards"  navigation={this.props.navigation} />
                    <View style={styles.secondcontainer}>
                        <ScrollView>
                            <View style={styles.aboutContainer}>
                                {
                                    data.length == 0 && <Text style={{fontFamily:'Poppins-Regular',color:'red',marginTop : 25}}>No data found!</Text>
                                }
                                    {
                                        data.map((item,index)=>{
                                            return(
                                                <Card containerStyle={styles.card}>
                                                    <View style={styles.row}>
                                                        <Image  source={{uri:item.image}} resizeMode="contain" style={styles.calImage}/>
                                                        <View style={styles.cardTitle}>
                                                            <View style={styles.row}>
                                                                <View style={{width:wp('49')}}>
                                                                    <Text style={styles.cardText1}>{item.reward_name}</Text>
                                                                   
                                                                </View>
                                                                <View>
                                                                    <View style={{flexDirection:'row'}}>
                                                                        <Image source={require('../../../assets/ec.png')}  style={styles.coin}/>
                                                                        <Text style={styles.coinNunber}>{item.number_of_points}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={{width:wp('70')}}>
                                                                <Text style={styles.cardText3}>Category - {item.category}</Text>
                                                                <Text style={styles.cardText2}>{item.description}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </Card>
                                            )
                                        })
                                    }
                            </View> 
                            <View style={{margin:15}} />
                        </ScrollView>
                     </View>
                <Footer />
            </View>   
        )
    }
}
const styles =  StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#ffffff'
    },
    secondcontainer:{
        flex : 0.9,
    },
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center',
    },
    cardText3 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 12
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
    sheetItem : {
        width : wp('85'),
        justifyContent : 'center',
        alignItems :'center',
        padding : 8,
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
        borderRadius : 30,
        margin : 13
    },
    tab : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('45'),
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30
    },
    tab1 : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('45'),
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
        marginLeft : 17,
        marginTop : 5
    },
    card : {
        width : wp('90'),
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
        width : 50,
        height : 50,
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