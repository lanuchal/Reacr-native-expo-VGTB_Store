import React, { useState, useEffect } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import { api, noImg, logoImage, productImg } from "../../constants/Api";

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
// 8
var boxList = 90




if (windowHeight <= 670) {
  boxList = 82
}
// 8+
if (windowHeight <= 740 && windowHeight >= 669) {
}
// 12 mini
if (windowHeight <= 815 && windowHeight >= 739) {
  boxList = 82
}
// 12
if (windowHeight <= 850 && windowHeight >= 814) {
  boxList = 86
}
if (windowHeight <= 1000 && windowHeight >= 849) {
}

const Type = ({ route, navigation }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [datauser, setDatauser] = useState([]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData()
    });
    return unsubscribe;
  }, [navigation]);


  const getData = () => {
    setIsLoading(true);
    fetch(api + "/producttype")
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

  }
  // console.log(filteredDataSource);
  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.cate_name
          ? item.cate_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.boxItems}>
        <Text style={styles.itemStyle} onPress={() => getItem(item)}>
          {item.cate_name.toUpperCase()}
        </Text>
      </View>
    );
  };


  const getItem = (item) => {
    navigation.navigate("Product", {
      typeID: item.cate_id,
      typeName: item.cate_name,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.boxSearch}>
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 25,
              color: "#fff",
            }}
          >
            ประเภทสินค้า
          </Text>
        </View>
        <View>
          <Image
            source={{ uri: logoImage }}
            style={{ width: 60, height: 60 }}
            containerStyle={{ marginLeft: "auto", marginBottom: 14 }}
          />
        </View>
        <View style={styles.searchSection}>
          <Icon
            name="search"
            size={20}
            color="#a3a3a3"
            onPress={() => {
              console.log("asda");
            }}
          />
          <TextInput
            style={styles.input}
            // value={searchTpye}
            placeholder="ค้นหาสินค้า"
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={styles.container}>
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              marginBottom: 10,
              marginTop: 5,
              marginLeft: 15,
            }}
          >
            รายการสินค้า {filteredDataSource.length} รายการ
          </Text>
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
              numColumns={4}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}
              contentContainerStyle={{ padding: 2, paddingBottom: 40 }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    height: "100%"
  },
  boxSearch: {
    minHeight: 130,
    backgroundColor: "#339933",
    display: "flex",
    flexDirection: "row",
    paddingTop: 30,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingStart:30,
    paddingEnd:30,
    marginBottom: 25,
    shadowColor: "#000",
    borderBottomEndRadius: 7,
    borderBottomStartRadius: 7,
    shadowOffset: {
      width: 5,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  searchSection: {
    bottom: -20,
    left:"4%",
    borderRadius: 10,
    alignSelf: "center",
    position: "absolute",
    width: "110%",
    height: 50,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    marginLeft: 5,
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
    color: "#000",
  },
  itemStyle: {
    padding: 10,
    textAlign: "center",
    fontSize: 16,
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
    width: boxList,
    backgroundColor: "#fff",
    marginBottom: 8,
    marginStart: "2.3%",
    height: 80,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default Type;