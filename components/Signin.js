import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  // Text,
  Alert,
} from 'react-native';
import {
  ThemeProvider,
  Button,
  Input,
  Image,
  Text,
} from 'react-native-elements';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { api } from '../constants/Api';
import { AuthContext } from '../constants/Context';
import { logoImage } from '../constants/Api';
import Loadpage from './Loadpage';

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

const Signin = ({ route, navigate, navigation }) => {
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [isLoading_log, setIsLoading_log] = useState(true);

  const { signIn, setUserID } = useContext(AuthContext);
  console.log("windowWidth", windowWidth)
  console.log("windowHeight", windowHeight)

  const createTwoButtonAlert = () =>
    Alert.alert('เกิดข้อผิดพลาด', 'กรุณากรอกข้อมูล', [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);

  const checkLogin = async () => {
    console.log('userName = ' + userName);
    console.log('passWord = ' + passWord);
    if (!userName || !passWord) {
      createTwoButtonAlert();
      console.log('errorrrrrr');
    } else {
      setIsLoading_log(false);

      console.log(api + '/login');
      await axios
        .post(api + '/login', {
          user_username: userName,
          user_password: passWord,
        })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          if (data[0].login == 'nok') {
            Alert.alert('เกิดข้อผิดพลาด', 'รหัสผ่านไม่ถูกต้อง', [
              { text: 'OK', onPress: () => setIsLoading_log(true) },
            ]);
          } else {
            console.log('userid = login ' + userid);
            const userid = data[0].data[0].user_id;
            const user = data[0].data[0].user_username;
            const pass = data[0].data[0].user_password;

            setUserID(userid);
            signIn(user, userName, pass, passWord, userid);
            // setIsLoading_log(true);
          }
        })
        .catch((error) => {
          console.log('error ' + error);
          Alert.alert('เกิดข้อผิดพลาด', 'สัญาณอินเทอร์ขัดข้อง', [
            {
              text: 'OK',
              onPress: () => {
                setIsLoading_log(true);
              },
            },
          ]);
        });
    }
  };

  if (!isLoading_log) {
    return <Loadpage />;
  }
  return (
    <ThemeProvider theme={theme}>
      <View style={styles.head}>
        <Icon name="lock" size={18} color="#fff" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
            marginLeft: 10,
            marginBottom: 5,
          }}>
          เข้าสู่ระบบ
        </Text>
      </View>
      <View style={styles.box}>
        <ScrollView style={styles.container}>
          <Image
            source={{ uri: logoImage }}
            style={{ width: imgW, height: imgH }}
            containerStyle={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 10,
            }}
          />
          <View style={styles.headVG}>
            <Text
              style={{ fontSize: fontH, fontWeight: 'bold', color: '#339933' }}>
              ผักสดเชียงใหม่{' '}
            </Text>
            <Text style={{ fontSize: fontS, fontWeight: 'bold', marginTop: 3 }}>
              CHIANGMAI FRESH VEGETABLES{' '}
            </Text>
            <Text style={{ fontSize: fontS, marginTop: 3 }}>
              แหล่งรวมผักสดราคาส่งออนไลน์ของคนเชียงใหม่{' '}
            </Text>
          </View>

          <Input
            leftIcon={<Icon name="user" size={20} color="#339933" />}
            placeholder={'Username'}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(userName) => setUserName(userName)}
          />

          <Input
            leftIcon={<Icon name="key" size={20} color="#339933" />}
            secureTextEntry={true}
            placeholder={'Password'}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(passWord) => setPassWord(passWord)}
          />
          <Button
            icon={<Icon name="sign-in" size={20} color="#fff" />}
            title="   Sign in"
            containerStyle={{ marginTop: 10 }}
            buttonStyle={{ backgroundColor: '#339933' }}
            onPress={() => checkLogin(this)}
          />
          <Button
            icon={<Icon name="user-plus" size={18} color="#fff" />}
            title="  Sign up"
            containerStyle={{ marginTop: 10 }}
            buttonStyle={{ backgroundColor: '#FF9933' }}
            onPress={() => navigation.navigate('signUp')}
          />
        </ScrollView>
      </View>
    </ThemeProvider>
  );
};

const theme = {
  Button: {
    raised: false,
  },
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    height: '90%',
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 35,
  },
  head: {
    display: 'flex',
    backgroundColor: '#339933',
    height: '15%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headVG: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
});

export default Signin;
