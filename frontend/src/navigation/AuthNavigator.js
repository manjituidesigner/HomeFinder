// Auth Navigator
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OtpVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import SuccessScreen from '../screens/Auth/SuccessScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ForgotOtpVerificationScreen from '../screens/Auth/ForgotOtpVerificationScreen';
import PasswordRecoverScreen from '../screens/Auth/PasswordRecoverScreen';
import PasswordUpdatedScreen from '../screens/Auth/PasswordUpdatedScreen';
import OwnerProfileScreen from '../screens/Owner/OwnerProfileScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ForgotOtpVerification" component={ForgotOtpVerificationScreen} />
      <Stack.Screen name="PasswordRecover" component={PasswordRecoverScreen} />
      <Stack.Screen name="PasswordUpdated" component={PasswordUpdatedScreen} />
      <Stack.Screen name="OwnerProfile" component={OwnerProfileScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;