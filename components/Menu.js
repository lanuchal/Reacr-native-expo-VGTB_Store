import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './home/Home';
import Order from './order/Order';
import Profile from './profile/Profile';
import Cart from './cart/Cart';
import RouteType from './typeproduct/RouteType';
import RoutePr from './profile/RoutePr';

import Icon from 'react-native-vector-icons/FontAwesome';
const Tab = createBottomTabNavigator();


function MyTabs({ userid, rnd }) {


  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#339933',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ itemId: userid , name: "test" }}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="RouteType"
        component={RouteType}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: 'RouteType',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="tasks" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: 'Cart',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={Order}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: 'Order',
          // tabBarBadge: "!",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="inbox" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={RoutePr}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navbar({ route, navigation, userId }) {
  return (
    <NavigationContainer independent={true}>
      <MyTabs userid={userId} />
    </NavigationContainer>
  );
}
