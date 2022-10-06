import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Image } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
let video = Video;
export default class VideoPlayer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Orientation.lockToLandscape();
    }

    goBack = () => {
        this.props.navigation.navigate(this.props.route.params.backScreen);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image source={require('../../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                </View>
                <Video
                    ref={(ref) => { this.video = ref }}
                    source={{ uri: this.props.route.params.video_url }}
                    style={styles.fullScreen}
                    controls={true}
                    resizeMode="contain"
                    onVideoError={this.videoError}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        backgroundColor: 'transparent',
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
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