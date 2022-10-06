import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-elements';
import Loader from '../../common/Loader';
import { ScrollView } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
export default class Rewards extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            showModal: false,
            coins: 0,
            data: [],
            categories: [],
            selectedSort: '',
            selectedCategory: '',
            showAlert: false,
            error_message: '',
            student_id: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id })
            this.getStudentCoins(student_id);
            this.getRewardList();
            this.getCategories();
        })

    }

    getStudentCoins = async (student_id) => {
        let postData = {
            action: 'student_reward_points',
            student_id
        }

        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ coins: 0 });
        } else if (json.status) {
            this.setState({ coins: json.data.reward_points });
        }
    }

    getRewardList = async () => {
        let postData = {
            action: 'rewards_list',
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ data: [] });
        } else if (json.status) {
            this.setState({ data: json.data });
        }
    }

    getCategories = async () => {
        let postData = {
            action: 'filter_categories',
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ categories: [], loader: false });
        } else if (json.status) {
            this.setState({ categories: json.data, loader: false });
        }
    }

    getSortResults = async (status) => {
        this.setState({ loader: true, selectedSort: status });
        let postData = {
            action: 'sort_rewards',
            filter_status: status
        }
        const json = await apiCall(postData);

        if (!json.status) {
            this.setState({ data: [], loader: false });
        } else if (json.status) {
            this.setState({ data: json.data, loader: false });
        }
    }

    getFilterResults = async (category_id) => {
        this.setState({ loader: true, selectedCategory: category_id });
        let postData = {
            action: 'filter_rewards',
            category_id
        }
        const json = await apiCall(postData);

        if (!json.status) {
            this.setState({ data: [], loader: false });
        } else if (json.status) {
            this.setState({ data: json.data, loader: false });
        }
    }

    goBack = () => {
        this.props.navigation.navigate('Home');
    }

    showActionSheet = () => {
        this.ActionSheet1.show()
    }

    showActionSheet1 = () => {
        this.ActionSheet2.show()
    }

    redeemReward = (id) => {
        Alert.alert(
            "REDEEM",
            "Do you want to redeem this reward?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.SubmitReedemReward(id) }
            ],
            { cancelable: false }
        );
    }

    SubmitReedemReward = async (reward_id) => {
        const { student_id } = this.state
        this.setState({ loader: true });
        let postData = {
            action: 'buy_rewards',
            reward_id,
            student_id
        }
        const json = await apiCall(postData);
        if (!json.status) {
            this.setState({ loader: false, showAlert: true, error_message: json.message });
        } else if (json.status) {
            this.setState({ loader: false, showAlert: true, error_message: json.message }, () => {
                this.getStudentCoins(student_id)
            });
        }
    }

    goToImageViewer = (image) => {
        this.props.navigation.navigate('ImageViewer', { uri: image })
    }

    render() {
        const { coins, categories } = this.state;
        const options = [
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>CANCEL</Text>,
            <TouchableWithoutFeedback onPress={() => this.getSortResults("new")}>
                <View style={styles.sheetItem}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, margin: 5, color: this.state.selectedCategory == "new" ? 'blue' : 'black' }}>NEWLY ADDED</Text>
                </View>

            </TouchableWithoutFeedback>
            ,
            <TouchableWithoutFeedback onPress={() => this.getSortResults("price_low_to_high")}>
                <View style={styles.sheetItem}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, margin: 15, color: this.state.selectedCategory == "price_low_to_high" ? 'blue' : 'black' }}>PRICE- LOW TO HIGH</Text>
                </View>
            </TouchableWithoutFeedback>
            ,
            <TouchableWithoutFeedback onPress={() => this.getSortResults("price_high_to_low")}>
                <View style={styles.sheetItem}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, margin: 22, color: this.state.selectedCategory == "price_high_to_low" ? 'blue' : 'black' }}>PRICE- HIGH TO LOW</Text>
                </View>
            </TouchableWithoutFeedback>
        ]
        const filters = categories.map((item1, index) => {
            return (
                <TouchableWithoutFeedback onPress={() => this.getFilterResults(item1.id)}>
                    <View style={styles.sheetItem}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, margin: 15, color: this.state.selectedCategory == item1.id ? 'blue' : 'black' }}>{item1.category}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        })


        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
                <ActionSheet
                    ref={o => this.ActionSheet1 = o}
                    title={<Text style={{ color: '#000', fontSize: 13, fontFamily: 'Poppins-SemiBold' }}>FILTER</Text>}
                    options={options}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { console.log(index) }}
                />
                <ActionSheet
                    ref={o => this.ActionSheet2 = o}
                    title={<Text style={{ color: '#000', fontSize: 13, fontFamily: 'Poppins-SemiBold' }}>Apply Filter</Text>}
                    options={filters}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { console.log(index) }}
                />
                <AwesomeAlert
                    show={this.state.showAlert}
                    title="Attention!"
                    message={this.state.error_message}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({ showAlert: false });
                    }}
                />
                <StatusBar hidden />
                <Header title="Redeem" title1="Rewards" backScreen="Home" headerImage="rewards" navigation={this.props.navigation} />
                <View style={styles.secondcontainer}>
                    <ScrollView>
                        <View style={styles.coinContainer}>
                            <View style={styles.row}>
                                <Image source={require('../../../assets/coins.png')} style={styles.coinImage} />
                                <View style={styles.coinNumberContinaer}>
                                    <Text style={styles.coinNunber}>{coins > 0 ? coins : 0}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tabContianer}>
                            <TouchableWithoutFeedback onPress={this.showActionSheet}>
                                <View style={styles.tab}>
                                    <View style={styles.row}>
                                        <Image source={require('../../../assets/sort.png')} style={styles.filterImage} />
                                        <Text style={styles.tabText1}>SORT</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={{ borderRightWidth: 1, borderColor: '#d7d7d7' }}></View>
                            <TouchableWithoutFeedback onPress={this.showActionSheet1}>
                                <View style={styles.tab}>
                                    <View style={styles.row}>
                                        <Image source={require('../../../assets/filter.png')} style={styles.filterImage} />
                                        <Text style={styles.tabText1}>FILTER</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.aboutContainer}>
                            {
                                this.state.data.map((item, index) => {
                                    return (
                                        <Card containerStyle={styles.card}>
                                            <View style={styles.row}>
                                                <TouchableWithoutFeedback onPress={() => { this.goToImageViewer(item.image) }}>
                                                    <Image source={{ uri: item.image }} resizeMode="contain" style={styles.calImage} />
                                                </TouchableWithoutFeedback>

                                                <View style={styles.cardTitle}>
                                                    <View style={styles.row}>
                                                        <View style={{ width: wp('49') }}>
                                                            <Text style={styles.cardText1}>{item.reward_name}</Text>

                                                        </View>
                                                        <View>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Image source={require('../../../assets/ec.png')} style={styles.coin} />
                                                                <Text style={styles.coinNunber}>{item.number_of_points}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: wp('70') }}>
                                                        <Text style={styles.cardText3}>Category - {item.category}</Text>
                                                        <Text style={styles.cardText2}>{item.description}</Text>
                                                    </View>
                                                    <TouchableWithoutFeedback onPress={() => this.redeemReward(item.id)}>
                                                        <View style={styles.redeemContainer}>
                                                            <Text style={styles.redeemText}>REDEEM</Text>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </View>
                                        </Card>
                                    )
                                })
                            }
                        </View>
                        <View style={{ margin: 15 }} />
                    </ScrollView>
                </View>
                <Footer />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    secondcontainer: {
        flex: 0.9,
    },
    aboutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText3: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12
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
    sheetItem: {
        width: wp('85'),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },

    backIcon: {
        width: 55,
        height: 55
    },
    successImage: {
        width: 150,
        height: 150
    },
    successText: {
        fontFamily: 'Poppins-Regular',
        marginTop: '2%'
    },
    successId: {
        fontFamily: 'Poppins-SemiBold',
        marginTop: '1%',
        fontSize: 17
    },
    descContainer: {
        marginLeft: wp('4'),
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
    },
    tabContianer: {
        backgroundColor: '#eeeeee',
        flexDirection: 'row',
        borderRadius: 30,
        margin: 13
    },
    tab: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('45'),
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('45'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab1: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('40'),
        backgroundColor: '#ac90e7',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
    },
    tab2: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        width: wp('40'),
        backgroundColor: '#ac90e7',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30
    },
    tabText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#ffffff',
    },
    tabText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '3%'
    },
    filterImage: {
        width: 20,
        height: 20
    },
    row: {
        flexDirection: 'row'
    },
    addCoinContainer: {
        backgroundColor: '#ef1718',
        padding: '2%',
        width: wp('25'),
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addCoinText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#ffffff',
    },
    addCoinMainContainer: {
        position: 'absolute',
        right: 0,
        top: 170
    },
    coinImage: {
        width: 30,
        height: 30
    },
    coinNumberContinaer: {
        justifyContent: 'center',
        marginLeft: '2%'
    },
    coinNunber: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#000',
    },
    coinContainer: {
        marginLeft: 17,
        marginTop: 5
    },
    card: {
        width: wp('90'),
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 10
    },
    cardTitle: {
        justifyContent: 'center',
        marginLeft: '5%'
    },
    cardText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    cardText2: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#868686'
    },
    calImage: {
        width: 50,
        height: 50,
        backgroundColor: '#fff'
    },
    redeemContainer: {
        backgroundColor: '#ed181a',
        width: wp('20'),
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1%',
        borderRadius: 20
    },
    redeemText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff'
    },
    coin: {
        width: 18,
        height: 18
    },
    profileImage: {
        width: 80,
        height: 80
    },
    profileImageContainer: {
        position: 'absolute',
        top: -40
    },
    profileMainContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    profileTextContainer: {
        marginTop: '1%',
        justifyContent: 'center',
        alignItems: 'center'
    },
})