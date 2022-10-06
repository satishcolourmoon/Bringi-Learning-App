import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../components/Loader';
export default class SkillAssessment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loader : true
        }
    }
    componentDidMount(){
        setTimeout(()=>{this.setState({loader:false})},600)
    }
    goBack = () => {
        this.props.navigation.navigate('Home');
    }
    goToSelectSubject = ()  => {
        this.props.navigation.navigate('SelectSubject');
    }
    goToLearningAnalysis = () => {
        this.props.navigation.navigate('LearningAnalysis');
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
                        <Text style={styles.heading}>Skill</Text>
                        <Text style={styles.heading}>Assessment</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/kn.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                
                <View style={styles.aboutContainer}>
                    <TouchableWithoutFeedback onPress={this.goToSelectSubject}>
                        <Card containerStyle={styles.card}>
                            <View style={styles.cardImage}>
                                <Image source={require('../../assets/ass.png')}  style={styles.assImage}/>
                            </View>
                            <View style={styles.cardTitle}>
                                <Text style={styles.cardText}>TAKE</Text>
                                <Text style={styles.cardText1}>ASSESSEMENT</Text>
                                <Text style={styles.cardText2}>Click Here</Text>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.goToLearningAnalysis}>
                        <Card containerStyle={styles.card}>
                            <View style={styles.cardImage}>
                                <Image source={require('../../assets/ass1.png')}  style={styles.searchImage}/>
                            </View>
                            <View style={styles.cardTitle}>
                                <Text style={styles.cardText}>LEARNING</Text>
                                <Text style={styles.cardText1}>ANALYSIS</Text>
                                <Text style={styles.cardText2}>Click Here</Text>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                </View>
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
        marginTop : hp('3')
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
    }
})