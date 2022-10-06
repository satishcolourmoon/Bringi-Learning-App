import React from 'react';
import { View, ActivityIndicator , StyleSheet , StatusBar , TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Image } from 'react-native-elements';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class ImageViewer extends React.Component{
    constructor(props){
        super(props)
    }
    goBack = () => {
        this.props.navigation.goBack()
    }
    render(){
        return(
            <View style={styles.container}>
                <StatusBar hidden />
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image  source={require('../../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                </View> 
                <View style={styles.center}>
                    <Image
                        source={{ uri: this.props.route.params.uri }}
                        style={{ width: windowWidth , height: windowHeight }}
                        PlaceholderContent={<ActivityIndicator color="red" />}
                        resizeMode="contain"
                    />
                </View>
            </View>
        )
    }
} 
const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'black',
        
    },
    backMainContainer: {
      
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
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    }
})