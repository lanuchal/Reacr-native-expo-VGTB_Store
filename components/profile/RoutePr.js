import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditPr from "./EditPr";
import Profile from "./Profile";
import EditPass from "./EditPass";

const Stack = createNativeStackNavigator();

function MyStack({ itemId }) {


  return (
    <Stack.Navigator

      initialRouteName="Profile"
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
        name="Profile"
        initialParams={{ itemId: itemId }}
        component={Profile}
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen
        name="EditPr"
        initialParams={{ itemId: itemId }}
        component={EditPr}
        options={{ title: "แก้ไขข้อมูลพื้นฐาน", headerShown: false }}
      />
      <Stack.Screen
        name="EditPass"
        initialParams={{ itemId: itemId }}
        component={EditPass}
        options={{ title: "EditPass", headerShown: false }}
      />

    </Stack.Navigator>
  );
}

const RoutePr = ({ route, navigation }) => {
  const { itemId } = route.params;


  return (
    <NavigationContainer independent={true}>
      <MyStack itemId={itemId} />
    </NavigationContainer>
  );
};


export default RoutePr;