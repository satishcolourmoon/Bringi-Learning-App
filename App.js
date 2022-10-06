import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Linking } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MainNavigator from './src/navigation/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './src/components/SplashScreen';
import ReactNativeAN from 'react-native-alarm-notification';
import VersionNumber from 'react-native-version-number';
import { apiCall } from './src/utils';
import { Root } from 'native-base';
import AskForUpdate from './src/common/AskForUpdate';
import OneSignal from 'react-native-onesignal';
import SwitchStudent from './src/components/SwitchStudent'
const slides = [
  {
    key: "1",
    title: 'PERSONALISED',
    title1: 'LEARNING',
    text: "Learning App for classes (Nur-10th Class) covering all Boards",
    image: require('./assets/intro1.png'),
    image1: require('./assets/in1.png'),
    image2: '',
    image3: '',
    imageStyle: { width: 250, height: 250 },
    imageStyle1: {},
    imageStyle3: {},
    bottomStyle: '30%'
  },
  {
    key: "2",
    title: 'SKILL',
    title1: 'ASSESSMENT',
    text: "Know your strength and learn your way",
    image: require('./assets/intro2.png'),
    image1: require('./assets/in2.png'),
    image2: '',
    image3: '',
    imageStyle: { width: 250, height: 250 },
    imageStyle1: {},
    imageStyle3: {},
    bottomStyle: '33%'
  },
  {
    key: "3",
    title: '',
    title1: '',
    text: "",
    image: require('./assets/intro3.png'),
    image1: require('./assets/in3.png'),
    image2: require('./assets/in4.png'),
    image3: require('./assets/in6.png'),
    imageStyle1: { width: 65, height: 120 },
    imageStyle2: { width: 110, height: 110 },
    imageStyle3: { width: 88, height: 110 },
    bottomStyle: '30%'
  },
  {
    key: "4",
    title: '1:1 COACHING',
    title1: '',
    text: "Coach will guide the students as they move through personalised learning path",
    image: require('./assets/intro4.png'),
    image1: require('./assets/in7.png'),
    image2: '',
    image3: '',
    imageStyle: { width: 250, height: 250 },
    imageStyle1: {},
    imageStyle3: {},
    bottomStyle: '33%'
  },
];
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      appIntro: '',
      loader: true,
      newVersionRequired: false,
      onNavigation: false
    }
    this.onOpened = this.onOpened.bind(this);
  }

  componentDidMount() {
    setTimeout(() => { this.setState({ loader: false }) }, 3500);
    AsyncStorage.getItem('appIntro').then((appIntro) => {
      this.setState({ appIntro: appIntro })
    })
    ReactNativeAN.removeAllFiredNotifications();
    this.initOneSignal();
    // this.checkForUpdate();
  }
  initOneSignal = () => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.init("340a5507-1fe9-40b0-a60e-3cde410fe493", { kOSSettingsKeyAutoPrompt: false, kOSSettingsKeyInAppLaunchURL: false });
    OneSignal.inFocusDisplaying(2);
    if (Platform.OS == "ios") {
      permissions = {
        alert: true,
        badge: true,
        sound: true
      };
      OneSignal.requestPermissions(permissions);
    }
    OneSignal.checkPermissions((permissions) => {
    });
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }
  onReceived(notification) {
  }
  onIds = async (device) => {
    AsyncStorage.setItem('device_token', device.userId);
  }
  onOpened = async (openResult) => {
    // if (openResult) {
    //   console.log(openResult.notification.payload.additionalData.notification_type)
    //   const notification_type = openResult.notification.payload.additionalData.notification_type
    //   AsyncStorage.getItem('device_token').then(async (device_token) => {
    //     AsyncStorage.getItem('student_id').then(async (student_id) => {
    //       let postData = {
    //         action: 'update_token',
    //         user_id: student_id,
    //         token: device_token
    //       }
    //       const json = await apiCall(postData);
    //       this.setState({ loader: false });
    //       if (json.status) {
    //         this.setState({ loader: false });
    //         if (notification_type == "normal") {
    //           this.props.navigation.navigate('Home')
    //         }
    //       }
    //       // this.setState({ onNavigation: true })
    //     })
    //   })
    // }
  }
  checkForUpdate = async () => {
    let postData = {
      action: 'version_control',
      version: VersionNumber.buildVersion
    }
    const json = await apiCall(postData);
    if (json.status == "valid") {
      console.log('Using latest version')
    } else {
      this.setState({ newVersionRequired: true })
    }
  }

  _renderItem = ({ item }) => {
    return (
      <View key={item.key}>
        {
          item.key == '1' || item.key == '2' || item.key == '4' ?
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ zIndex: 99999, position: 'absolute', bottom: item.bottomStyle }}>
                <View>
                  <Text style={styles.heading}>{item.title}</Text>
                  {
                    item.title1 ? <Text style={styles.heading}>{item.title1}</Text> : null
                  }
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={item.image1} style={item.imageStyle} resizeMode="contain" />
                </View>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.description}>{item.text}</Text>
                </View>
              </View>
              <View>
                <Image source={item.image} style={styles.backgroundImage} resizeMode="stretch" />
              </View>
            </View>
            :
            <View>
              <View style={{ zIndex: 99999, position: 'absolute' }}>
                <View style={{ flexDirection: 'row', top: hp('10'), left: wp('10') }}>
                  <Image source={item.image1} />
                  <View style={{ justifyContent: 'center', marginLeft: 7 }}>
                    <Text style={styles.heading1}>LEARN</Text>
                    <View style={styles.descriptionContainer1}>
                      <Text style={styles.description1}>Learn concept with Learning guide & media</Text>
                    </View>
                  </View>
                </View>
                <View style={{ top: hp('17'), left: wp('25') }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={item.image2} />
                    <View style={{ justifyContent: 'center', marginLeft: 7 }}>
                      <Text style={styles.heading1}>PRACTICE</Text>
                      <View style={styles.descriptionContainer1}>
                        <Text style={styles.description1}>Practice personalized learning sheets daily</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ top: hp('25'), left: wp('10') }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={item.image3} />
                    <View style={{ justifyContent: 'center', marginLeft: 7 }}>
                      <Text style={styles.heading1}>TEST</Text>
                      <View style={styles.descriptionContainer1}>
                        <Text style={styles.description1}>Attempt weekly Adaptive Test</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <Image source={item.image} style={styles.backgroundImage} resizeMode="stretch" />
              </View>
            </View>
        }
      </View>
    );
  }

  _onDone = () => {
    try {
      AsyncStorage.setItem('appIntro', 'done')
      this.setState({ showRealApp: true, appIntro: 'done' })
    } catch (e) {
      console.log(e)
    }
  }

  renderDoneButton = () => {
    return (
      <View style={styles.nextContainer}>
        <Text style={styles.next}>DONE</Text>
      </View>
    )
  }

  renderNextButton = () => {
    return (
      <View style={styles.nextContainer}>
        <Text style={styles.next}>NEXT</Text>
      </View>
    )
  }

  renderPreviousButton = () => {
    return (
      <View style={styles.previousContainer}>
        <Text style={styles.next}>BACK</Text>
      </View>
    )
  }

  render() {

    if (this.state.onNavigation == true) {
      console.log('yessssss')
      return (
        <NavigationContainer>
          <SwitchStudent />
        </NavigationContainer>
      )
    }

    if (this.state.loader) {
      return (
        <SplashScreen />
      )
    }

    if (this.state.newVersionRequired) {
      return (
        <AskForUpdate />
      )
    }

    if (this.state.appIntro == "done") {
      return (
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      )
    }


    if (this.state.showRealApp) {
      return (
        <Root>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </Root>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar hidden />
          <AppIntroSlider
            renderItem={this._renderItem}
            data={slides}
            onDone={this._onDone}
            activeDotStyle={{ backgroundColor: '#089bf9' }}
            showDoneButton={true}
            renderDoneButton={this.renderDoneButton}
            renderNextButton={this.renderNextButton}
            showPrevButton={false}
            renderPrevButton={this.renderPreviousButton}
          />
        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%'
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#000000',
    textAlign: 'center'
  },
  heading1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 19,
    color: '#000000'
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
    color: '#000000',
    textAlign: 'center'
  },
  description1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#000000',
  },
  descriptionContainer: {
    marginLeft: '20%',
    marginRight: '20%',
  },
  descriptionContainer1: {
    width: wp('35')
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previous: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
  },
  next: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
    color: '#000000'
  },
  nextContainer: {
    marginTop: '22%',
  },
  imageStyle: {
    width: 50,
    height: 50
  },
  image1Contain: {
    marginTop: 70,
    flexDirection: 'row'
  },
  previousContainer: {
    marginTop: '25%'
  },
  backgroundImage: {
    width: wp('100'),
    height: hp('100')
  }
})