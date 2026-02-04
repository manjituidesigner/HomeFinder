// App Navigator
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import MainDrawerNavigator from './MainDrawerNavigator';
import { getAuthToken, subscribeAuthToken } from '../services/authStorage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAuthToken()
      .then((t) => {
        if (isMounted) setToken(t);
      })
      .finally(() => {
        if (isMounted) setIsReady(true);
      });

    const unsubscribe = subscribeAuthToken((t) => setToken(t || null));
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <Stack.Screen name="Main" component={MainDrawerNavigator} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;