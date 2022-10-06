import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
export default class MainNavigator extends Component{
    constructor(props){
        super(props);
        this.state={
            user_id : '',
            loder : true
        }
    }
    componentDidMount(){
        setTimeout(()=>{this.setState({loader:false})},1500)
        try{
             AsyncStorage.getItem('user_id').then((user_id)=>{
                 this.setState({user_id:user_id})
             });
        }catch(e){
            console.log(e)
        }
    }
    render(){
        if(this.state.loader){
            return(
                <SplashScreen />
            )
        }
        if(this.state.user_id){
            return(
               <AppStack />
            )
        }else{
            return(
               <AuthStack />
            )
         }
    }
}