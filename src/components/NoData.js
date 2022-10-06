import React from 'react';
import { View , Text , Image , ActivityIndicator} from 'react-native';
export default class NoData extends React.Component{
constructor(props){
    super(props);
    this.state = {
        loader : true
    }
}
componentDidMount(){
    setTimeout(()=>{this.setState({loader:false})},1000)
}
  render(){
      if(this.state.loader){
          return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator color="#ef1718" size="large" />
            </View> 
          )
      }
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image  source={require('../../assets/nodata.jpg')}  style={{width:250,height:200}}/>
                <Text style={{fontFamily:'Roboto-Regular',fontSize:16}}>{this.props.title}.</Text>
            </View>
        ) 
    }
}