import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginStep1 from '../../src/components/Auth/LoginStep1';
import LoginStep2 from '../components/Auth/LoginStep2';
import OtpVerification from '../../src/components/Auth/OtpVerification';
import NewUser from '../../src/components/Auth/NewUser';
import Login from '../../src/components/Auth/Login';
import ForgotPassword from '../components/Auth/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword';
import MainNavigator from '../../src/navigation/MainNavigator';
const Stack = createStackNavigator()
export default function AppStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="LoginStep1">
            <Stack.Screen name="LoginStep1" component={LoginStep1} />
            <Stack.Screen name="LoginStep2" component={LoginStep2} />
            <Stack.Screen name="OtpVerification" component={OtpVerification} />
            <Stack.Screen name="NewUser" component={NewUser} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="MainNavigator" component={MainNavigator} />
        </Stack.Navigator> 
    )  
}