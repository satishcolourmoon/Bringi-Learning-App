import React from 'react';
import { View, StyleSheet, StatusBar, Image, BackHandler, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../../common/Loader';
import qs from 'qs';
import { baseUrl } from '../../constants';
import { Icon } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import Asyncstorage from '@react-native-community/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

export default class ExtraPratiseQuestionPaper extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            question_id: '',
            options: [],
            question: '',
            time: '',
            noOfQns: '',
            data: [],
            userAnswer: '',
            index: '',
            showAlert: false,
            showAlert1: '',
            error_message: '',
            error_message1: '',
            parent_id: '',
            student_id: '',
            question_type: 'multiple_choice',
            is_answered: false,
            finishLoader: false,
            modal_visible: false,
            selectedImage: '',
            test_id: ''
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        Asyncstorage.getItem('student_id').then((student_id) => {
            this.setState({ student_id }, () => {
                this.getQuestions(student_id);
            })

        })
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.setState({ showAlert: true, error_message: 'Submit your exam before leaving' });
        return true;
    }

    goBack = () => {
        this.setState({ showAlert: true, error_message: 'Submit your exam before leaving' });
    }

    getQuestions = (student_id) => {
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'student_extra_practice',
                worksheet_id: this.props.route.params.qr_code,
                student_id: student_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    alert(json.message);
                    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
                    this.props.navigation.goBack()
                } else if (json.status) {
                    if (json.data.noofquestion > 0) {
                        Asyncstorage.getItem('user_id').then((user_id) => {
                            this.setState({
                                loader: false,
                                data: json.data.questions,
                                noOfQns: json.data.noofquestion,
                                question_name: json.data.questions[0].question,
                                options: json.data.questions[0].options,
                                question_id: json.data.questions[0].id,
                                time: json.data.total_time,
                                index: 0,
                                parent_id: user_id,
                                student_id: student_id,
                                userAnswer: json.data.questions[0].user_answer,
                                image: json.data.questions[0].image,
                                question_type: json.data.questions[0].question_type,
                                test_id: json.data.test_id
                            }, () => {
                                this.startExamTimer(json.data.test_id, student_id)
                            });
                        })
                    } else {
                        alert("No questions available.Please check back later");
                        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
                        this.props.navigation.goBack()
                    }
                }
            })
            .catch((error) => {
                this.setState({ loader: false });
                console.error(error);
            });

    }

    startExamTimer = async (test_id, user_id) => {
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'extra_practice_exam_start_timer',
                user_id,
                test_id
            })
        }).then((response) => response.json())
            .then((json) => {
            })
    }

    selectQuestion = (item, index) => {
        this.setState({
            question_name: item.question,
            options: item.options,
            question_id: item.id,
            index: index,
            userAnswer: item.user_answer,
            image: item.image,
            question_type: item.question_type
        });
    }

    selectOption = (value) => {
        let tempArr = this.state.data;
        tempArr.map((item) => {
            if (item.id == this.state.question_id) {
                item.user_answer = value;
                item.is_answered = true;
            }
        });
        this.setState({ userAnswer: value });
    }

    selectNextQuestion = (index) => {
        this.setState({ saveLoader: true })
        if (this.state.data[index].question_type == "fill_the_blanks") {
            var user_answer = JSON.stringify(this.state.userAnswer);
            var is_answered = this.state.is_answered;
        } else {
            var user_answer = this.state.data[index].user_answer
            var is_answered = this.state.data[index].is_answered
        }
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'save_student_extra_practice_question',
                test_id: this.state.test_id,
                parent_id: this.state.parent_id,
                user_id: this.state.student_id,
                question_id: this.state.question_id,
                user_answer: user_answer,
                correct_answer: this.state.data[index].correct_answer,
                is_answered: is_answered
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == "valid") {
                    this.setState({
                        question_name: this.state.data[index + 1].question,
                        options: this.state.data[index + 1].options,
                        question_id: this.state.data[index + 1].id,
                        index: index + 1,
                        image: this.state.data[index + 1].image,
                        question_type: this.state.data[index + 1].question_type,
                        userAnswer: this.state.data[index + 1].user_answer,
                        saveLoader: false
                    }, () => {
                        fetch(baseUrl + 'user', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'content-type': 'application/x-www-form-urlencoded',
                            },
                            body: qs.stringify({
                                action: 'student_extra_practice',
                                worksheet_id: this.props.route.params.sheet_id,
                                student_id: this.state.student_id
                            })
                        }).then((response) => response.json())
                            .then((json) => {
                                if (!json.status) {
                                    this.setState({ loader: false, data: [] });
                                } else if (json.status) {
                                    this.setState({
                                        loader: false,
                                        data: json.data.questions,
                                        userAnswer: this.state.data[index + 1].user_answer
                                    });
                                }
                            }).catch((error) => {
                                this.setState({ loader: false });
                                console.error(error);
                            });

                    });
                } else if (json.status == "time_exceeded") {
                    this.setState({ showAlert2: true, error_message2: 'Time exceeded.Please submit your exam', saveLoader: true });
                } else {
                    this.setState({ showAlert1: true, error_message1: 'There might be problem with server.Please try later', saveLoader: true });
                }
            })
            .catch((error) => {
                this.setState({ loader: false });
                console.error(error);
            });
    }

    selectPreviousQuestion = (index) => {
        this.setState({ saveLoader: true })
        if (this.state.data[index].question_type == "fill_the_blanks") {
            var user_answer = JSON.stringify(this.state.userAnswer);
            var is_answered = this.state.is_answered;
        } else {
            var user_answer = this.state.data[index].user_answer
            var is_answered = this.state.data[index].is_answered
        }
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'save_student_extra_practice_question',
                test_id: this.state.test_id,
                parent_id: this.state.parent_id,
                user_id: this.state.student_id,
                question_id: this.state.question_id,
                user_answer: user_answer,
                correct_answer: this.state.data[index].correct_answer,
                is_answered: is_answered
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status == "valid") {
                    this.setState({
                        question_name: this.state.data[index - 1].question,
                        options: this.state.data[index - 1].options,
                        question_id: this.state.data[index - 1].id,
                        index: index - 1,
                        image: this.state.data[index - 1].image,
                        question_type: this.state.data[index - 1].question_type,
                        userAnswer: this.state.data[index - 1].user_answer,
                        saveLoader: false
                    }, () => {
                        fetch(baseUrl + 'user', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'content-type': 'application/x-www-form-urlencoded',
                            },
                            body: qs.stringify({
                                action: 'student_extra_practice',
                                worksheet_id: this.props.route.params.sheet_id,
                                student_id: this.state.student_id
                            })
                        }).then((response) => response.json())
                            .then((json) => {
                                if (!json.status) {
                                    this.setState({ loader: false, data: [] });
                                } else if (json.status) {
                                    this.setState({
                                        loader: false,
                                        data: json.data.questions,
                                        userAnswer: this.state.data[index - 1].user_answer
                                    });
                                }
                            })
                            .catch((error) => {
                                this.setState({ loader: false });
                                console.error(error);
                            });
                    });
                } else if (json.status == "time_exceeded") {
                    this.setState({ showAlert2: true, error_message2: 'Time exceeded.Please submit your exam', saveLoader: false });
                } else {
                    this.setState({ showAlert1: true, error_message1: 'There might be problem with server.Please try later', saveLoader: false });
                }
            })
            .catch((error) => {
                this.setState({ loader: false });
                console.error(error);
            });
    }

    finalExamSubmit = (index) => {
        this.setState({ index: index, showAlert: true, error_message: 'You want to submit exam' });
    }

    scrolltoBottom = () => {
        this.scrollView.scrollToEnd();
    }

    submitExam = (index) => {

        this.setState({ finishLoader: true })
        if (this.state.data[index].question_type == "fill_the_blanks") {
            var user_answer = JSON.stringify(this.state.userAnswer);
            var is_answered = this.state.is_answered;
        } else {
            var user_answer = this.state.data[index].user_answer
            var is_answered = this.state.data[index].is_answered
        }
        fetch(baseUrl + 'user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                action: 'test_extra_practice_finished',
                test_id: this.state.test_id,
                parent_id: this.state.parent_id,
                user_id: this.state.student_id,
                question_id: this.state.question_id,
                user_answer: user_answer,
                correct_answer: this.state.data[index].correct_answer,
                is_answered: is_answered
            })
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ finishLoader: false })
                if (!json.status) {
                    this.setState({ showAlert1: true, error_message1: json.message });
                    this.props.navigation.navigate('Home')
                } else if (json.status) {
                    this.setState({ showAlert2: false, showAlert1: false, showAlert: false }, () => {
                        this.props.navigation.navigate('ExtraPractiseReportDetails', {
                            sheet_id: this.props.route.params.sheet_id
                        })
                    })
                }
            })
            .catch((error) => {
                this.setState({ loader: false });
                console.error(error);
            });
    }

    fillBlank = (value, index) => {
        if (this.state.question_type == "fill_the_blanks") {
            let tempArr = this.state.userAnswer;
            tempArr[index].answer = value;
            this.setState({ userAnswer: tempArr, is_answered: true })
        }
    }

    render() {
        if (this.state.loader) {
            return (
                <Loader />
            )
        }
        if (this.state.finishLoader) {
            return (
                <Loader />
            )
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <AwesomeAlert
                    show={this.state.showAlert}
                    title="Are you sure?"
                    message={this.state.error_message}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    cancelButtonColor="#efa3a3"
                    showCancelButton={true}
                    showConfirmButton={true}
                    confirmButtonColor="#b7a3ef"
                    cancelText="Cancel"
                    onCancelPressed={() => {
                        this.setState({ showAlert: false });
                    }}
                    onConfirmPressed={() => { this.submitExam(this.state.index) }}
                />
                <AwesomeAlert
                    show={this.state.showAlert2}
                    title="Attention!"
                    message={this.state.error_message2}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    cancelButtonColor="#efa3a3"
                    showCancelButton={true}
                    showConfirmButton={true}
                    confirmButtonColor="#b7a3ef"
                    cancelText="Cancel"
                    onCancelPressed={() => {
                        this.setState({ showAlert2: false });
                    }}
                    onConfirmPressed={() => { this.submitExam(this.state.index) }}
                />
                <AwesomeAlert
                    show={this.state.showAlert1}
                    title="Attention!"
                    message={this.state.error_message1}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({ showAlert1: false });
                    }}
                />
                <View>
                    <Modal isVisible={this.state.modal_visible}>
                        <View style={{ padding: 15, backgroundColor: '#ffffff', borderRadius: 8 }}>
                            <TouchableWithoutFeedback onPress={() => { this.setState({ modal_visible: false }) }}>
                                <View>
                                    <View style={styles.row}>
                                        <Icon name="angle-left" type="font-awesome" color="black" size={23} onPress={() => { this.setState({ modal_visible: false }) }} />
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, marginTop: 3, marginLeft: 6 }}>Back</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <Image source={{ uri: this.state.selectedImage }} style={{ width: undefined, height: 500 }} resizeMode="contain" />
                        </View>
                    </Modal>
                </View>
                <View style={styles.backMainContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack}>
                        <Image source={require('../../../assets/back.png')} style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                    <View style={styles.descContainer}>
                        <Text style={styles.heading}>{this.props.route.params.subject_title}</Text>
                        <Text style={styles.subheading}>{this.props.route.params.test_name}</Text>
                    </View>
                </View>
                <View style={styles.topCurveImageContainer}>
                    <Image source={require('../../../assets/maths.png')} resizeMode="stretch" style={styles.topCurveImage} />
                </View>
                <View style={styles.qnsContainer}>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Image source={require('../../../assets/question.png')} style={styles.questionImage} />
                            <View style={{ marginLeft: wp('1') }}>
                                <Text style={styles.number}>{this.state.noOfQns}</Text>
                                <Text style={styles.sub}>Questions</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Image source={require('../../../assets/minutes.png')} style={styles.timeImage} />
                            <View style={{ marginLeft: wp('1') }}>
                                <Text style={styles.number}>{this.state.time}</Text>
                                <Text style={styles.sub}>Minutes</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.scrollContainer}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                            this.state.data.map((item, index) => {
                                return (
                                    <TouchableWithoutFeedback key={item.id} onPress={() => this.selectQuestion(item, index)}>
                                        <View style={this.state.question_id == item.id ? styles.qnsContainer1 : styles.qnsContiner2}>
                                            <Text style={this.state.question_id == item.id ? styles.questionNo : styles.questionNo1}>{index + 1}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <ScrollView style={{ flex: 0.8 }} showsVerticalScrollIndicator={false} ref={scrollView => this.scrollView = scrollView}>
                    <View style={styles.questionContainer}>
                        {
                            this.state.question_type == "fill_the_blanks" ? <View>
                                {
                                    this.state.image ?
                                        <TouchableWithoutFeedback onPress={() => { this.setState({ selectedImage: this.state.image, modal_visible: true }) }}>
                                            <Image source={{ uri: this.state.image }} style={{ height: 130, width: 180 }} resizeMode="contain" />
                                        </TouchableWithoutFeedback>
                                        : null
                                }
                                <View style={{ width: wp('80') }}>
                                    <View >
                                        {
                                            this.state.userAnswer.map((item, bindex) => {
                                                return (
                                                    <View>
                                                        <View style={styles.blankContainer}>
                                                            <View>
                                                                <Text>{item.title}</Text>
                                                            </View>
                                                        </View>
                                                        {
                                                            item.isInputFeild && <TextInput
                                                                style={styles.input}
                                                                onChangeText={(value) => this.fillBlank(value, bindex)}
                                                                value={item.answer}
                                                            />
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </View> : <View>
                                <Text style={styles.question}>{this.state.question_name}?</Text>
                                {
                                    this.state.image ?
                                        <TouchableWithoutFeedback onPress={() => { this.setState({ selectedImage: this.state.image, modal_visible: true }) }}>
                                            <Image source={{ uri: this.state.image }} style={{ height: 130, width: 180 }} resizeMode="contain" />
                                        </TouchableWithoutFeedback>
                                        : null
                                }
                            </View>
                        }
                        <View>
                            {
                                this.state.question_type == "multiple_choice" && this.state.options.map((item, index) => {
                                    return (
                                        <TouchableWithoutFeedback onPress={() => this.selectOption(item.value)} key={index}>
                                            <View style={item.value == this.state.userAnswer ? styles.optionContainer1 : styles.optionContainer}>
                                                <Text style={styles.option}>{item.value}) {item.option}</Text>
                                                {
                                                    item.image ?
                                                        <Image source={{ uri: item.image }} style={{ height: 130, width: 180 }} resizeMode="contain" />
                                                        : null
                                                }
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                            {
                                this.state.question_type == "numeric" && <View style={styles.row1}>
                                    <View style={styles.center}>
                                        <Text style={styles.ans}>Ans : </Text>
                                    </View>
                                    <TextInput
                                        keyboardType="number-pad"
                                        style={styles.input}
                                        onChangeText={(value) => this.selectOption(value)}
                                        value={this.state.userAnswer ? this.state.userAnswer.toString() : this.state.userAnswer}
                                    />
                                </View>
                            }

                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.row1}>
                                {
                                    this.state.index > 0 ?
                                        <TouchableWithoutFeedback onPress={() => this.selectPreviousQuestion(this.state.index)}>
                                            <View style={styles.roundContainer}>
                                                {
                                                    !this.state.saveLoader && <Icon name="angle-left" type="font-awesome" color="#ffffff" size={22} />
                                                }
                                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: '#ffffff', paddingLeft: 3, paddingTop: 3 }}> Previous</Text>
                                                {
                                                    this.state.saveLoader && <ActivityIndicator size="small" color="#fff" />
                                                }
                                            </View>
                                        </TouchableWithoutFeedback> :
                                        null
                                }
                                {
                                    this.state.index != this.state.data.length - 1 ?
                                        <TouchableWithoutFeedback onPress={() => this.selectNextQuestion(this.state.index)}>
                                            <View style={styles.roundContainer}>
                                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: '#ffffff', paddingRight: 3, paddingTop: 3 }}>Save </Text>
                                                {
                                                    this.state.saveLoader ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="angle-right" type="font-awesome" color="#ffffff" size={22} />
                                                }

                                            </View>
                                        </TouchableWithoutFeedback> : null
                                }
                                {
                                    this.state.index == this.state.data.length - 1 ?
                                        <TouchableWithoutFeedback onPress={() => this.finalExamSubmit(this.state.index)}>
                                            <View style={styles.roundContainer}>
                                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: '#ffffff', paddingRight: 3, paddingTop: 3 }}>Submit</Text>
                                                <Icon name="angle-right" type="font-awesome" color="#ffffff" size={22} />
                                            </View>
                                        </TouchableWithoutFeedback> : null
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.letterMainContainer}>
                    <TouchableWithoutFeedback onPress={this.scrolltoBottom}>
                        <View style={styles.letterContainer}>
                            <Icon name="angle-down" type="font-awesome" color="#ffffff" size={22} />
                        </View>
                    </TouchableWithoutFeedback>

                </View>
                <View style={styles.bottomCurve}>
                    <Image source={require('../../../assets/bcurve.png')} resizeMode="stretch" style={styles.bottomCurveImage} />
                    {/* <View style={styles.proceedContainer}>
                        <TouchableWithoutFeedback onPress={this.goToSubmitExam}>
                            <View style={styles.row}>
                                <Text style={styles.proceedText}>SUBMIT </Text>
                                <Icon name="angle-right" type="font-awesome"  color="#ffffff" size={25}/> 
                            </View>
                        </TouchableWithoutFeedback>
                     </View> */}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    questionImage: {
        width: 30,
        height: 43
    },
    timeImage: {
        width: 43,
        height: 43
    },
    topCurveImageContainer: {
        alignItems: 'flex-end'
    },
    bottomCurve: {
        flex: 0.2,
        justifyContent: 'flex-end',
        backgroundColor: '#ffffff'
    },
    bottomCurveImage: {
        width: wp('100'),
        height: hp('11')
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
    descContainer: {
        marginLeft: wp('4'),
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#df2238',
    },
    subheading: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
    },
    tabVContainer: {
        backgroundColor: '#ffffff',
        flex: 0.8,
        height: hp('6')
    },
    row: {
        flexDirection: 'row',
        width: wp('37')
    },
    row1: {
        flexDirection: 'row',
        width: wp('37')
    },
    qnsContainer: {
        marginLeft: wp('6'),
        marginTop: hp('1'),
        marginBottom: hp('3')
    },
    number: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18
    },
    sub: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14
    },
    proceedContainer: {
        position: 'absolute',
        right: 20,
        bottom: 22
    },
    proceedText: {
        fontFamily: 'Poppins-SemiBold',
        marginLeft: wp('12'),
        color: '#ffffff',
        fontSize: 15,
        marginTop: '1.5%'
    },
    qnsContiner2: {
        width: wp('15'),
        height: hp('5'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    qnsContainer1: {
        backgroundColor: '#b29aeb',
        width: wp('12'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    questionNo: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        color: '#ffffff'
    },
    questionNo1: {
        fontFamily: 'Roboto-Regualar',
        fontSize: 14,
        color: '#000000'
    },
    scrollContainer: {
        backgroundColor: '#f6f6f6',
        height: hp('5'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    questionContainer: {
        marginLeft: '6%',
        marginTop: '5%',
        marginRight: '6%',
    },

    question: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14
    },
    optionContainer: {
        width: '100%',
        borderWidth: 1,
        justifyContent: 'center',
        padding: '4%',
        marginTop: '3%',
        borderColor: '#d0d0d0',
        borderRadius: 6
    },
    optionContainer1: {
        width: '100%',
        borderWidth: 2,
        justifyContent: 'center',
        padding: '4%',
        marginTop: '3%',
        borderColor: '#7d3684',
        borderRadius: 6
    },
    option: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14
    },
    time: {
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        marginBottom: hp('2'),
        color: '#b4b4b4'
    },
    row1: {
        flexDirection: 'row'
    },
    roundContainer: {
        backgroundColor: '#b198eb',
        height: 40,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '5%',
        flexDirection: 'row',
        borderRadius: 8
    },
    letterMainContainer: {
        marginLeft: wp('6'),
        position: 'absolute',
        bottom: hp('5'),
        zIndex: 999999
    },
    letterContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b29aeb',
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        padding: '1%'
    },
    input: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,

        padding: 2

    },
    ans: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        marginRight: 10
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    blankContainer: {
        marginRight: 8,
        marginTop: 10
    }
})