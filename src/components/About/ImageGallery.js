import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, FlatList ,Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../components/Loader';
import AwesomeAlert from 'react-native-awesome-alerts';
import Nodata from '../../components/NoData';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
export default class ImageGallery extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            loader: false,
        }
    }
    componentDidMount() { 
       
    }
    goBack = () => {
        this.props.navigation.navigate(this.props.route.params.backScreen);
    }
    goToImageView = (image) => {
        this.props.navigation.navigate('ImageViewer',{
            uri : image,
            backScreen : 'ImageGallery'
        })
    }
    render() {
        const images = this.props.route.params.data;
        if (this.state.loader) {
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
                 <Header title="Image" title1="Gallery" backScreen="AboutUs"  headerImage="confirmSubmit" navigation={this.props.navigation} />
                 <View style={{flex:0.9}}>
                    <FlatList
                        ListEmptyComponent={
                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                <Nodata title="Gallery is empty.Please check back later"/>
                            </View>
                        }
                        numColumns={2}
                        data={images}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableWithoutFeedback onPress={()=>this.goToImageView(item.image)}>
                                    <Card containerStyle={styles.card}>
                                        <Image source={{uri:item.image}} style={styles.galleryImage} resizeMode="contain"/>
                                    </Card>
                                </TouchableWithoutFeedback>
                            </View>  
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{backgroundColor:'#ffffff',margin:20,justifyContent:'center',alignItems:'center'}}
                    />  
                 </View>
                <Footer />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        
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
    row: {
        flexDirection: 'row'
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    galleryImage : {
        width : 140,
        height : 80
    },
    imageContainer : {
        margin : 10
    },
    card : {
        borderRadius : 8,
        padding : 6,
        margin : 6
    },
    descContainer : {
        marginLeft : wp('4')
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
})