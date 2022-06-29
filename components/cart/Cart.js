import React, { useState, useEffect, useContext } from "react";

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
var count = 0;
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var boxH = 100
var paddingT = 30
// 8
if (windowHeight <= 670) {
  boxH = 70
  paddingT = 5
}
// 8+
if (windowHeight <= 740 && windowHeight >= 669) {
  boxH = 70
  paddingT = 5
}
// 12 mini
if (windowHeight <= 815 && windowHeight >= 739) {
}
// 12
if (windowHeight <= 850 && windowHeight >= 814) {
}
if (windowHeight <= 1000 && windowHeight >= 849) {
}

var indexX = [];
const Cart = ({ route, navigation }) => {


  const { itemId } = route.params;
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [datauser, setDatauser] = useState([]);
  const [distance, setDistance] = useState([]);
  const [price, setPrice] = useState(0);
  const [countx, setCountx] = useState(0);

  const [derivery_fee, setDerivery_fee] = useState([]);
  const [derivery_state, setDerivery_state] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      itemId === null ? undefined : getData()
    });
    return unsubscribe;
  }, [navigation]);

  const getData = () => {
    indexX = [];
    axios
      .get(api + "/user/" + itemId)
      .then((result) => {
        setDerivery_fee(result.data[0].data[0].derivery_fee);
        setDerivery_state(result.data[0].data[0].derivery_state);
        setDatauser(result.data[0].data[0].user_grade);
        setDistance(result.data[0].data[0].distance);
      })
      .then(() => {
      });

    fetch(api + "/order/" + itemId)
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson.data);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const str_derivery_fee = String(derivery_fee);
  const result = str_derivery_fee.indexOf(derivery_state);
  const result2 = str_derivery_fee.substring(result);
  const sub_result2 = str_derivery_fee.indexOf(",");
  const str_2 = result2.substring(0, sub_result2);
  const sub_str2 = str_2.indexOf(":");
  const str_3 = str_2.substring(sub_str2);
  const sub_str4 = str_3.indexOf(String(`"`));
  const str_4 = str_3.substring(sub_str4 + 1);
  const sub_str5 = str_4.indexOf(String(`"`));
  const str_5 = str_4.substring(0, sub_str5);

  useEffect(() => {
    count = 0;
    for (let index = 0; index < filteredDataSource.length; index++) {
      var price_grade = 0;
      if (datauser == "D") {
        price_grade = filteredDataSource[index].price_sell_D;
      } else if (datauser == "C") {
        price_grade = filteredDataSource[index].price_sell_C;
      } else if (datauser == "B") {
        price_grade = filteredDataSource[index].price_sell_B;
      } else if (datauser == "A") {
        price_grade = filteredDataSource[index].price_sell_A;
      }

      count = count + filteredDataSource[index].pro_req_amount * price_grade;

      // console.log("asdas");
    }
    setCountx(count + Number(str_5));
  }, [filteredDataSource]);

  const oncheng = (a, b, c, d) => {
    setTimeout(() => {
      console.log(a + "/" + b + "/" + c);
      console.log("c = " + c.length);
      if (c.length != 0 && Number(c) != 0) {
        console.log("up = " + Number(c));

        var price_grade = 0;
        if (datauser == "D") {
          price_grade = filteredDataSource[d].price_sell_D;
        } else if (datauser == "C") {
          price_grade = filteredDataSource[d].price_sell_C;
        } else if (datauser == "B") {
          price_grade = filteredDataSource[d].price_sell_B;
        } else if (datauser == "A") {
          price_grade = filteredDataSource[d].price_sell_A;
        }

        inAmount(a, b, Number(c), price_grade);
      }
    }, 100);
  };
  // console.log("countx = " + countx);

  const saveOrder = (id, name) => {
    console.log(id + "/" + name);
    Alert.alert(`ยืนยัน`, `ยืนยัน order ราคาทั้งหมด ${name} บาท`, [
      {
        text: "ยกเลิก",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "ยืนยัน",
        onPress: async () => {
          console.log("submit Pressed");
          await axios.put(api + "/submitorder", {
            bill_id: id,
          });

          const newFilteredDataSource = filteredDataSource.filter(
            (filteredDataSources) => {
              return filteredDataSources.bill_id !== id;
            }
          );
          setFilteredDataSource(newFilteredDataSource);
        },
      },
    ]);
  };
  const inAmount = async (id, rid, act, o) => {
    await axios
      .put(api + "/inputamountproduct", {
        product_id: id,
        pro_req_id: rid,
        amount_custom: act,
        amount_old: act,
      })
      .then((result) => {
        console.log(result.data.result);
        if (result.data.result == "nok") {
          Alert.alert(`สินค้ามีไม่เพียงพอ`, `ไม่สามารภเพิ่มสินค้าตามจำนวนได้`, [
            {
              text: "ยืน",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ]);
        }
      });
  };
  const upAmount = async (id, rid) => {
    await axios.put(api + "/upamountproduct", {
      product_id: id,
      pro_req_id: rid,
    }).then(res => {
      console.log("pro_req_id", rid)
      console.log("productId", id)
      console.log("upAmount", res.data)
    });
  };
  const downAmount = async (id, rid, index) => {
    await axios.put(api + "/downamountproduct", {
      product_id: id,
      pro_req_id: rid,
    }).then(res => {
      console.log("pro_req_id", rid)
      console.log("productId", id)
      console.log("downAmount", res.data.result)
      if (res.data.result == "false") {

        Alert.alert(`สินค้ามีไม่เพียงพอ`, `ไม่สามารภเพิ่มสินค้าตามจำนวนได้`, [
          {
            text: "ยืน",
            onPress: () => {
              setFilteredDataSource(
                Object.values({
                  ...filteredDataSource,
                  [index]: {
                    ...filteredDataSource[index],
                    pro_req_amount:
                      parseFloat(filteredDataSource[index].pro_req_amount),
                  },
                })
              );
            },
            style: "cancel",
          },
        ]);
      }
    });;
  };

  const deleteItem = async (Input, amount, proId) => {
    console.log(Input + " = " + filteredDataSource.length + " -> length");
    console.log("amount", amount);

    Alert.alert(`ลบสินค้า`, "ยืนยันที่จะลบรายการสินค้านี้", [
      {
        text: "ยกเลิก",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "ยืนยัน",
        onPress: async () => {
          await axios
            .post(api + "/deleteoder", {
              id: Input,
              amount: Number(amount),
              product_id: proId,
            })
            .then(async () => {
              if (filteredDataSource.length == 1) {
                await axios.delete(
                  api + "/deletebill/" + filteredDataSource[0].bill_id
                );
              }
            });
          const newFilteredDataSource = filteredDataSource.filter(
            (filteredDataSources) => {
              return filteredDataSources.pro_req_id !== Input;
            }
          );
          setFilteredDataSource(newFilteredDataSource);
          // console.log(filteredDataSource.length + " -> length");
        },
      },
    ]);
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const ItemView = ({ item, index }) => {
    const orderItem = (price) => {
      return (
        <View style={styles.boxItems}>
          <ImageBackground
            source={{
              uri: noImg,
            }}
            resizeMode="cover"
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Image
              source={{
                uri: `${productImg}/${item.product_id}.jpg`,
              }}
              style={{ width: 100, height: 90 }}
            />
          </ImageBackground>
          <View
            style={{
              width: "70%",
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
                  fontSize: 16,
                }}
              >
                {item.product_name}
              </Text>
              <Icon
                name="trash"
                size={25}
                color="#b83a08"
                onPress={() => {
                  deleteItem(
                    item.pro_req_id,
                    filteredDataSource[index].pro_req_amount,
                    item.product_id
                  );
                  console.log(item.product_id);
                }}
              />
            </View>
            <Text
              style={{
                maxWidth: 230,
                fontSize: 15,
                marginLeft: 10,
                marginTop: 10,
                // marginBottom: ,
                color: "#339933",
                fontWeight: "900",
              }}
            >
              ราคา : {numberWithCommas(price)} บาท
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
                จำนวน ( {item.unit_name} )
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="minus-circle"
                  size={25}
                  color="#308d05"
                  onPress={(text) => {
                    if (filteredDataSource[index].pro_req_amount >= 0.99) {
                      console.log("up")
                      upAmount(item.product_id, item.pro_req_id);
                      setFilteredDataSource(
                        Object.values({
                          ...filteredDataSource,
                          [index]: {
                            ...filteredDataSource[index],
                            pro_req_amount:
                              parseFloat(
                                filteredDataSource[index].pro_req_amount
                              ) - 1,
                          },
                        })
                      );
                    }
                  }}
                />

                <Text style={{
                  // width: 25,
                  maxWidth: 60,
                  fontSize: 20,
                  color: "#000000",
                  textAlign: "center",
                  marginLeft: 10,
                  marginRight: 10,
                }}> {String(filteredDataSource[index].pro_req_amount)}</Text>
                <Icon
                  name="plus-circle"
                  size={25}
                  color="#308d05"
                  onPress={(text) => {
                    downAmount(item.product_id, item.pro_req_id, index);
                    setFilteredDataSource(
                      Object.values({
                        ...filteredDataSource,
                        [index]: {
                          ...filteredDataSource[index],
                          pro_req_amount:
                            parseFloat(
                              filteredDataSource[index].pro_req_amount
                            ) + 1,
                        },
                      })
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      );
    };

    if (datauser == "D") {
      return orderItem(item.price_sell_D);
    } else if (datauser == "C") {
      return orderItem(item.price_sell_C);
    } else if (datauser == "B") {
      return orderItem(item.price_sell_B);
    } else if (datauser == "A") {
      return orderItem(item.price_sell_A);
    }
  };

  const getItem = (item) => {
    // Function for click on an item
    alert("Id : " + item.id + " Title : " + item.title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxSearch}>
        <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
              marginRight: 10,
            }}
          >
            รายการสินค้าทั้งหมดในตะกล้า
          </Text>
          <Icon
            name="shopping-cart"
            size={17}
            color="#fff"
            onPress={() => {
              console.log(item.product_id);
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#fff",
              marginRight: 10,
            }}
          >
            {filteredDataSource.length}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
            }}
          >
            รายการ
          </Text>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {isLoading ? (
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: '#339933' }}>
                กรุณาเข้าสู่ระบบ
              </Text>
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
      <View style={styles.tatal}>
        <Text
          style={{
            marginLeft: 5,
            fontSize: 14,
            color: "#000",
          }}
        >
          ค่าจัดส่ง {str_5}
        </Text>
        <Text
          style={{
            marginLeft: 5,
            fontSize: 14,
            color: "#000",
          }}
        >
          รวม {numberWithCommas(countx)} บาท
        </Text>
        <Button
          icon={<Icon name="check" size={15} color="#fff" />}
          title="  ยืนยัน"
          titleStyle={{ fontSize: 14 }}
          buttonStyle={{ backgroundColor: "#32661a", paddingRight: 10 }}
          onPress={() => {
            itemId == null ?
              Alert.alert("เลือกรายการสินค้า", "กรุณาเข้าสู่ระบบเพื่อเลือกซื้อสิ้นค้า", [
                { text: "ยืนยัน", onPress: () => signOut() },
                { text: "ยกเลิก" },
              ]) :
              saveOrder(
                filteredDataSource[0].bill_id,
                numberWithCommas(countx)
              );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    height: "100%",
    flex: 1,
  },
  boxSearch: {
    minHeight: boxH,
    backgroundColor: "#339933",
    display: "flex",
    paddingTop: paddingT,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
    padding: 5,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 10,
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
    bottom: 10,
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

export default Cart;