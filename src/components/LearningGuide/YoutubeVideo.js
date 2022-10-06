import React from 'react';
import { View ,Text ,StyleSheet , Button , TouchableOpacity,Linking } from 'react-native';
import YouTube from 'react-native-youtube';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../../common/Header';
import Footer from '../../common/Footer';

export default class YoutubeVideo extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            showLink : false
        }
    }

    goBack = () => {
        this.props.navigation.navigate(this.props.route.params.backScreen);
    } 
    
    componentDidMount(){
        
    }

    handleError = (e) => { 
        if(e.error == "USER_DECLINED_RESTRICTED_CONTENT" || e.error == "UNKNOWN" || e.error == "NOT_PLAYABLE"){
            this.setState({showLink:true})
        }
    }

    goToWebsite = (video_code) => {
        let url = "https://www.youtube.com/watch?v="+video_code;
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            alert("Unknown error occured while opeaning " + url);
          }
        });
      };

    _youTubeRef = React.createRef();
    render(){
        const {showLink  }  = this.state
         return(
            <View style={styles.container}>
                 <Header title="" title1="" backScreen={this.props.route.params.backScreen}  headerImage="confirmSubmit" navigation={this.props.navigation} />
                    <View style={{flex:0.9}}>
                        {
                            !showLink  &&  <YouTube
                                ref={this._youTubeRef}
                                videoId={this.props.route.params.video_url}
                                play={true}
                                fullscreen={false}
                                apiKey="AIzaSyDdX7kxdNs7rNknxGtr0FWEaHIJnvhuvWs"
                                showFullscreenButton={true}
                                rel={false}
                                onReady={e => this._youTubeRef.current.seekTo(15)}
                                onChangeState={e => this.setState({ status: e.state })}
                                onChangeQuality={e => this.setState({ quality: e.quality })}
                                onError={this.handleError}
                                style={{ alignSelf:'stretch',height: 200,marginTop : 30,marginLeft:7,marginRight:7 }}
                            />
                        }
                        {
                            showLink &&
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:65}}>
                                <TouchableOpacity onPress={() => this.goToWebsite(this.props.route.params.video_url)}>
                                      <Text style={styles.playText}>Play on Youtube</Text>
                                </TouchableOpacity>
                            </View> 
                            
                        }
                        
                    </View>
                 <Footer />
            </View>
       )
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    playText : {
        fontFamily : 'Poppins-SemiBold',
        color : 'blue'
    }
})