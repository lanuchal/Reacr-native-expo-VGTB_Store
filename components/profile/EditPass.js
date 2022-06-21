import React, { useState, useEffect } from "react";
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
import { api, noImg, logoImage } from "../../constants/Api";

import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;
var paddingT = 40
var fMember =16;
// 8
if (windowHeight <= 670) {
  paddingT =20
  fMember = 14
}
// 8+
if (windowHeight <= 740 && windowHeight >= 669) {
  paddingT =20
}
if (windowHeight <= 815 && windowHeight >= 739) {
  fMember = 14
}
// 12
if (windowHeight <= 850 && windowHeight >= 814) {
  fMember = 15
}

const EditPass = ({ route, navigation }) => {
  const [userName, setUserName] = useState("");
  const [regisDate, setRegisDate] = useState("");

  const [getPass, setGetPass] = useState("");
  const [oldPss, setOldPss] = useState("");
  const [newPass, setNewPass] = useState("");
  const [ccPass, setCcPass] = useState("");

  const { itemId } = route.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData()
    });
    return unsubscribe;
  }, [navigation]);

  const getData = () => {
    axios.get(api + "/user/" + itemId).then((result) => {
      const getData = result.data[0];
      const all = String(getData.data[0].date_register.split("T", 1));
      const sall = all.split("-");
      const y = String(sall[0]);
      const m = String(sall[1]);
      const d = String(sall[2]);
      const date = d + "/" + m + "/" + y;

      console.log();
      setUserName(getData.data[0].user_username);
      setRegisDate(date);
      setGetPass(getData.data[0].user_password);
    });

  }
  const saveEditPass = async () => {
    if (getPass != oldPss) {
      Alert.alert("แก้ไขรหัสผ่าน", "กรุณากรอกรหัสผ่านเดิมฬห้ถูกต้อง", [
        { text: "OK" },
      ]);
    } else if (newPass != ccPass) {
      Alert.alert("แก้ไขรหัสผ่าน", "กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน", [
        { text: "OK" },
      ]);
    } else {
      await axios
        .put(api + "/updatepass", {
          id: itemId,
          old_password: oldPss,
          new_password: newPass,
        })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          const changedRow = data.data.changedRows;
          if (changedRow != 0) {
            Alert.alert("แก้ไขรหัสผ่าน", "แก้ไขรหัสผ่านสำเร็จ", [
              { text: "OK", onPress: () => navigation.navigate("Profile") },
            ]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <ScrollView style={stylesPr.container}>
        <View style={stylesPr.boxProfile}>
          <Image
            source={{ uri: logoImage }}
            style={{ width: 100, height: 100 }}
            containerStyle={{ marginLeft: 20 }}
          />
          <View style={stylesPr.titleProfile}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 5,
                color: "#339933",
              }}
            >
              {" "}
              แก้ไขรหัสผ่าน{" "}
            </Text>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              {" "}
              usename : {userName}{" "}
            </Text>
            <Text
              style={{
                fontSize: fMember,
                marginBottom: 5,
              }}
            >
              {" "}
              วันที่สมัครสมาชิก : {regisDate}{" "}
            </Text>
          </View>
        </View>

        <View style={stylesPr.boxTitle}>
          <Text style={stylesPr.text}>
            {"  "}
            <Icon name="lock" size={23} color="#339933" />
            {"   "}รหัสผ่านเดิม :
          </Text>
          <Input
            secureTextEntry={true}
            placeholder={"old password"}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setOldPss(input)}
          />
          <Text style={stylesPr.text}>
            {"  "}
            <Icon name="unlock" size={23} color="#339933" />
            {"   "}รหัสผ่านใหม่ :
          </Text>
          <Input
            secureTextEntry={true}
            placeholder={"new password"}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setNewPass(input)}
          />
          <Text style={stylesPr.text}>
            {"  "}
            <Icon name="unlock" size={23} color="#339933" />
            {"   "}ยืนยันรหัสผ่านใหม่ :
          </Text>
          <Input
            secureTextEntry={true}
            placeholder={"confirm new password"}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setCcPass(input)}
          />
          <Button
            icon={<Icon name="check" size={20} color="#fff" />}
            containerStyle={{ marginTop: 15 }}
            title="  บันทึก"
            buttonStyle={{ backgroundColor: "#009966" }}
            onPress={() => {
              saveEditPass();
            }}
          />
          <Button
            icon={<Icon name="close" size={18} color="#fff" />}
            title="  ยกเลิก"
            containerStyle={{ marginTop: 10, marginBottom: 10 }}
            buttonStyle={{ backgroundColor: "#CC3333" }}
            onPress={() => {
              navigation.navigate("Profile");
            }}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </ThemeProvider>
  );
};

const theme = {
  Button: {
    raised: true,
  },
};

const stylesPr = StyleSheet.create({
  container: {
    flex: 10,
    padding: 10,
  },
  boxProfile: {
    display: "flex",
    padding: 15,
    paddingTop: paddingT,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  boxTitle: {
    display: "flex",
    padding: 15,
    backgroundColor: "#fff",
  },
  dataTitle: {
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    paddingTop: 10,
    display: "flex",
    flexDirection: "row",
    borderBottomColor: "#1ab16a",
    borderBottomWidth: 1,
  },
  titleProfile: {
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    height:"90%"
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
  text: {
    // color: "#919191",
    padding: 5,
    fontSize: 19,
  },
});
export default EditPass;