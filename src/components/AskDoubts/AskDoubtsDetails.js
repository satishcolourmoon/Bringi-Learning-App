import React from 'react';
import { View , StyleSheet , StatusBar , TouchableWithoutFeedback , Image , Text , ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer';
import Loader from '../../common/Loader';
import { Card } from 'react-native-elements';
import Orientation from 'react-native-orientation-locker';
export default class AskDoubtsDetails extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : false,
            pdfs : []
        } 
    }
    
    componentDidMount(){
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                Orientation.lockToPortrait();
            }
        );
    }

    goToPlayer = (url,type) => {
        if(type == "normal_video "){
            this.props.navigation.navigate('VideoComponent', {
                video_url: url,
                backScreen: 'AskDoubtsDetails'
            });
        }else if(type == "youtube"){
            this.props.navigation.navigate('YoutubeVideo', {
                video_url: url,
                backScreen: 'AskDoubtsDetails'
            });
        }
    }

    goToPdfViewer = (pdf_url) => {
        this.props.navigation.navigate('PdfViewer',
            {
                url:pdf_url,
                backScreen : 'AskDoubtsDetails'
            }
        )
    }

    render(){
        const item = this.props.route.params.data;
        if(this.state.loader){
            return(
                <Loader />
            )
        }
        return(
            <View style={styles.container}>
                <StatusBar hidden />
                <Header title={this.props.route.params.sheet_id} title1="" backScreen="SheetDoubt"  headerImage="confirmSubmit" navigation={this.props.navigation} />
                    <View style={{flex:0.9}}>
                      <ScrollView>

                           <View style={styles.selectContainer}>
                                <Text style={styles.heading1}>Question no #{this.props.route.params.question_number} Details</Text>
                            </View>
                            <View style={styles.aboutContainer}>
                               <View style={styles.row}>
                                    <TouchableWithoutFeedback onPress={() => this.goToPdfViewer(item.question_key)}>
                                        <Card containerStyle={styles.card}>
                                            <Image source={require('../../../assets/pdf.png')}  resizeMode="contain" style={styles.pdfImage}/> 
                                            <View style={styles.cardTitle}>
                                                <Text style={styles.cardText1}>Question Key</Text>
                                            </View>
                                        </Card>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>this.goToPlayer(item.question_video,item.question_video_type)}>
                                        <View style={{width:wp('45')}}>
                                            <Image source={require('../../../assets/cloud.png')} style={styles.playImage}/> 
                                            <Text style={styles.cardText1}>Question Video</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>

                            <View style={styles.selectContainer}>
                                <Text style={styles.heading1}>Learning Sheet Details</Text>
                            </View>
                            <View style={styles.aboutContainer}>
                               <View style={styles.row}>
                                    <TouchableWithoutFeedback onPress={() => this.goToPdfViewer(item.learning_guide)}>
                                        <Card containerStyle={styles.card}>
                                            <Image source={require('../../../assets/pdf.png')}  resizeMode="contain" style={styles.pdfImage}/> 
                                            <View style={styles.cardTitle}>
                                                <Text style={styles.cardText1}>Learning Guide</Text>
                                            </View>
                                        </Card>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>this.goToPlayer(item.videourl,'youtube')}>
                                        <View style={{width:wp('45')}}>
                                            <Image source={require('../../../assets/cloud.png')} style={styles.playImage}/> 
                                            <Text style={styles.cardText1}>Learning Sheet Video</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
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
   
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center',
    },
    row : {
        flexDirection : 'row',
        flexWrap : 'wrap',
        alignItems : 'center',
        justifyContent : 'center'
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    card : {
        borderRadius : 12,
        backgroundColor : '#ffffff',
        elevation: 10,
        width : wp('37'),
        justifyContent : 'center',
        alignItems : 'center'
    },
    pdfImage : {
        width : 80,
        height : 70
    },
    cardTitle : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : '3%',
       
    },
    cardText1 : {
        fontFamily : 'Poppins-Regular',
        fontSize : 12,
        marginTop : '3%',
        textAlign : 'center'
    },
    selectContainer : {
        marginLeft : wp('7'),
        marginTop : '2%'
    },
    heading1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 15,
        color : '#f4141c'
    },
    playImage : {
        width : 135,
        height : 135
    }

})