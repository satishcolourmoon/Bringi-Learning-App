import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, Linking, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, Icon ,Divider , SocialIcon } from 'react-native-elements';
import Loader from '../../components/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import Carousel , { Pagination } from 'react-native-snap-carousel';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';

export default class AboutUs extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            url: 'https://www.bringilearning.com/',
            showAlert: false,
            error_message: '',
            activeIndex: 0,
            banners : [],
            videos : [],
            links : {},
            activeSlide : 0
        }
    }

    componentDidMount() {
        this.getAboutUsData()
    }

    goBack = () => {
        this.props.navigation.navigate('Home');
    }

    openWebsite = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                this.setState({ showAlert: true, error_message: "Unknown error occured.Please try again" })
            }
        });
    };

    openDailpad = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`)
    }

    goTogallery = () => {
        this.props.navigation.navigate('ImageGallery',{
            data : this.state.images,
            backScreen : 'AboutUs'
        })
    }

    _renderItem({ item, index }) {
        return (
            <View style={styles.slide}>
                <Image source={{ uri: item.image }} style={styles.sliderImage} />
            </View>

        )
    }

    openVideo = (url) => {
        this.props.navigation.navigate('YoutubeVideo', {
            video_url: url,
            backScreen: 'AboutUs'
        });
    }

    getAboutUsData = async() => {
        var postData = {
            action : 'getallData'
        }
        const json = await apiCall(postData);
        if(json.status){
            this.setState({banners:json.data.banners,videos:json.data.video_gallery,links:json.data.social_links,images:json.data.images_gallery,loader:false})
        }else{
        this.setState({banners:[],videos:[],links:{},images:[],loader:false})
        }
    }

    get pagination () {
        const { activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={this.state.banners.length}
              activeDotIndex={activeSlide}
              dotStyle={{
                  backgroundColor: '#ffffff',
                  width : 10,
                  height : 10,
                  borderRadius : 5
              }}
              inactiveDotStyle={{
                backgroundColor: '#ffffff',
                width : 10,
                height : 10,
                borderRadius : 5
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              containerStyle={{margin:2}}
            />
        );
    }
    
    render() {
        if (this.state.loader){
            return (
                <Loader />
            )
        }
        return (
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
                        this.setState({ showAlert: false });
                    }}
                />
                <StatusBar hidden />
                <Header title="About us" title1="" backScreen="Home"  headerImage="confirmSubmit" navigation={this.props.navigation} />
                 <View style={{flex:0.9}}>
                     <ScrollView>
                        <View style={styles.center}>
                            <Carousel
                                layout={"default"}
                                ref={ref => this.carousel = ref}
                                data={this.state.banners}
                                sliderWidth={350}
                                itemWidth={340}
                                renderItem={this._renderItem}
                                onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                                containerCustomStyle={{marginTop:'5%'}}
                            />
                        </View>
                            <View style={{position:'absolute',top:135,left:60}}>
                                { this.pagination }
                            </View>
                      
                       
                        <View style={{margin:10}}>
                            <Divider />
                        </View>
                        <View style={styles.aboutContainer}>
                            <Text style={styles.videosText}>Quick Links</Text>
                        </View>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.roundContianer}>
                                <View style={styles.row}>
                                    <TouchableWithoutFeedback onPress={() => this.openWebsite(this.state.links.website)}>
                                        <View style={{marginTop:1}}>
                                            <View style={styles.round}>
                                                <Icon name="globe" color="#ffffff" type="font-awesome" size={25}  />
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => this.openWebsite(this.state.links.facebook)}>
                                        <View style={styles.round1}>
                                        <SocialIcon
                                            type='facebook'
                                        />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => this.openWebsite(this.state.links.youtube)}>
                                        <View style={styles.round1}>
                                            <SocialIcon
                                                type='youtube'
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => this.openWebsite(this.state.links.twitter)}>
                                        <View style={styles.round1}>
                                        <SocialIcon
                                            type='twitter'
                                        />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => this.openDailpad(this.state.links.phone)}>
                                        <View>
                                            <View style={styles.round2}>
                                                <Icon name="phone" color="#ffffff" type="font-awesome" size={22} />
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => this.goTogallery()}>
                                        <View style={styles.round}>
                                            <Icon name="photo" color="#ffffff" type="font-awesome" size={17} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View> 
                        </ScrollView>
                           
                         <View style={{margin:10}}>
                            <Divider />
                        </View>
                        <View style={styles.aboutContainer}>
                            <Text style={styles.videosText}>Our Videos</Text>
                        </View>
                        <View style={styles.center}>
                            {
                                this.state.videos.map((item,index) => {
                                    return(
                                        <TouchableWithoutFeedback onPress={()=>{this.openVideo(item.video_url)}} key={index}>
                                            <Card containerStyle={styles.card} >
                                                <View style={styles.row}>
                                                    <View style={styles.cardImage}>
                                                        <Image source={{uri:item.image}}  style={styles.webImage} resizeMode="contain"/>
                                                    </View>
                                                    <View style={{width:wp('40')}}>
                                                        <Text style={styles.videoTitle}>{item.title}</Text>
                                                    </View>
                                                </View>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            } 
                        </View>
                        <View style={{padding:15}}></View>
                    </ScrollView>
                 </View>
                <Footer />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
    bottomCurve: {
        flex: 0.1,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('9')
    },
    aboutContainer: {
        marginLeft : 20,
        marginTop:5,
    },
    videosText : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 15
    },
    backMainContainer: {
        position: 'absolute',
        top: 30,
        left: 10
    },
    backContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: '#eeeeee',
        borderRadius: 8
    },
    backIcon: {
        width: 55,
        height: 55
    },
    card: {
        width: wp('92'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 6,
        padding : 6, 
        marginTop : 17
    },
    cardImage: {
       width : wp('37')
    },
    webImage: {
        width: 120,
        height: 80
    },
    cardTitle: {
        marginTop: hp('8')
    },
    cardText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#8b418e'
    },
    cardText2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    slide: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        
    },
    sliderImage: {
        height: 170,
        width: 340,
        borderRadius: 5,
    },
    round: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        backgroundColor: '#823488',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3
    },
    round1: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3
       
    },
    round2: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3
       
    },
    roundContianer: {
        marginLeft: 15
    },
    text: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#ffffff'
    },
    row: {
        flexDirection: 'row'
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    videoTitle : {
        fontFamily : 'Poppins-Regular',
        textAlign : 'justify'
    }
})