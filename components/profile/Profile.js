import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../constants/Context";

import * as ImagePicker from 'expo-image-picker';

import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;
var paddingT = 40
var fMember = 16;
// 8
if (windowHeight <= 670) {
  paddingT = 20
  fMember = 14
}
// 8+
if (windowHeight <= 740 && windowHeight >= 669) {
  paddingT = 20
}
if (windowHeight <= 815 && windowHeight >= 739) {
  fMember = 14
}
// 12
if (windowHeight <= 850 && windowHeight >= 814) {
  fMember = 15
}


const Profile = ({ route, navigation }) => {
  const noData = "ยังไม่มีข้อมูล"
  const [storeName, setStoreName] = useState(noData);
  const [userName, setUserName] = useState(noData);
  const [address, setAddress] = useState(noData);
  const [tel, setTel] = useState(noData);
  const [regisDate, setRegisDate] = useState(noData);
  const [distance, setDistance] = useState(noData);
  const [img1, setImg1] = useState(String(noImg));
  const [img2, setImg2] = useState(String(noImg));


  const { itemId } = route.params;
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("get new data for profile")
      itemId === null ? undefined : reqData()

    });
    return unsubscribe;
  }, [navigation]);

  const reqData = async () => {
    await axios.get(api + "/user/" + itemId).then((result) => {
      const getData = result.data[0];
      const all = String(getData.data[0].date_register.split("T", 1));
      const sall = all.split("-");
      const y = String(sall[0]);
      const m = String(sall[1]);
      const d = String(sall[2]);
      const date = d + "/" + m + "/" + y;
      const checkTel = getData.data[0].user_tel;
      setStoreName(getData.data[0].name);
      setUserName(getData.data[0].user_username);
      setRegisDate(date);
      setTel(
        checkTel == "-" || checkTel == " "
          ? "ยังไม่ได้กรอกเบอร์โทรศัพท์"
          : getData.data[0].user_tel
      );
      setAddress(getData.data[0].addr);

      // setLat(getData.data[0].addr_lat);
      // setLong(getData.data[0].addr_long);

      setDistance(getData.data[0].distance);

      setImg1(
        getData.data[0].user_img1 == " " || getData.data[0].user_img1 == null
          ? String(noImg)
          : String(getData.data[0].user_img1)
      );
      setImg2(
        getData.data[0].user_img2 == " " || getData.data[0].user_img2 == null
          ? String(noImg)
          : String(getData.data[0].user_img2)
      );
    });
  }

  const pickImage = async (part, file) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      console.log(result.uri);
      imageUpload(result.uri, part, file);
    }

  };
  const openCamera = async (part, file) => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.cancelled) {
      console.log(result.uri);
      imageUpload(result.uri, part, file);
    }
  }

  const selectMedia = (part, file) => {
    Alert.alert("เลือกรูปร้าน", "เลือกรูปถ่ายหน้าร้าน", [
      { text: "กล้อง", onPress: () => openCamera(part, file) },
      { text: "คลังรูปภาพ", onPress: () => pickImage(part, file) },
      { text: "ยกเลิก", onPress: () => { } },
    ]);
  }

  const imageUpload = async (imagePath, part, file) => {
    const imageData = new FormData();
    imageData.append("id", itemId);
    imageData.append(file, {
      uri: imagePath,
      name: "image.png",
      fileName: "image",
      type: "image/png",
    });
    console.log("form data", imageData);

    await axios({
      method: "post",
      url: api + "/" + part,
      data: imageData,
    })
      .then(async (response) => {
        console.log(response)
        setTimeout(() => {
          reqData()
        }, 200);
      })
      .then((error) => {
        console.log("error riased", error);
      });
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
              Profile{" "}
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
          <Text
            style={{
              marginRight: "auto",
              fontSize: 15,
              marginBottom: 5,
              fontWeight: "400",
              alignItems: "flex-start",
            }}
          >
            {" "}
            ข้อมูลพื้นฐาน
          </Text>
          <View style={stylesPr.dataTitle}>
            <Icon name="building" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              ชื่อร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {storeName}
            </Text>
          </View>
          <View style={stylesPr.dataTitle}>
            <Icon name="phone" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              เบอร์โทรศัพท์
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {tel}
            </Text>
          </View>
          <View style={stylesPr.dataTitle}>
            <Icon name="map-marker" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              ที่อยู่ร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
                width: 220,
                textAlign: "right",
              }}
            >
              {address}
            </Text>
          </View>
          <View style={stylesPr.dataTitle}>
            <Icon name="road" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              ระยะทางห่างจากร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
                width: 220,
                textAlign: "right",
              }}
            >
              {distance}
            </Text>
          </View>
          <Button
            icon={<Icon name="pencil-square-o" size={18} color="#fff" />}
            title="  แก้ไขข้อมูลพื้นฐาน"
            containerStyle={{
              width: "100%",
              marginTop: 10,
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#1ab16a", fontSize: 10 }}
            onPress={() => {
              console.log("edit");
              itemId === null ?
                Alert.alert("เลือกรายการสินค้า", "กรุณาเข้าสู่ระบบเพื่อเลือกซื้อสิ้นค้า", [
                  { text: "ยืนยัน", onPress: () => signOut() },
                  { text: "ยกเลิก" },
                ]) :
                navigation.navigate("EditPr");
            }}
          />
          <Button
            icon={<Icon name="pencil-square-o" size={18} color="#fff" />}
            title="  แก้ไขรหัสผ่าน"
            containerStyle={{
              width: "100%",
              marginTop: 10,
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#ca6009", fontSize: 10 }}
            onPress={() => {
              console.log("EditPass");
              itemId === null ?
                Alert.alert("เลือกรายการสินค้า", "กรุณาเข้าสู่ระบบเพื่อเลือกซื้อสิ้นค้า", [
                  { text: "ยืนยัน", onPress: () => signOut() },
                  { text: "ยกเลิก" },
                ]) :
                navigation.navigate("EditPass")
            }}
          />
        </View>
        <View style={stylesPr.boxTitle}>
          <View style={stylesPr.dataTitle}>
            <Icon name="picture-o" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              รูปที่อยู่ร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
                width: 220,
                textAlign: "right",
              }}
            >
              รูปที่ 1
            </Text>
          </View>
          <View style={{ alignItems: "center", margin: 10 }}>
            <Image source={{ uri: img1 }} style={{ width: 300, height: 250 }} />
          </View>
          <Button
            icon={<Icon name="pencil-square-o" size={18} color="#fff" />}
            title="  แก้ไขรูปที่อยู่ร้าน 1"
            containerStyle={{
              width: "100%",
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#967f00", fontSize: 10 }}
            onPress={() => {
              console.log("edit");
              itemId === null ?
                Alert.alert("เลือกรายการสินค้า", "กรุณาเข้าสู่ระบบเพื่อเลือกซื้อสิ้นค้า", [
                  { text: "ยืนยัน", onPress: () => signOut() },
                  { text: "ยกเลิก" },
                ]) :
                selectMedia("upload1", "profile1")
            }}
          />
        </View>
        <View style={stylesPr.boxTitle}>
          <View style={stylesPr.dataTitle}>
            <Icon name="picture-o" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              รูปที่อยู่ร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
                width: 220,
                textAlign: "right",
              }}
            >
              รูปที่ 2
            </Text>
          </View>
          <View style={{ alignItems: "center", margin: 10 }}>
            <Image source={{ uri: img2 }} style={{ width: 300, height: 250 }} />
          </View>
          <Button
            icon={<Icon name="pencil-square-o" size={18} color="#fff" />}
            title="  แก้ไขรูปที่อยู่ร้าน 2"
            containerStyle={{
              width: "100%",
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#967f00", fontSize: 10 }}
            onPress={() => {
              console.log("edit");
              itemId === null ?
                Alert.alert("เลือกรายการสินค้า", "กรุณาเข้าสู่ระบบเพื่อเลือกซื้อสิ้นค้า", [
                  { text: "ยืนยัน", onPress: () => signOut() },
                  { text: "ยกเลิก" },
                ]) :
                selectMedia("upload2", "profile2")
            }}
          />
        </View>

        <View style={stylesPr.boxTitle}>
          <Button
            icon={<Icon name={itemId == null ? "sign-in" : "sign-out"} size={18} color="#fff" />}
            title={itemId === null ? " เข้าสู่ระบบ" : "  ออกจากระบบ"}
            containerStyle={{
              width: "100%",
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: itemId === null ? "#339933" : "#585858", fontSize: 10 }}
            onPress={() => {
              itemId === null ? signOut() :
                Alert.alert("ออกจากระบบ", "ยืนยันออกจากระบบ", [
                  { text: "ยืนยัน", onPress: () => signOut() },
                  { text: "ยกเลิก" },
                ]);
              console.log("logout");
            }}
          />
        </View>
        <View style={{ height: 20 }}></View>
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
    marginBottom: 5,
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
export default Profile;