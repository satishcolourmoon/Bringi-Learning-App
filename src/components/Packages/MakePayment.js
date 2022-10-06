import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, Text, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import { Icon, Card } from 'react-native-elements';
import RazorpayCheckout from 'react-native-razorpay';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import { apiCall } from '../../utils';
import Modal from 'react-native-modal';
export default class MakePayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            data: [],
            selectedSubWithAddons: [],
            total_amount: 0,
            video_calls_amount: 0,
            live_calls_amount: 0,
            showAlert: false,
            error_message: '',
            promocode_code: '',
            modalVisible: false,
            coupons: [],
            is_coupon_applied: false,
            applied_coupon: '',
            coupon_amount: '0',
            loading: false,
            isCouponValidated: false,
            validating: false,
            final_amount: 0,
            actual_total: 0
        }
    }
    componentDidMount() {
        var month = this.props.route.params.month;
        this.getPackageSubjects(month);
    }
    goBack = () => {
        this.props.navigation.navigate('BuyPackage');
    }
    increaseVideoCalls = (index) => {
        let tempArr = this.state.selectedSubWithAddons;
        var currentIncrement = tempArr[index].video_calls;
        var updatedIncrement = Number(currentIncrement) + 1;
        let currentAmount = tempArr[index].single_video_amount;
        var updatedAmount = Number(tempArr[index].amount) + Number(currentAmount);
        tempArr[index].video_calls = updatedIncrement;
        //tempArr[index].amount = updatedAmount;
        var updated_video_call_amount = Number(this.state.video_calls_amount) + Number(currentAmount);
        this.setState({ selectedSubWithAddons: tempArr, video_calls_amount: updated_video_call_amount }, () => {
            this.UpdateTotalAmount()
        });
    }


    decreaseVideoCalls = (index, current) => {
        let tempArr = this.state.selectedSubWithAddons;
        if (tempArr[index].video_calls > this.state.data[index].video_calls) {
            var currentIncrement = tempArr[index].video_calls;
            var updatedIncrement = Number(currentIncrement) - 1;
            let currentAmount = tempArr[index].single_video_amount;
            var updatedAmount = Number(tempArr[index].amount) - Number(currentAmount);
            tempArr[index].video_calls = updatedIncrement;
            //tempArr[index].amount = updatedAmount;
            var updated_video_call_amount = Number(this.state.video_calls_amount) - Number(currentAmount);
            this.setState({ selectedSubWithAddons: tempArr, video_calls_amount: updated_video_call_amount }, () => {
                this.UpdateTotalAmount()
            });
        }
    }

    increaseLiveVideos = (index) => {
        let tempArr = this.state.selectedSubWithAddons;
        var currentIncrement = tempArr[index].live_videos;
        let currentAmount = tempArr[index].single_video_amount;
        var updatedAmount = Number(tempArr[index].amount) + Number(currentAmount)
        var updatedIncrement = Number(currentIncrement) + 1;
        tempArr[index].live_videos = updatedIncrement;
        // tempArr[index].amount = updatedAmount;
        var updated_live_call_amount = Number(this.state.live_calls_amount) + Number(currentAmount);

        this.setState({ selectedSubWithAddons: tempArr, live_calls_amount: updated_live_call_amount }, () => {
            this.UpdateTotalAmount()
        });
    }

    decreaseLiveVideos = (index, current) => {
        let tempArr = this.state.selectedSubWithAddons;
        if (tempArr[index].live_videos > this.state.data[index].live_videos) {
            var currentIncrement = tempArr[index].live_videos;
            var updatedIncrement = Number(currentIncrement) - 1;
            let currentAmount = tempArr[index].single_video_amount;
            var updatedAmount = Number(tempArr[index].amount) - Number(currentAmount);
            tempArr[index].live_videos = updatedIncrement;
            //tempArr[index].amount = updatedAmount;
            var updated_live_call_amount = Number(this.state.live_calls_amount) - Number(currentAmount);
            this.setState({ selectedSubWithAddons: tempArr, live_calls_amount: updated_live_call_amount }, () => {
                this.UpdateTotalAmount()
            });
        }
    }

    addSubject = (index) => {
        let tempArr = this.state.selectedSubWithAddons;
        var currentStatus = tempArr[index].is_subject_selected;
        var updatedStatus = !currentStatus;
        tempArr[index].is_subject_selected = updatedStatus;
        this.setState({ selectedSubWithAddons: tempArr }, () => {
            this.UpdateTotalAmount()
        });
    }

    UpdateTotalAmount = () => {
        if (this.state.isCouponValidated) {
            var couponAmount = this.state.coupon_amount;
        } else {
            var couponAmount = 0;
        }
        let total_amount = 0;
        let total_video_calls_amount = this.state.video_calls_amount;
        let total_live_calls_amount = this.state.live_calls_amount;
        this.state.selectedSubWithAddons.map((item, index) => {
            if (item.is_subject_selected) {
                total_amount += item.amount
            }
        })
        var updatedTotalAmount = total_amount + total_video_calls_amount + total_live_calls_amount - couponAmount;
        this.setState({ total_amount: updatedTotalAmount });
    }

    goToMakePayment = async () => {
        if (this.state.total_amount > 0) {
            this.setState({ loader: true });
            let postData = {
                action: 'razerpay_order_id',
                total_amount: this.state.total_amount,
                wattsappObj: JSON.stringify(this.state.selectedSubWithAddons),
                student_id: this.props.route.params.student_id,
                package_id: this.props.route.params.package_id,
                promocode_code: this.state.applied_coupon,
                promocode_code_discount: this.state.coupon_amount
            }
            const json = await apiCall(postData);
            if (json.status == "valid") {
                var options = {
                    description: 'Credits towards Bringi Learning',
                    image: 'https://bringilearning.com/admin/assets/images/fav_icon_30_01_2021.png',
                    currency: 'INR',
                    key: 'rzp_live_vhmr5uWsBwJr93',
                    amount: this.state.total_amount * 100,
                    name: 'Bringi Learning',
                    order_id: json.data.order_id,
                    prefill: {
                        email: json.data.email,
                        contact: json.data.mobile,
                        name: json.data.name
                    },
                    theme: { color: '#894290' }
                }
                RazorpayCheckout.open(options).then((data) => {
                    this.doPaymentSuccessAction(data, json.data.order_id);
                }).catch((error) => {
                    this.setState({ showAlert: true, error_message: "Payment cancelled or Razorpay error occured", loader: false });
                });
            } else {
                this.setState({ showAlert: true, error_message: "Problem with server.Try later", loader: false });
            }
        } else {
            this.setState({ showAlert: true, error_message: 'Please select your subject', loader: false });
        }
    }
    doPaymentSuccessAction = async (data, order_id) => {
        let postData1 = {
            action: 'dopaymentsuccess',
            order_id: order_id,
            payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature
        }
        const json1 = await apiCall(postData1);
        if (json1.status) {
            this.setState({ loader: false, showAlert: true, error_message: 'Payment successfully confirmed' });
            AsyncStorage.setItem('payment_done', 'yes');
            setTimeout(() => { this.props.navigation.navigate('MainNavigator') }, 1200);
        } else {
            this.setState({ showAlert: true, error_message: "Error occured.If amount has been deducted it will be refunded in 2-3 days", loader: false });
        }
    }
    openModal = async () => {
        this.setState({ loading: true })
        let postData3 = {
            action: 'couponcodes',
        }
        const json1 = await apiCall(postData3);
        if (json1.status) {
            this.setState({ coupons: json1.data, modalVisible: true, loading: false });
        } else {
            this.setState({ showAlert: true, error_message: "No coupons available", loader: false, loading: false });
        }

    }
    getPackageSubjects = async (month) => {
        let postData3 = {
            action: 'monthwiseSubjects',
            month: month,
            student_id: this.props.route.params.student_id,
        }
        const json = await apiCall(postData3);

        if (!json.status) {
            this.setState({ loader: false, data: [] });
        } else if (json.status) {
            var mainData = [...json.packages];
            let tempArr = [];
            mainData.map((item, index) => {
                var obj = {
                    subject_id: item.subject_id,
                    video_calls: item.video_calls,
                    live_videos: item.live_videos,
                    subject_name: item.subject,
                    is_subject_selected: true,
                    amount: Number(item.amount),
                    package_id: item.id,
                    single_video_amount: 100
                }
                tempArr.push(obj);
            });
            var total_amount = tempArr.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
            this.setState({
                loader: false,
                data: json.packages,
                selectedSubWithAddons: tempArr,
                total_amount: total_amount
            });
        }
    }
    applyCoupon = (item) => {
        this.setState({
            is_coupon_applied: true,
            applied_coupon: item.code,
            coupon_amount: item.price,
            applied_coupon_id: item.id,
            modalVisible: false
        })
    }

    removeCoupon = () => {
        this.setState({
            is_coupon_applied: false,
            applied_coupon: '',
            coupon_amount: '',
            applied_coupon_id: '',
            modalVisible: false,
            isCouponValidated: false,
            total_amount: this.state.actual_total
        })
    }

    validateCoupon = async () => {
        if (this.state.applied_coupon && this.state.total_amount) {
            this.setState({ validating: true, actual_total: this.state.total_amount })
            let postData4 = {
                action: 'check_promocode',
                amount: this.state.total_amount,
                code: this.state.applied_coupon
            }
            const json7 = await apiCall(postData4);
            if (json7.status) {
                this.setState({ isCouponValidated: true, total_amount: json7.data.final_price, validating: false });
            } else {
                this.setState({ isCouponValidated: false, validating: false, showAlert: true, error_message: "Coupon not applied.Try later", });
            }
        } else {
            this.setState({ isCouponValidated: false, validating: false, showAlert: true, error_message: "Please select your coupon" });
        }
    }
    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.modalVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.cancelContainer}>
                            <Icon name="times" type="font-awesome" onPress={() => { this.setState({ modalVisible: false }) }} />
                        </View>
                        <ScrollView>
                            {
                                this.state.coupons.map((item5, index) => {
                                    return (
                                        <Card containerStyle={styles.couponContianer} key={index}>
                                            <View style={styles.row}>

                                                <View style={{ width: wp('50') }}>
                                                    <Text style={styles.couponCode}>{item5.code}</Text>
                                                    <Text style={styles.cdescription}>{item5.description}</Text>
                                                </View>
                                                {
                                                    this.state.applied_coupon_id == item5.id ?
                                                        <TouchableWithoutFeedback onPress={() => { this.applyCoupon(item5) }}>
                                                            <View style={styles.applyCouponContainer1}>
                                                                <Text style={styles.applyText}>APPLIED!</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={() => { this.applyCoupon(item5) }}>
                                                            <View style={styles.applyCouponContainer}>
                                                                <Text style={styles.applyText}>APPLY</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                }
                                            </View>
                                        </Card>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </Modal>
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
                <ScrollView style={{ flex: 1 }}>
                    <StatusBar hidden />
                    <View style={styles.whiteContainer}>
                        <View style={styles.backMainContainer}>
                            <TouchableWithoutFeedback onPress={this.goBack}>
                                <Image source={require('../../../assets/back.png')} style={styles.backIcon} />
                            </TouchableWithoutFeedback>
                            <View style={styles.descContainer}>
                                <Text style={styles.heading}>Make Payment</Text>
                            </View>
                        </View>
                        <View style={styles.topCurveImageContainer}>
                            <Image source={require('../../../assets/subject.png')} resizeMode="stretch" style={styles.topCurveImage} />
                        </View>
                        <View style={styles.profileContainer}>
                            <View style={styles.row}>
                                <View style={styles.round1}>
                                    <View style={styles.round2}>
                                        <Image source={require('../../../assets/profile.png')} resizeMode="stretch" style={styles.profileImage} />
                                    </View>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.name}>{this.props.route.params.student_name}</Text>
                                    <Text style={styles.class}>{this.props.route.params.class_name}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.subjectContainer}>
                        <Text style={styles.duration}>{this.props.route.params.package_name}</Text>
                        <Text style={styles.subject}>Select Subject</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.state.selectedSubWithAddons.map((item, index) => {
                                    return (
                                        <View style={styles.card} key={item.id}>
                                            <View>
                                                <Text style={styles.cardSubject}>{item.subject_name}</Text>
                                            </View>
                                            <View style={styles.center}>
                                                <TouchableWithoutFeedback onPress={() => this.addSubject(index)}>
                                                    <View style={styles.addContainer}>
                                                        {
                                                            item.is_subject_selected ?
                                                                <Text style={styles.addText}>- REMOVE</Text> :
                                                                <Text style={styles.addText}>+ ADD</Text>
                                                        }
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    {
                        this.state.selectedSubWithAddons.map((item, index) => {
                            if (item.is_subject_selected) {
                                return (
                                    <View style={styles.bgWhite}>
                                        <View>
                                            <Text style={styles.addonHeading}>{item.subject_name} Add Ons</Text>
                                            <View style={styles.row}>
                                                <View style={styles.addonContianer}>
                                                    <View style={styles.addon}>
                                                        <View>
                                                            <Text style={styles.cardSubject}>1:1 VIDEO CLASS</Text>
                                                        </View>
                                                        <View style={styles.center}>
                                                            <View style={styles.row}>
                                                                <TouchableWithoutFeedback onPress={() => this.increaseVideoCalls(index)}>
                                                                    <View style={styles.increaseContainer}>
                                                                        <Text style={styles.addText}>+</Text>
                                                                    </View>
                                                                </TouchableWithoutFeedback>
                                                                <Text style={styles.number}>{item.video_calls}</Text>
                                                                <TouchableWithoutFeedback onPress={() => this.decreaseVideoCalls(index, item.video_calls)}>
                                                                    <View style={styles.increaseContainer}>
                                                                        <Text style={styles.addText}>-</Text>
                                                                    </View>
                                                                </TouchableWithoutFeedback>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.addonContianer}>
                                                    <View style={styles.addon}>
                                                        <View>
                                                            <Text style={styles.cardSubject}>LIVE VIDEOS</Text>
                                                        </View>
                                                        <View style={styles.center}>
                                                            <View style={styles.row}>
                                                                <TouchableWithoutFeedback onPress={() => this.increaseLiveVideos(index)}>
                                                                    <View style={styles.increaseContainer}>
                                                                        <Text style={styles.addText}>+</Text>
                                                                    </View>
                                                                </TouchableWithoutFeedback>
                                                                <Text style={styles.number}>{item.live_videos}</Text>
                                                                <TouchableWithoutFeedback onPress={() => this.decreaseLiveVideos(index)}>
                                                                    <View style={styles.increaseContainer}>
                                                                        <Text style={styles.addText}>-</Text>
                                                                    </View>
                                                                </TouchableWithoutFeedback>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            } else {
                                return (
                                    <View style={styles.bgWhite}>
                                        <Text style={styles.addonHeading}>Add Ons</Text>
                                        <View style={styles.pleaseContainer}>
                                            <Text style={styles.please}>Please add your subjects to see add ons</Text>
                                        </View>
                                    </View>
                                )
                            }
                        })
                    }
                    <View style={styles.summaruContainer}>
                        <View style={styles.row}>
                            <View style={styles.leftWidth}>
                                <Text style={styles.summaryHeading}>Subject</Text>
                            </View>
                            <View style={styles.rightWidth}>
                                <Text style={styles.summaryHeading}>Price</Text>
                            </View>
                        </View>
                        {
                            this.state.selectedSubWithAddons.map((item, index) => {
                                if (item.is_subject_selected) {
                                    return (
                                        <View style={styles.row} key={item.id}>
                                            <View style={styles.leftWidth}>
                                                <Text style={styles.summaryvalue}>{item.subject_name}</Text>
                                            </View>
                                            <View style={styles.rightWidth}>
                                                <Text style={styles.summaryvalue}>₹{item.amount}</Text>
                                            </View>
                                        </View>
                                    )
                                } else {
                                    return (
                                        <View style={styles.row}>
                                            <View style={styles.leftWidth}>
                                                <Text style={styles.summaryvalue}>---</Text>
                                            </View>
                                            <View style={styles.rightWidth}>
                                                <Text style={styles.summaryvalue}>₹0</Text>
                                            </View>
                                        </View>
                                    )
                                }
                            })
                        }
                        <View style={styles.divider}></View>
                        <View style={styles.row}>
                            <View style={styles.leftWidth}>
                                <Text style={styles.summaryHeading}>Addons</Text>
                            </View>
                            <View style={styles.rightWidth}>
                                <Text style={styles.summaryHeading}>Price</Text>
                            </View>
                        </View>
                        <View style={styles.row} >
                            <View style={styles.leftWidth}>
                                <Text style={styles.summaryvalue}>1:1 Video Call</Text>
                            </View>
                            <View style={styles.rightWidth}>
                                <Text style={styles.summaryvalue}>₹{this.state.video_calls_amount}</Text>
                            </View>
                        </View>
                        <View style={styles.row} >
                            <View style={styles.leftWidth}>
                                <Text style={styles.summaryvalue}>Live Video Calls</Text>
                            </View>
                            <View style={styles.rightWidth}>
                                <Text style={styles.summaryvalue}>₹{this.state.live_calls_amount}</Text>
                            </View>
                        </View>
                        {
                            this.state.isCouponValidated && <View style={styles.row} >
                                <View style={styles.leftWidth}>
                                    <Text style={styles.appliedText}>Coupon Applied!</Text>
                                </View>
                                <View style={styles.rightWidth}>
                                    <Text style={styles.summaryvalue}>₹{this.state.coupon_amount}</Text>
                                </View>
                            </View>
                        }

                    </View>
                    <View style={styles.bgWhite}>
                        <View style={styles.totalContainer}>
                            <View style={styles.row}>
                                <View style={styles.leftWidth}>
                                    <Text style={styles.total}>Total</Text>
                                </View>
                                <View style={styles.rightWidth}>
                                    <Text style={styles.total}>₹{this.state.total_amount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.promocodeContainer}>
                            <Text style={styles.promocode}>Promocode</Text>
                            <TextInput
                                style={styles.input}
                                value={this.state.applied_coupon}
                                editable={false}
                            />
                            <View style={styles.row}>
                                <TouchableWithoutFeedback onPress={this.validateCoupon}>
                                    <View style={styles.buttonContainer}>
                                        <View style={styles.row}>
                                            <Text style={styles.applyText}>APPLY</Text>
                                            {
                                                this.state.validating && <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 6 }}>
                                                    <ActivityIndicator color='#ffffff' size="small" />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={this.openModal}>
                                    <View style={styles.buttonContainer1}>
                                        <View style={styles.row}>
                                            <Text style={styles.applyText}>VIEW COUPONS</Text>
                                            {
                                                this.state.loading && <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 6 }}>
                                                    <ActivityIndicator color='#ffffff' size="small" />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                {
                                    this.state.is_coupon_applied && <TouchableWithoutFeedback onPress={this.removeCoupon}>
                                        <View style={styles.buttonContainerred}>
                                            <View style={styles.row}>
                                                <Text style={styles.applyText}>Remove</Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.bottomCurve}>
                        <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                        <View style={styles.proceedContainer}>
                            <TouchableWithoutFeedback onPress={this.goToMakePayment}>
                                <View style={styles.row}>
                                    <Text style={styles.proceedText}>PROCEED</Text>
                                    <Icon name="angle-right" type="font-awesome" color="#fff" size={21} style={{ marginLeft: 4 }} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ececec'
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3%',
        backgroundColor: '#8a4391',
        marginTop: '2%',
        width: wp('20'),
        borderRadius: 6
    },
    buttonContainerred: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3%',
        backgroundColor: 'red',
        marginTop: '2%',
        width: wp('20'),
        borderRadius: 6,
        marginLeft: 5
    },
    buttonContainer1: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3%',
        backgroundColor: '#8a4391',
        marginTop: '2%',
        marginLeft: '2%',
        width: wp('35'),
        borderRadius: 6
    },
    summaryHeading: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    applyText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#ffffff'
    },
    input: {
        backgroundColor: '#ffffff',
        fontFamily: 'Poppins-Regular',
        borderRadius: 6,
        color: '#000000',
        paddingLeft: 7
    },
    summaryvalue: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14
    },
    total: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#8a4190'
    },
    bgWhite: {
        backgroundColor: '#ffffff',
        marginTop: hp('2')
    },
    topCurveImageContainer: {
        alignItems: 'flex-end',
    },
    bottomCurve: {
        justifyContent: 'flex-end',
        backgroundColor: '#ffffff'
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('13')
    },
    backMainContainer: {
        position: 'absolute',
        top: 30,
        left: 10,
        backgroundColor: '#ffffff'
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
    descContainer: {
        marginLeft: wp('4')
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238'
    },
    name: {
        fontFamily: 'Poppins-SemiBold',
        color: '#7d3686',
        fontSize: 16
    },
    profileContainer: {
        marginLeft: '4%'
    },
    round1: {
        width: 90,
        height: 90,
        borderRadius: 90 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e9e9e9',
    },
    round2: {
        backgroundColor: '#ffffff',
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 50,
        height: 50
    },
    row: {
        flexDirection: 'row'
    },
    textContainer: {
        justifyContent: 'center',
        marginLeft: wp('2')
    },
    class: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
    },
    whiteContainer: {
        backgroundColor: '#ffffff',
        paddingBottom: hp('2')
    },
    subjectContainer: {
        marginLeft: '6%',
        marginTop: hp('1')
    },
    duration: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#e52323'
    },
    subject: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
    },
    cardSubject: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        textAlign: 'center'
    },
    addContainer: {
        backgroundColor: '#894290',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        borderRadius: 8,
        marginTop: '0.5%',
    },
    increaseContainer: {
        backgroundColor: '#894290',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2%',
        borderRadius: 8,
        marginTop: '0.5%',
        width: wp('7'),
        margin: '1%'
    },
    addText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 11,
        color: '#ffffff'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#ffffff',
        width: wp('37'),
        height: hp('10'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        margin: 6
    },
    addonContianer: {
        marginLeft: '6%',
        marginBottom: '3%'
    },
    addon: {
        width: wp('37'),
        height: hp('10'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        margin: 6,
        borderWidth: 1,
        borderColor: '#cacaca'
    },
    addonHeading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#e52323',
        marginTop: '2%',
        marginLeft: '6%',
    },
    number: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        marginTop: '2%',
        marginLeft: '4%',
        marginRight: '4%'
    },
    summaruContainer: {
        marginLeft: '6%',
        padding: '2%'
    },
    totalContainer: {
        marginLeft: '6%',
        padding: '2%'
    },
    leftWidth: {
        width: wp('70')
    },
    rightWidth: {
        width: wp('20')
    },
    promocode: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14
    },
    promocodeContainer: {
        marginLeft: '5%',
        padding: '2%',
        marginRight: '6%'
    },
    proceedContainer: {
        position: 'absolute',
        right: 20,
        bottom: 18
    },
    proceedText: {
        fontFamily: 'Poppins-SemiBold',
        marginLeft: wp('4'),
        color: '#ffffff',
        fontSize: 15
    },
    pleaseContainer: {
        marginLeft: '6%',
        marginTop: '0.5%',
        marginBottom: '1%'
    },
    please: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14
    },
    divider: {
        borderBottomWidth: 0.6,
        borderBottomColor: '#a8a8a8',
        marginTop: '1%',
        marginBottom: '1%',
        width: wp('80')
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 8

    },
    couponContianer: {
        borderRadius: 8,
        elevation: 4,
        marginTop: 20,
        marginLeft: 5,
        marginRight: 5
    },
    cancelContainer: {
        position: 'absolute',
        right: 5,
        top: -0
    },
    couponCode: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13
    },
    cdescription: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        color: 'grey'
    },
    applyCouponContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 7,
        height: hp('4'),
        width: wp('20'),
        borderRadius: 8
    },
    applyCouponContainer1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 7,
        height: hp('4'),
        width: wp('20'),
        borderRadius: 8
    },
    appliedText: {
        fontFamily: 'Poppins-Regular',
        color: 'green'
    }
})