import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
export default class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false
        }
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.questionContainer}>
                    <Text style={styles.time}>01 : 00</Text>
                    <Text style={styles.question}>A)  Line on which numbers are arranged?</Text>
                    <View style={styles.optionContainer1}>
                        <Text style={styles.option}>a.   Number Line</Text>
                    </View>
                    <View style={styles.optionContainer}>
                        <Text style={styles.option}>b.   Number Card</Text>
                    </View>
                    <View style={styles.optionContainer}>
                        <Text style={styles.option}>c.   Number System</Text>
                    </View>
                    <View style={styles.optionContainer}>
                        <Text style={styles.option}>d.   Number Grid</Text>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
        height: 15,
        borderWidth: 1,
        justifyContent: 'center',
        padding: '7%',
        marginTop: '3%',
        borderColor: '#d0d0d0',
        borderRadius: 6
    },
    optionContainer1: {
        width: '100%',
        height: 15,
        borderWidth: 1,
        justifyContent: 'center',
        padding: '7%',
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
        marginBottom: heightPercentageToDP('2'),
        color: '#b4b4b4'
    }
})