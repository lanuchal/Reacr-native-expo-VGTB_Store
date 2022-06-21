import React, { useState, useEffect } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";
import { api, noImg, logoImage, productImg } from "../../constants/Api";
import axios from "axios";
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var boxH = 100
var paddingT = 30
// 8
if (windowHeight <= 670) {
  boxH = 70
  paddingT =10
}
// 8+
if (windowHeight <= 740 && windowHeight >= 669) {
  boxH = 70
  paddingT =10
}
// 12 mini
if (windowHeight <= 815 && windowHeight >= 739) {
}
// 12
if (windowHeight <= 850 && windowHeight >= 814) {
}
if (windowHeight <= 1000 && windowHeight >= 849) {
}

const Order = ({ route, navigation }) => {
  const { itemId } = route.params;
  const { randomX } = route.params;
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [datauser, setDatauser] = useState([]);
  const [distance, setDistance] = useState([]);



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData()
    });
    return unsubscribe;
  }, [navigation]);


  const getData = () => {
    fetch(api + "/historyorder/" + itemId)
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
      })
      .then(() => {
        setIsLoading(false);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => { });
  }

  const ItemView = ({ item, index }) => {
    const dateNew = String(item.bill_ref_code);
    const year = Number(dateNew.slice(0, 4)) + 543;
    const mont = dateNew.slice(4, 6);
    const date = dateNew.slice(6, 8);
    const time =
      dateNew.slice(8, 10) +
      ":" +
      dateNew.slice(10, 12) +
      ":" +
      dateNew.slice(12, 14);
    const time_bill = date + "/" + mont + "/" + year + " " + time;
    var textStatejop;
    var colorStatejop;
    var iconStatejop;

    if (item.bill_status == 5) {
      textStatejop = "รอดำเดินการ";
      colorStatejop = "#e96c24";
      iconStatejop = "circle";
    } else if (item.bill_status == 3) {
      textStatejop = "กำลังรวบรวมสินค้า";
      colorStatejop = "#d94fe6";
      iconStatejop = "circle";
    } else if (item.bill_status == 4) {
      textStatejop = "กำลังจัดส่ง";
      colorStatejop = "#1eb4be";
      iconStatejop = "circle";
    } else if (item.bill_status == 2) {
      textStatejop = "จัดส่งแล้ว";
      colorStatejop = "#05a75b";
      iconStatejop = "check";
    }
    return (
      <View style={styles.boxItems}>
        <Image
          source={{
            uri: logoImage,
          }}
          style={{ width: 60, height: 60, marginLeft: 5 }}
        />
        <View
          style={{
            width: "80%",
            justifyContent: "space-around",
            position: "relative",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: 10,
              paddingRight: 5,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                maxWidth: 230,
                fontSize: 14,
              }}
            >
              วันที่ {time_bill}
            </Text>
          </View>
          <Text
            style={{
              maxWidth: 230,
              fontSize: 14,
              margin: 10,
              fontWeight: "900",
            }}
          >
          </Text>
          <View
            style={{ display: "flex", flexDirection: "row", marginLeft: 10 }}
          >
            <Text
              style={{
                maxWidth: 230,
                fontSize: 14,
                color: "#000000",
                marginRight: 15,
                flexGrow: 1,
              }}
            >
              {/* {numberWithCommas(rowSet[index].tatal)} บาท */}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: colorStatejop }}>
                <Icon name={iconStatejop} size={12} color={colorStatejop} />{" "}
                {textStatejop}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
        <View style={styles.boxSearch}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              name="inbox"
              size={20}
              color="#fff"
            />
            <Text
              style={{
                fontSize: 20,
                color: "#fff",
                marginLeft: 10,
              }}
            >
              ออเดอร์ 10 รายการล่าสุด
            </Text>
          </View>
        </View>
      <SafeAreaView style={{ flex: 1 }}>
      
        <View style={styles.container}>
          {isLoading ? (
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          ) : (
            <FlatList
              data={filteredDataSource}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}
              contentContainerStyle={{
                padding: 2,
                paddingBottom: 170,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minHeight: "100%",
  },
  boxSearch: {
    minHeight: boxH,
    backgroundColor: "#339933",
    display: "flex",
    paddingTop: paddingT,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },

  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF",
  },
  boxItems: {
    alignItems: "center",
    padding: 5,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    minHeight: 100,
    maxHeight: 100,
    marginLeft: "auto",
    marginRight: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  tatal: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    height: 60,
    width: "98%",
    bottom: 78,
    backgroundColor: "#d4e7cb",
    marginLeft: 5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    marginRight: 5,
    shadowColor: "#000",
    justifyContent: "space-between",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    padding: 5,
    paddingRight: 10,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default Order;