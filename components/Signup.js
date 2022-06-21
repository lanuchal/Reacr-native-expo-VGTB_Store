
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  ThemeProvider,
  Button,
  Input,
  Image,
  Text,
} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { api } from "../constants/Api";
import { logoImage } from "../constants/Api"
import Loadpage from "./Loadpage";

import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
var imgH = 180;
var imgW = 180;
var fontH = 22
var fontS = 16
if (windowHeight <= 670) {
  imgH = 120;
  imgW = 120;
  fontH = 18
  fontS = 15
}


const Signup = ({ route, navigate, navigation }) => {
  const [storeName, setStoreName] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [cPassWord, setCPassWord] = useState("");
  const [address, setAddress] = useState("");

  const [isLoading_log, setIsLoading_log] = useState(true);

  const saveRegis = () => {


    if (!storeName || !userName || !passWord || !address) {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน", [
        { text: "OK", onPress: () => setIsLoading_log(true) },
      ]);
    } else {
      if (passWord != cPassWord) {
        Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกรหัสให้ตรงกัน", [
          { text: "OK", onPress: () => setIsLoading_log(true) },
        ]);
      } else {
        setIsLoading_log(false)
        axios
          .post(api + "/register", {
            name: storeName,
            user_username: userName,
            user_password: passWord,
            addr: address,
          })
          .then(function (response) {
            console.log(JSON.stringify(response.data[0].result));
            if (response.data[0].result == "nok") {
              Alert.alert("เกิดข้อผิดพลาด", "username นี้ ถูกใช้งานไปแล้ว", [
                { text: "OK", onPress: () => setIsLoading_log(true) },
              ]);
            } else {
              Alert.alert(
                "สมัครสมาชิกสำเร็จ",
                "กรุณารอยืนยันสมัครเป็นสมาชิก",
                [{
                  text: "OK", onPress: () => {
                    navigation.navigate("signIn");
                    setIsLoading_log(true);
                  }
                }],
                { cancelable: true }
              );
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }


  };

  if (!isLoading_log) {
    return <Loadpage />;
  }

  return (
    <ThemeProvider theme={theme}>
      <View style={stylesRe.head}>
        <Icon name="user-plus" size={16} color="#fff" />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff", marginLeft: 10 }}>
          สมัครสมาชิก
        </Text>
      </View>
      <View style={stylesRe.box}>
        <ScrollView style={stylesRe.container}>
          <Image
            source={{ uri: logoImage }}
            style={{ width: 70, height: 70 }}
            containerStyle={{
              marginLeft: "auto",
              marginRight: "auto"
            }}
          />
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#339933" }}>
              ผักสดเชียงใหม่{" "}
            </Text>
          </View>
          <Input
            leftIcon={<Icon name="home" size={20} color="#339933" />}
            placeholder={"shop name"}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setStoreName(input)}
          />

          <Input
            leftIcon={<Icon name="user" size={20} color="#339933" />}
            placeholder={"username"}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setUserName(input)}

          />
          <Input
            leftIcon={<Icon name="key" size={20} color="#339933" />}
            secureTextEntry={true}
            placeholder={"password"}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setPassWord(input)}
          />
          <Input
            leftIcon={<Icon name="key" size={20} color="#339933" />}
            secureTextEntry={true}
            placeholder={"confirm password"}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setCPassWord(input)}
          />
          <Text style={stylesRe.text}>
            {"  "}
            <Icon name="map-marker" size={23} color="#339933" />
            {"   "}address :
          </Text>
          <View style={stylesRe.textAreaContainer}>
            <TextInput
              leftIcon={<Icon name="key" size={20} color="#339933" />}
              style={stylesRe.textArea}
              underlineColorAndroid="transparent"
              placeholder="เลขที่ หมู่ ตำบล อำเภอ จังหวัด &#10;รหัสไปรณีย์"
              placeholderTextColor="grey"
              numberOfLines={3}
              multiline={true}
              onChangeText={(input) => setAddress(input)}
            />
          </View>
          <Button
            icon={<Icon name="check" size={20} color="#fff" />}
            containerStyle={{ marginTop: 15 }}
            title="  Confirm"
            buttonStyle={{ backgroundColor: "#339933" }}
            onPress={() => saveRegis()}
          />
          <Button
            icon={<Icon name="close" size={18} color="#fff" />}
            title="  Cancel"
            containerStyle={{ marginTop: 10, marginBottom: 10 }}
            buttonStyle={{ backgroundColor: "#CC3300" }}
            onPress={() => navigation.navigate('signIn')}
          />
          <View style={{height:40}}></View>
        </ScrollView>
      </View>
    </ThemeProvider>
  )
}

const theme = {
  Button: {
    raised: true,
  },
};

const stylesRe = StyleSheet.create({
  box: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    height: '90%',
    width: '100%'
  },
  head: {
    display: "flex",
    backgroundColor: "#339933",
    height: '15%',
    width: '100%',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 10,
    padding: 20,
  },
  text: {
    // color: "#919191",
    padding: 5,
    fontSize: 19,
  },
  textAreaContainer: {
    margin: 5,
    borderRadius: 5,
    borderColor: "#919191",
    borderWidth: 1,
    padding: 10,
  },
  textArea: {
    minHeight: 70,
    maxHeight: 70,
    fontSize: 18,
    justifyContent: "flex-start",
    textAlignVertical: "top",
  },
});

export default Signup;