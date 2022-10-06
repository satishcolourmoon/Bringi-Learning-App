import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Questions from './Questions';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from './Loader';
const Tab = createMaterialTopTabNavigator();
function MyTabs() {
    return (
        <Tab.Navigator
        tabBarOptions={{
            style: {
                backgroundColor: '#fff',
              },
              
              labelStyle : {
                  fontFamily : 'Poppins-SemiBold',
                  fontSize : 13,
                  color : '#756f71'
              },
              upperCaseLabel : false,
              indicatorStyle : {
                  backgroundColor: '#ee1818',
                  height : 3,
              },
              tabStyle  : {
                width : wp('20'),
              },
              scrollEnabled : true
          }
        }>
                <Tab.Screen name="1" component={Questions} />
                <Tab.Screen name="2" component={Questions} />
                <Tab.Screen name="3" component={Questions} />
                <Tab.Screen name="4" component={Questions} />
                <Tab.Screen name="5" component={Questions} />
                <Tab.Screen name="6" component={Questions} />
                <Tab.Screen name="7" component={Questions} />
                <Tab.Screen name="8" component={Questions} />
        </Tab.Navigator>
    );
}
export default class OnlinePractiseQuestions extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true
        }
    }
    componentDidMount(){
        setTimeout(()=>{this.setState({loader:false})},600)
    }
    goBack = () => {
        this.props.navigation.navigate('Subject');
    }
    goToPathToSuccess = ()  => {
        this.props.navigation.navigate('PathToSuccess');
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
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image  source={require('../../assets/back.png')} style={styles.backIcon}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>Mathematics</Text>
                        <Text style={styles.subheading}>Reasoning</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/maths.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={styles.qnsContainer}>
                   <View style={styles.row}>
                        <View style={styles.row}>
                        <Image source={require('../../assets/question.png')}  style={styles.questionImage}/>
                        <View style={{marginLeft : wp('1')}}>
                            <Text style={styles.number}>15</Text>
                            <Text style={styles.sub}>Questions</Text>
                        </View>
                        </View>
                        <View style={styles.row}>
                        <Image source={require('../../assets/minutes.png')}  style={styles.timeImage}/>
                        <View style={{marginLeft : wp('1')}}>
                            <Text style={styles.number}>30</Text>
                            <Text style={styles.sub}>Minutes</Text>
                        </View>
                        </View>
                    </View>
                </View>
                <View style={styles.tabVContainer}>
                   <MyTabs />
                </View>
               
               <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    <View style={styles.proceedContainer}>
                        <TouchableWithoutFeedback onPress={this.goToPathToSuccess}>
                             <Text style={styles.proceedText}>SUBMIT </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        )
    }
}
const styles =  StyleSheet.create({
    container:{
        flex : 1,
    },
    questionImage : {
        width : 30,
        height : 43
    },
    timeImage : {
        width : 43,
        height : 43
    },
    topCurveImageContainer : {
        alignItems : 'flex-end'
    },
    bottomCurve : {
      justifyContent : 'flex-end',
      backgroundColor : '#ffffff'
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('12')
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
        marginLeft : wp('4'),
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238',
    },
    subheading : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14,
    },
    tabVContainer : {
        flex : 1,
    },
    row : {
        flexDirection : 'row',
        width : wp('37')
    },
    qnsContainer : {
        marginLeft : wp('6'),
        marginTop : hp('1'),
        marginBottom : hp('3')
    },
    number : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18
    },
    sub : {
        fontFamily : 'Poppins-Regular',
        fontSize : 14
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