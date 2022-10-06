import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';
import VersionNumber from 'react-native-version-number';
import { apiCall } from '../utils';
export default class CustomSidebarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayData: []
    }
  }
  componentDidMount() {
    AsyncStorage.getItem('student_id').then((student_id) => {
      this.sideMenu(student_id)
    });
  }
  goToAboutUs = () => {
    this.props.navigation.navigate('AboutUs')
  }
  goToDetails = (url) => {
    this.props.navigation.navigate(url)
  }
  sideMenu = async (student_id) => {
    let postData = {
      action: 'getAppSidemenu',
      user_id: student_id
    }
    const json = await apiCall(postData);
    this.setState({ loader: false });
    if (json.status) {
      this.setState({ displayData: json.data });
    }
  }
  goToLogout = async () => {
    try {
      AsyncStorage.setItem('user_id', '');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'MainNavigator' },
          ],
        })
      )
    } catch (e) {
      console.log(e)
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: '3%' }}>
          <FlatList
            data={this.state.displayData}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableWithoutFeedback onPress={() => { this.goToDetails(item.url) }}>
                    <View style={{ marginBottom: '3%' }}>
                      <View style={styles.row}>
                        <Image source={{ uri: item.image }} style={styles.icon} />
                        <View style={styles.menu}>
                          <Text style={styles.menuText}>{item.title} {item.subtitle}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <Divider />
                </View>
              )
            }}
            ListEmptyComponent={this.ListEmptyView}
            keyExtractor={(item, index) => index}
          />
          <Divider />
          <TouchableWithoutFeedback onPress={this.goToLogout}>
            <View style={{ marginBottom: '3%' }}>
              <View style={styles.row}>
                <Image source={require('../../assets/logout.png')} style={styles.icon} />
                <View style={styles.menu}>
                  <Text style={styles.menuText}>Logout</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Divider />
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.menu}>
            <Text style={styles.versionText}>VERSION {VersionNumber.appVersion}</Text>
          </View>
          <Divider />
          <View style={{ marginTop: '2%' }}>
            <TouchableWithoutFeedback onPress={this.goToAboutUs}>
              <View style={styles.row}>
                <Image source={require('../../assets/s8.png')} style={styles.icon} />
                <View style={styles.menu}>
                  <Text style={styles.menuText}>Contact Us</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  menuText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14
  },
  container: {
    flex: 1,
    paddingTop: '14%',
    backgroundColor: '#ffffff'
  },
  row: {
    flexDirection: 'row',
    padding: '3%',
    alignItems: 'center'
  },
  menu: {
    marginTop: '1%',
    marginLeft: '4%'
  },
  icon: {
    width: 30,
    height: 30
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '5%'
  },
  versionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15
  }
});