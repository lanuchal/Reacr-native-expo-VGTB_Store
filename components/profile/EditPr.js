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
import Loadpage from "../Loadpage"
import * as Location from 'expo-location';
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
const EditPr = ({ route, navigation }) => {

  const [storeName, setStoreName] = useState("");
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [regisDate, setRegisDate] = useState("");
  const [addr_lat, setAddr_lat] = useState(" ");
  const [addr_long, setAddr_long] = useState(" ");
  const [isLoading_log, setIsLoading_log] = useState(true);


  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { itemId } = route.params;

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


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
      setStoreName(getData.data[0].name);
      setUserName(getData.data[0].user_username);
      setRegisDate(date);
      setTel(getData.data[0].user_tel == "-" ? "" : getData.data[0].user_tel);
      setAddress(getData.data[0].addr);
      setAddr_lat(getData.data[0].addr_lat);
      setAddr_long(getData.data[0].addr_long);
    });
  }
  const saveEdit = async () => {
    setIsLoading_log(false)
    if (tel.length != 10) {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกเบอร์โทรสัพท์ให้ถูกต้อง", [
        { text: "OK", onPress: () => setIsLoading_log(true) },
      ]);
    }
    else {
      await axios
        .put(api + "/updateuser", {
          id: itemId,
          name: storeName,
          addr: address,
          user_tel: tel,
          addr_lat: addr_lat,
          addr_long: addr_long,
        }).then(() => {
          navigation.navigate("Profile");
          setIsLoading_log(true)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getLocation = async () => {
    setIsLoading_log(false)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณาอนุญาติให้เข้าภึงแผนที่", [
        { text: "OK", onPress: () =>setIsLoading_log(true)},
      ]);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
 
      Alert.alert("คำนวณจุดแผนที่สำเร็จ", `${location.coords.latitude.toFixed(2)} / ${location.coords.longitude.toFixed(2)}`, [
        {
          text: "OK", onPress: () => {
            setAddr_lat(location.coords.latitude.toFixed(2))
            setAddr_long(location.coords.longitude.toFixed(2))
            setIsLoading_log(true)
          }
        },
      ]);


    console.log("getlo")
  }
  if (!isLoading_log) {
    return <Loadpage />;
  }

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
              แก้ไขข้อมูลพื้นฐาน{" "}
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
            <Icon name="home" size={23} color="#339933" />
            {"   "}ชื่อร้าน :
          </Text>
          <Input
            // leftIcon={<Icon name="home" size={20} color="#339933" />}
            placeholder={"ชื่อร้าน"}
            value={storeName}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setStoreName(input)}
          />
          <Text style={stylesPr.text}>
            {"  "}
            <Icon name="phone" size={23} color="#339933" />
            {"   "}เบอร์โทรสัพท์ :
          </Text>
          <Input
            keyboardType="numeric"
            placeholder={"เบอร์โทรสัพท์"}
            value={tel}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setTel(input)}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              position: "relative",
            }}
          >
            <Text style={stylesPr.text}>
              {"  "}
              <Icon name="map-marker" size={23} color="#339933" />
              {"   "}latitude/longitude :
            </Text>
            <Button
              icon={<Icon name="question-circle" size={18} color="#fff" />}
              title="  คำนวณที่อยู่"
              containerStyle={{
                width: 130,
                position: "absolute",
                right: 3,
                borderRadius: 10,
                padding: 0,
              }}
              buttonStyle={{
                backgroundColor: "#01b87b",
                padding: 3,
                alignItems: "center",
              }}
              onPress={() => getLocation()}
            />
          </View>
          <Input
            style={{ fontSize: 15 }}
            value={addr_lat + "/" + addr_long}
            disabled
          />
          <Text style={stylesPr.text}>
            {"  "}
            <Icon name="address-card-o" size={23} color="#339933" />
            {"   "}ที่อยู่ร้าน :
          </Text>

          <View style={stylesPr.textAreaContainer}>
            <TextInput
              leftIcon={<Icon name="key" size={20} color="#339933" />}
              style={stylesPr.textArea}
              value={address}
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
            title="  บันทึก"
            buttonStyle={{ backgroundColor: "#009966" }}
            onPress={() => {
              saveEdit();
            }}
          />
          <Button
            icon={<Icon name="close" size={18} color="#fff" />}
            title="  ยกเลิก"
            containerStyle={{ marginTop: 10, marginBottom: 10 }}
            buttonStyle={{ backgroundColor: "#CC3333" }}
            onPress={() => {
              const rndInt = randomIntFromInterval(1, 100000);
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
    height: "90%"
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
export default EditPr;