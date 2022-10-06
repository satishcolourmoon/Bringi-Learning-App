import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text , Linking} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../components/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import { WebView } from 'react-native-webview';
export default class AboutWebView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : true,
            url : 'https://www.bringilearning.com/',
            showAlert : false,
            error_message : ''
        }
    } 
   
    componentDidMount(){
        setTimeout(()=>{this.setState({loader:false})},600)
    }
    goBack = () => {
        this.props.navigation.navigate('AboutUs');
    }
    openWebsite = () => {
        Linking.canOpenURL(this.state.url).then(supported => {
          if (supported) {
            Linking.openURL(this.state.url);
          } else {
              this.setState({showAlert:true,error_message:"Unknown error occured"})
          }
        });
      };
    render(){
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
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image  source={require('../../assets/back.png')} style={styles.backIcon}/>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../assets/kn.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={{flex:1,marginTop:hp('23')}}>
                    <WebView
                        source={{ uri: 'http://demoworks.in/php/bringi/welcome' }}
                        
                    />
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
    webImage : {
        width : 120,
        height : 85
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
    }
})