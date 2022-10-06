import React from 'react';
import { View,ActivityIndicator,StyleSheet,StatusBar} from 'react-native';
export default class Loader extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <StatusBar hidden />
                <ActivityIndicator color="#ef1718" size="large" />
            </View>
        )
    }
}
const styles =  StyleSheet.create({
    container:{
        flex : 1,
        backgroundColor : '#ffffff',
        justifyContent : 'center',
        alignItems : 'center'
    }
})