
import React, { useState, useContext } from "react";
import { View, Text,ActivityIndicator } from "react-native";

const Loadpage = ()=>{
  return(
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 10, color: '#339933' }}>
          loading
        </Text>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
  )
}
export default Loadpage;