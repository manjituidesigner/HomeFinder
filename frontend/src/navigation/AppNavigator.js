// App Navigator
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import { OwnerDrawerNavigator, TenantDrawerNavigator } from './MainDrawerNavigator';
import { getAuthSession, subscribeAuthToken } from '../services/authStorage';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['rently://', 'https://rently.com', '/'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      MainOwner: {
        screens: {
          OwnerDashboard: 'owner/dashboard',
          OwnerProfile: 'owner/profile',
          OwnerProperties: 'owner/properties',
          AddProperty: 'owner/property/add',
          PropertyDetails: 'owner/property/details',
          OwnerTenants: 'owner/tenants',
          OwnerDocs: 'owner/docs',
          OwnerNotifications: 'owner/notifications',
          OwnerPayments: 'owner/payments',
          OwnerHistory: 'owner/history',
          OwnerAccounts: 'owner/accounts',
          Settings: 'owner/settings',
        },
      },
      MainTenant: {
        screens: {
          TenantDashboard: 'tenant/dashboard',
          TenantProfile: 'tenant/profile',
          TenantFavorite: 'tenant/favorite',
          TenantBid: 'tenant/bid',
          TenantDocs: 'tenant/docs',
          TenantNotifications: 'tenant/notifications',
          TenantPayments: 'tenant/payments',
          TenantHistory: 'tenant/history',
          TenantAccounts: 'tenant/accounts',
          Settings: 'tenant/settings',
        },
      },
    },
  },
};

const AppNavigator = () => {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAuthSession()
      .then(async (session) => {
        if (isMounted) {
          setToken(session.token);
          setUser(session.user);
        }
      })
      .finally(() => {
        if (isMounted) setIsReady(true);
      });

    const unsubscribe = subscribeAuthToken((t, u) => {
      if (isMounted) {
        setToken(t || null);
        setUser(u || null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {token ? (
          (user?.role === 'owner' || user?.role === 'broker') ? (
            <Stack.Screen name="MainOwner" component={OwnerDrawerNavigator} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="MainTenant" component={TenantDrawerNavigator} options={{ headerShown: false }} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;