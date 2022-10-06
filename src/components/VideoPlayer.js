import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, TouchableWithoutFeedback, Image } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Loader from '../common/Loader'
export default class VideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false
        }
    }
    componentDidMount() {
        Orientation.lockToLandscape();
    }
    componentWillUnmount() {
        Orientation.lockToPortrait();
    }
    videoError = (e) => {
        Alert.alert(
            "Attention",
            "Error occurred while playing video.Try again later",
            [
                {
                    text: "Go Back",
                    onPress: () => this.props.navigation.goBack()
                },
            ],
            {
                cancelable: false
            }
        );
    }
    onBuffer = (e) => {

    }
    // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <StatusBar backgroundColor="#070707" />
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={() => { this.props.navigation.goBack() }}>
                        <Image source={require('../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                </View>
                <Video source={{ uri: this.props.route.params.url }}
                    ref={(ref) => {
                        this.player = ref
                    }}
                    onBuffer={this.onBuffer}
                    onError={this.videoError}
                    style={styles.backgroundVideo}
                    controls={true}
                    fullscreen={true}
                    resizeMode="contain"
                // onLoad={()=>this.setState({loader:true})}
                // onEnd={()=>this.setState({loader:false})}

                />
            </View>
        )
    }
}
var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    backMainContainer: {
        position: 'absolute',
        top: 30,
        left: 30,
        zIndex: 99999
    },
    backIcon: {
        width: 55,
        height: 55
    },
});