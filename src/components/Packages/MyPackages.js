import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card , Divider } from 'react-native-elements';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer';
import { apiCall } from '../../utils'; 
import Button from '../Button';
export default class MyPackages extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true,
            showAlert : false,
            error_message : '',
            data : {
                subjects : [],
                expiry_package : []
            },
            student_id : '',
            is_pack_purchased : false
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.getPackageDetails(student_id);
        });
    }
    getPackageDetails = async(student_id) => {
        let postData = { 
            action : 'student_packagedetails',
            student_id : student_id
        }
        const json = await apiCall(postData);
        if(!json.status){
            this.setState({loader : false,data:{},is_pack_purchased:false});
        }else if(json.status){
            this.setState({loader : false,data:json.data,is_pack_purchased:true});
        }
    }
    goToBuyPackage = () => {
        this.props.navigation.navigate('BuyPackage')
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
                <View>
                    <Header title="Package" title1="Details" backScreen="PackageMenu"  headerImage="subject" navigation={this.props.navigation} />
                    <View style={styles.userContainer}>
                        <Image  source={require('../../../assets/profile.png')} style={styles.profileImage}/>
                        <View style={styles.studentNameContainer}>
                            <Text style={styles.cardText1}>{this.state.data.student_name}</Text>
                            <Text style={styles.cardText2}>{this.state.data.class},{this.state.data.board_id}</Text>
                        </View>
                    </View>
                </View>
                <ScrollView>
               <View style={{flex:0.9,marginTop:50}}>
                   {
                       !this.state.is_pack_purchased && <View style={styles.center}>
                            <Text style={styles.redText}>No packages purchased yet!</Text>
                        </View>     
                   }
                   {
                       !this.state.is_pack_purchased &&  <View style={styles.center}>
                            <Button onPress={this.goToBuyPackage}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="Buy Package" loader={this.state.btnLoader}/>
                        </View>    
                   }
                   {
                       this.state.is_pack_purchased  &&   <View>
                            <Card containerStyle={styles.card}>
                                <Text style={styles.subjectName}>Expiry Date</Text>
                                <View style={styles.dividerContainer}>
                                    <Divider />
                                </View>
                                <View style={{padding : 3}} />
                                {
                                    this.state.data.expiry_package.map((item,index)=>{
                                        return(
                                            <View>
                                                <View style={styles.row}>
                                                    <Text style={styles.cardText}>{item.subject_name} - </Text>
                                                    <Text style={styles.cardText}>{item.expiry_date}</Text>
                                                </View>
                                                <View style={{padding : 3}} />
                                            </View>
                                        )
                                    })
                                }
                            </Card>
                            {
                                this.state.data.subjects.length > 0  &&  <View style={styles.subjectContainer}>
                                    <View style={{marginTop : '6%',marginLeft : '6%'}}>
                                        <Text style={styles.subjectName}>Subjects with Addons</Text>
                                    </View>
                                        { 
                                            this.state.data.subjects.map((item,index)=>{
                                                return(
                                                <Card containerStyle={styles.card} key={index}>
                                                    <View style={styles.row}>
                                                        <View style={{width:wp('40')}}>
                                                            <Text style={styles.cardSubject}>{item.subject_name}</Text>
                                                        </View>
                                                        <View style={styles.row}>
                                                            <Text style={styles.cardText}>Expiry - </Text>
                                                            <Text style={styles.cardText1}>{item.expiry_date}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{padding : 3}} />
                                                    <View style={styles.row}>
                                                        <Text style={styles.cardText}>Package name - </Text>
                                                        <Text style={styles.packageName}>{item.package_name}</Text>
                                                    </View>
                                                    <View style={{padding : 3}} />
                                                    <View style={styles.row}>
                                                        <View style={styles.row}>
                                                            <Text style={styles.cardText}>Video calls - </Text>
                                                            <Text style={styles.cardText1}>{item.video_calls} ,</Text>
                                                        </View>
                                                        <View style={styles.row}>
                                                            <Text style={styles.cardText}>  Live videos - </Text>
                                                            <Text style={styles.cardText1}>{item.live_videos}</Text>
                                                        </View>
                                                    </View>
                                                </Card>
                                                )
                                            })
                                         }
                                     </View>
                                  }
                              </View>
                           } 
                     </View> 
                     <View style={{margin:'13%'}} />
                  </ScrollView>
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
        flex : 1,
        justifyContent : 'flex-end',
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('15')
    },
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center',
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
        borderRadius : 12,
        backgroundColor : '#ffffff',
        elevation: 10,
        margin:'6%',
        padding : 20
    },
    cardImage : {
        flex : 1,
        alignItems : 'flex-end'
    },
    menuImage : {
        width : 50,
        height : 50
    },
    cardText : { 
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
        color : '#868686',
       
    },
    cardText1 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
       
    },
    cardTitle : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
    },
    row : {
        
        flexDirection: 'row'
    },
    profileImage : {
        width : 20,
        height : 20
    },
    round : {
        height : 16,
        width : 16,
        borderRadius : 16/2,
        backgroundColor : 'green',
        padding : '2%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    cloudClassContainer : {
        backgroundColor : '#d31d33',
        justifyContent : 'center',
        alignItems : 'center',
        height : 17,
        padding : '4%',
        borderRadius : 5
    },
    cloudText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 12,
        color : '#ffffff',
    },
    countMainContainer : {
        position : 'absolute',
        right : -13,
        bottom : 11
    },
    cloudContainer : {
        marginLeft : wp('5'),
        flexDirection : 'row',
        alignItems : 'center',
        marginTop : '2%'
    },
    activeText : {
        fontFamily : 'Poppins-SemiBold',
        color : 'green'
    },
    dividerContainer : {
        marginTop : 5,
        marginBottom : 5
    },
    packageName : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13
    },
    subjectContainer : {
      
       
    },
    subjectName : {
        fontFamily : 'Poppins-SemiBold'
    },
    card1 : {
        width : wp('37'),
        borderRadius : 6,
        elevation: 1,
    },
    cardSubject : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
       
    },
    userContainer : {
        position : 'absolute',
        top : 60,
        right : 50
    },
    profileImage : {
        width : 75,
        height : 80
    },
    studentNameContainer : {
        zIndex : 99999,
        backgroundColor : '#ffffff',
        paddingLeft : 15,
        paddingRight : 15,
        borderRadius : 8
    },
    cardText1 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
    },
    cardText2 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 12,
        color : '#868686'
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 15
    },
    redText : {
        fontFamily : 'Poppins-SemiBold',
        color : 'red',
       
    }
})