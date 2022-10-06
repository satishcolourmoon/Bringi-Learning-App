import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text , FlatList,ScrollView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import Nodata from '../../common/NoData';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';

export default class Support extends React.Component{

    constructor(props){
        super(props) 
        this.state = {
            loader : false,
            student_id : '',
            data : [],
            showAlert : false,
            error_message : '',
            subjects : [],
            selectedId : ''
        }
    } 

    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id:student_id},()=>{
                this.getDepartments()
            })
        })
    }

    getDepartments = async() => {
        this.setState({loader:true})
        let postData = { 
            action : 'departments',
        }
        const json = await apiCall(postData);
        if(json.status){
            this.setState({loader : false,data:json.data});
        }else{
            this.setState({loader : false,data:[]});
        }
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    goToStatus = ()  => {
        this.props.navigation.navigate('Status');
    }

    goToCreate = (id,title)  => {
        this.props.navigation.navigate('CreateSupport',{
            dep_id : id,
            dep_title: title
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
                <Header title="Support" title1="" backScreen="Home"  headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{flex:0.9}}>
                    <ScrollView>
                        <View style={styles.secondContainer}>
                            <View style={styles.aboutContainer}>
                                <View style={styles.tabContianer}>
                                    <View style={styles.tab1}>
                                        <Text style={styles.tabText}>CREATE</Text>
                                    </View> 
                                    <TouchableWithoutFeedback onPress={this.goToStatus}>
                                        <View style={styles.tab}>
                                            <Text style={styles.tabText1}>STATUS</Text>
                                        </View> 
                                    </TouchableWithoutFeedback>
                                </View>
                            </View> 
                            <View style={styles.aboutContainer}>
                                {
                                    this.state.data.map((item,index) => {
                                        return(
                                            <TouchableWithoutFeedback  onPress={() => this.goToCreate(item.id,item.title)} key={index}>
                                                <Card containerStyle={styles.card}>
                                                    <View style={styles.cardTitle}>
                                                        <Text style={styles.cardText1}>{item.title}</Text>
                                                        <View style={styles.nextContainer}>
                                                            <Image source={require('../../../assets/next.png')}  style={styles.icon} resizeMode="contain"/>
                                                        </View>
                                                    </View>
                                                </Card>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                           </View>
                        </View>
                        <View  style={{padding:20}}/>
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
    topCurveImageContainer : {
        alignItems : 'flex-end'
    },
    bottomCurve : {
        flex : 0.1,
        justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('11')
    },
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : '2%'
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
        width : 50,
        height : 50
    },
    card : {
        width : wp('88'),
        borderRadius : 12,
        backgroundColor : '#ffffff',
        elevation: 10,
        padding : 20
    },
    cardTitle : {
        justifyContent : 'center',
        marginLeft : '2%'
    },
    cardText1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 14,
    },
    cardText2 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
        color : '#804681'
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
    },
    row : {
        flexDirection : 'row'
    },
    round : {
        width : 100,
        height : 100,
        borderRadius : 100/2,
        backgroundColor : '#c12b4e',
        margin : 10,
        justifyContent : 'center',
        alignItems : 'center'
    },
    secondContainer : {
        alignItems : 'center',
        justifyContent : 'center',
        marginTop : '2%',
    },
    icon : {
        width : 50,
        height : 50
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    circleText : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
    },
    circleText1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : '#c72e42'
    },
    profileImage : {
        width : 75,
        height : 80
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
        width : wp('46'),
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30
    },
    tab1 : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('46'),
        backgroundColor : '#ac90e7',
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30
    },
    tab1 : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('46'),
        backgroundColor : '#ac90e7',
        borderTopLeftRadius:30,
        borderBottomLeftRadius:30
    },
    tab2 : {
        justifyContent : 'center',
        alignItems : 'center',
        padding : '3%',
        width : wp('46'),
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
    },
    cardText3 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
        color : '#757575'
    },
    date : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
        color : '#d4414b'
    },
    status : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : 'red'
    },
    status1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : 'green'
    },
    icon1 : {
        width : 50,
        height : 50
    },
})