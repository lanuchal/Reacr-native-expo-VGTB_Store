import React, { useEffect, useState, useMemo, useContext } from 'react';

import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import AppLoading from 'expo-app-loading';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Menu from './components/Menu';
import Loadpage from './components/Loadpage'
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './constants/Context';


const Stack = createNativeStackNavigator();

function MyStack({ userToken }) {

  const [page, setPage] = useState();
  // userToken === undefined ? setPage("Menu"):setPage("signIn");
  return (
    <Stack.Navigator
      initialRouteName="signIns"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#339933",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="signIn"
        component={Signin}
        options={{ title: "Signin", headerShown: false }}
      />
      <Stack.Screen
        name="signUp"
        component={Signup}
        options={{ title: "Signup", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [userId, setUserId] = useState("");

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (preState, action) => {
    switch (action.type) {
      case "RETRIVE_TOKEN":
        return {
          ...preState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...preState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...preState,
          userName: null,
          userToken: "login",
          isLoading: false,
        };
      case "HOME":
        return {
          ...preState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  const authContext = useMemo(() => ({
    signIn: async (userName, inputUserName, passWord, inputPassWord, id) => {
      console.log("username = " + userName + "/" + inputUserName);
      console.log("password = " + passWord + "/" + inputPassWord);
      // setUserToken("fgkj");
      // setIsLoading(false);
      let userToken;
      userToken = null;
      if (userName == inputUserName && passWord == inputPassWord) {
        try {
          userToken = String(id);
          console.log("login");
          await AsyncStorage.setItem("userToken", userToken);
        } catch (e) {
          console.log(e);
        }
      }
      dispatch({ type: "LOGIN", id: userName, token: userToken });
    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "LOGOUT" });
    },
    home: async () => {
      // setUserToken("fgkj");
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "HOME" });
      // setIsLoading(false);
    },
    setUserID: (input) => {
      setUserId(input);
    },
  }));

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
        setUserId(userToken);
        // console.log("userToken" + userToken);
      } catch (e) {
        console.log(e);
      }
      // setIsLoading(false);
      dispatch({ type: "RETRIVE_TOKEN", token: userToken });
    }, 500);
  }, []);

  if (loginState.isLoading) {
    return (
      <Loadpage />
    );
  }
  console.log("userToken => " + loginState.userToken);
  return (
    <AuthContext.Provider value={authContext}>
      {loginState.userToken != "login" ? (
        <Menu userId={userId} />
      ) : (
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
      )}
    </AuthContext.Provider>
  );
}

export default App;
