import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text, ScrollView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
export default class LearnSelectSubject extends React.Component{

    constructor(props){

        super(props)
        this.state = {
            loader : true,
            data : []
        }
    }

    componentDidMount(){
        this.getMediumList();
    }

    getMediumList = async() => {
        let postData = { 
            action : 'get_medium',
        }
        const json = await apiCall(postData);
       
        if(json.status){
            this.setState({data:json.boardlist,loader:false})
        }else{
            this.setState({data:[],loader:false})
        }
    }

    goBack = () => {
        this.props.navigation.navigate('Home');
    }

    goToChapters = (id)  => {
        this.props.navigation.navigate('SelectChapter',{
            board_id : this.props.route.params.board_id,
            subject_id : this.props.route.params.subject_id,
            medium_id : id
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
                <Header title="Learn More" title1="" backScreen="SelectBoard"  headerImage="learn_more" navigation={this.props.navigation} />
                    <View style={{flex:0.9}}>
                       <ScrollView>
                            <View style={styles.selectContainer}>
                                <Text style={styles.heading1}>Select Medium</Text>
                            </View>
                            <View style={styles.aboutContainer}>
                                {
                                    this.state.data.map((item,index)=>{
                                        return(
                                            <TouchableWithoutFeedback onPress={()=>this.goToChapters(item.id)} key={index}>
                                                <Card containerStyle={styles.card}>
                                                    <View style={styles.cardTitle}>
                                                        <Text style={styles.cardText1}>{item.title}</Text>
                                                        <View style={styles.nextContainer}>
                                                            <Image source={require('../../../assets/next.png')}  style={styles.icon}/>
                                                        </View>
                                                    </View>
                                                </Card>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                            <View style={{padding:20}}></View>
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
        flex : 1,
        justifyContent : 'flex-end',
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
    card : {
        width : wp('86'),
        borderRadius : 12,
        backgroundColor : '#ffffff',
        elevation: 10
    },
    cardTitle : {
        flexDirection : 'row'
    },
    cardText1 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
        color : '#8a4190'
    },
    descContainer : {
        marginLeft : wp('4')
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    heading1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 15,
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
    selectContainer : {
        marginLeft : wp('7'),
        marginTop : '2%'
    }
})