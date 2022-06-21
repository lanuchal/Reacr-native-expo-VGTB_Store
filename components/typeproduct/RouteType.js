import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Type from "./Type";
import Product from "./Product";
const Stack = createNativeStackNavigator();

function MyStack({ itemId }) {


    return (
        <Stack.Navigator

            initialRouteName="Type"
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
                name="Type"
                initialParams={{ itemId: itemId }}
                component={Type}
                options={{ title: "Type", headerShown: false }}
            />
            <Stack.Screen
                name="Product"
                initialParams={{ itemId: itemId }}
                component={Product}
                options={{ title: "Product", headerShown: false }}
            />
        </Stack.Navigator>

    );
}

const RouteType = ({ route, navigation }) => {
    const { itemId } = route.params;


    return (
        <NavigationContainer independent={true}>
            <MyStack itemId={itemId} />
        </NavigationContainer>
    );
};


export default RouteType;