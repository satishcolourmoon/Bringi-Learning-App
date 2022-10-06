import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, TextInput, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { apiCall } from '../../utils';
import StarRating from 'react-native-star-rating';
import Button from '../Button';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
export default class SendFeedback extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            type: 1,
            image: '',
            image_full_path: '',
            imageUploaded: false,
            btnLoader: false,
            description: '',
            showAlert: false,
            error_message: '',
            status_id: '',
            bi_remark: '',
            department: '',
            rating: 1,
            is_rated: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('student_id').then((student_id) => {
            const { department, description, file_url, BI_remark, id, rating } = this.props.route.params.status_item
            if (rating) {
                var isRated = true;
            } else {
                var isRated = false;
            }
            this.setState({
                student_id,
                description,
                image_full_path: file_url,
                imageUploaded: true,
                status_id: id,
                bi_remark: BI_remark,
                department,
                rating,
                is_rated: isRated
            })
        })
    }

    goBack = () => {
        this.props.navigation.navigate('Support');
    }

    SubmitFeedback = async () => {
        if (this.state.rating) {
            this.setState({ btnLoader: true })
            this.setState({ error_message: '', btnLoader: true });
            var postData = {
                action: 'update_support_rating',
                student_id: this.state.student_id,
                status_id: this.state.status_id,
                rating: this.state.rating

            };
            const json = await apiCall(postData);
            if (json.status) {
                this.setState({ showAlert: true, error_message: json.message, btnLoader: false });
                this.props.navigation.navigate('Status');
            } else {
                this.setState({ showAlert: true, error_message: json.message, btnLoader: false });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Rating is required' });
        }
    }

    goToStatus = () => {
        this.props.navigation.navigate('Status');
    }

    showActionSheet = () => {
        this.ActionSheet1.show()
    }

    onStarRatingPress(rating) {
        this.setState({
            rating: rating
        });
    }

    goToImageView = (image) => {
        this.props.navigation.navigate('ImageViewer', {
            uri: image,
            backScreen: 'SendFeedBack'
        })
    }

    render() {

        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
                <AwesomeAlert
                    show={this.state.showAlert}
                    title="Attention!"
                    message={this.state.error_message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({ showAlert: false });
                    }}
                />
                <StatusBar hidden />
                <Header title="Support" title1="" backScreen="Home" headerImage="confirmSubmit" navigation={this.props.navigation} />
                <View style={{ flex: 0.9 }}>
                    <ScrollView>
                        <View style={styles.headingContainer}>
                            <Text style={styles.dep}>DEPARTMENTS  -  </Text>
                            <Text style={styles.dep1}>{this.state.department}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description</Text>
                            <View>
                                <View style={styles.inputContainer1}>
                                    <TextInput
                                        placeholder=""
                                        style={styles.input1}
                                        onChangeText={(description) => this.setState({ description: description })}
                                        value={this.state.description}
                                        multiline={true}
                                        numberOfLines={5}
                                        editable={false}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Attachment</Text>
                            {
                                this.state.imageUploaded && <TouchableWithoutFeedback onPress={() => this.goToImageView(this.state.image_full_path)}>
                                    <View>
                                        <Image source={{ uri: this.state.image_full_path }} style={{ width: 150, height: 150, marginBottom: 15, borderRadius: 10 }} resizeMode="contain" />
                                    </View>
                                </TouchableWithoutFeedback>
                            }
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Bringi Remark</Text>
                            <View>
                                <View style={styles.inputContainer1}>
                                    <TextInput
                                        placeholder=""
                                        style={styles.input1}
                                        onChangeText={(bi_remark) => this.setState({ bi_remark: bi_remark })}
                                        value={this.state.bi_remark}
                                        multiline={true}
                                        numberOfLines={5}
                                        editable={false}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Student Rating</Text>
                            <StarRating
                                disabled={this.state.is_rated}
                                rating={this.state.rating}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                starSize={30}
                                containerStyle={{ marginLeft: '2%', marginTop: '2%' }}
                                halfStarEnabled={false}
                                fullStarColor="#df2238"
                            />
                        </View>
                        {
                            !this.state.is_rated && <View style={{ marginTop: '5%', justifyContent: 'center', alignItems: 'center' }}>
                                <Button loader={this.state.btnLoader} onPress={this.SubmitFeedback} backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5} text="NEXT" />
                            </View>
                        }
                        <View style={{ padding: 15 }} />
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
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
    bottomCurve: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('15')
    },
    headingContainer: {
        marginTop: '4%',
        marginLeft: wp('7'),
        flexDirection: 'row'
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
    dep: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    dep1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#b33236'
    },
    inputContainer: {
        marginTop: '3%',
        marginLeft: '7%',
        marginRight: '7%',
        marginBottom: '3%'
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginLeft: '2%'
    },
    row: {
        flexDirection: 'row'
    },
    inputContainer1: {
        backgroundColor: '#ececec',
        borderRadius: 30,
        paddingLeft: wp('5'),
        margin: '0.4%'
    },
    input1: {
        backgroundColor: '#ececec',
        width: wp('75'),
        borderColor: '#ececec',
        borderRadius: 30,
        color: "#000",
        fontFamily: 'Poppins-SemiBold'
    },
})