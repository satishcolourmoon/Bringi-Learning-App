import React from 'react';
import { View , Text , StyleSheet , Image , StatusBar , Linking } from 'react-native';
import Button from '../components/Button';
import VersionNumber from 'react-native-version-number';
export default class AskForUpdate extends React.Component{
    constructor(props){
        super(props)
    }
    goToPlayStore = () => {
        Linking.openURL("market://details?id="+VersionNumber.bundleIdentifier);
    }
    render(){
        return(
            <View style={styles.container}>
                <StatusBar hidden />
                <Image source={require('../../assets/update.jpg')} style={styles.updateImage} resizeMode="contain" />
                <Text style={styles.updateText}>New Update Available!</Text>
                <View style={{marginTop : 10}}>
                    <Button onPress={this.goToPlayStore}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="UPDATE NOW" loader={false} />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#ffffff'
    },
    updateImage : {
        width : 350,
        height : 350
    },
    updateText : {
        fontFamily : 'Poppins-SemiBold',
        color : '#ff4f5a'
    }
})