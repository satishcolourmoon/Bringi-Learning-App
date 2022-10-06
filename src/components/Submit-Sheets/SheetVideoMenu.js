import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../Loader';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer';
export default class SheetVideoMenu extends React.Component{
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
        this.props.navigation.navigate('Home');
    }
    goToSubmitSheet = () => {
        this.props.navigation.navigate('SubmitSheet');  
    }
    goToSheetVideo = () => {
        this.props.navigation.navigate('SheetVideo');
    }
    goToVideoSheetStatus = ()  => {
        this.props.navigation.navigate('VideoSheetStatus',{
            subject_id : ''
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
                <Header title="Submit Video" title1="" backScreen="Home"  headerImage="submitSheet" navigation={this.props.navigation} />
                <View style={styles.secondContainer}>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <TouchableWithoutFeedback onPress={this.goToSheetVideo}>
                                <Card containerStyle={styles.card}>
                                    <View style={styles.cardImage}>
                                        <Image source={require('../../../assets/video.png')}  resizeMode="contain"   style={styles.menuImage}/>
                                    </View>
                                    <View style={styles.cardTitle}>
                                        <Text style={styles.cardText}>UPLOAD</Text>
                                        <Text style={styles.cardText1}>SHEET VIDEO</Text>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback> 
                        </View>  
                        <TouchableWithoutFeedback onPress={this.goToVideoSheetStatus}>
                            <Card containerStyle={styles.card}>
                                <View style={styles.cardImage}>
                                    <Image source={require('../../../assets/s.png')}  resizeMode="contain"   style={styles.menuImage}/>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.cardText}>STATUS</Text>
                                    <Text style={styles.cardText1}>CLICK HERE</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>    
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
        marginTop : '4%'
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
        marginLeft : wp('4')
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    secondContainer : {
        flex : 0.9,
        alignItems : 'center'
    },
    card : {
        width : wp('40'),
        height : hp('16'),
        borderRadius : 12,
        backgroundColor : '#ffffff',
        elevation: 10
    },
    cardImage : {
        flex : 1,
        alignItems : 'flex-end'
    },
    menuImage : {
        width : 50,
        height : 50
    },
    cardTitle : {
        marginTop : hp('5')
    },
    cardText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13
    },
    cardText1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13
    },
    row : {
        flexDirection : 'row'
    }
})