import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import validator from 'validator';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {RSA} from 'react-native-rsa-native';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'react-native-crypto-js';
import Icons from 'react-native-vector-icons/Entypo';
import {sha256} from 'react-native-sha256';

export default function Login(props) {
  const [Email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [Password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const generateKey = async () => {
    try {
      const generatedkeys = await RSA.generateKeys(2048);
      const privateKey = generatedkeys.private;
      const publicKey = generatedkeys.public;

      await AsyncStorage.setItem('PrivateKey', privateKey);
      await AsyncStorage.setItem('PublicKey', publicKey);
    } catch (error) {
      console.error('error in generating keys', error);
    }
  };
  useEffect(() => {
    generateKey();
  }, []);

  const emailValidator = async () => {
    const encryptAESData = (addInfoString, encryptionKey) => {
      const options = {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: CryptoJS.enc.Utf8.parse(encryptionKey.substring(0, 16)),
      };
      const encryptedData = CryptoJS.AES.encrypt(
        encryptionKey.substring(0, 16) + addInfoString,
        CryptoJS.enc.Utf8.parse(encryptionKey),
        options,
      ).toString();
      return encryptedData;
    };

    if (Email == '' || Password == '') {
      Alert.alert('Please fill both the fields');
    } else {
      try {

      const eapidata = {
        eventID: '1001',
        eaddInfo: {
          UserId: Email,
          Password: Password,
          // guid: '4C4C4544-0036-4610-804E-B2C04F575433',
          guid: guid
          
        },
      };

      const privateKey = await AsyncStorage.getItem('PrivateKey');
      console.log('privateKey', privateKey);

      const publicKey = await AsyncStorage.getItem('PublicKey');
      console.log('publicKey', publicKey);

      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const eaddInfoString = JSON.stringify(eapidata.eaddInfo);

      const encData = encryptAESData(eaddInfoString, encryptionKey);

      const hashData = await sha256(eaddInfoString);
      console.log('hashData', hashData);

      const encHash = await RSA.encrypt(hashData, publicKey);
      console.log('encryptedHashData', encHash);

      const kID = encryptAESData(privateKey, encryptionKey);
      console.log('KID', kID);

      const apidata ={
        eventID: '1001',
        addInfo: {
          encData: encData,
            encHashData: encHash,
            kID: kID,
            guid: encryptionKey,
        },
      };

      console.log('encdataStringdataString', apidata);

      
        const url = 'http://192.168.33.154:5140/login';
        const result = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(apidata),
        });
        const data = await result.json();
        console.log( 'data login',data,);
        if (data.rData.rCode == 0) {
          console.log(data);
          props.navigation.navigate('Dashboard');
        } else {
          Alert.alert('User not Found');
        }

        await AsyncStorage.setItem('user_id', data.rData.U_ID.toString());
        await AsyncStorage.setItem('Token', data.rData.Token);
        console.log(Token);
      } catch (error) {
        console.error('error in api callllllllllling', error);
      }
    }
    console.log(Password);
    setEmail('');
    setPassword('');
  };
  const openemail = text => {
    if (!text) {
      setError('Email is required.');
    }
    if (validator.isEmail(text)) {
      setError('');
    } else {
      setError('Please enter a valid email address.');
    }
    setEmail(text);
    console.log(text);
  };

  return (
    <View style={styles.view_1}>
      <Image source={require('../Image/dish.jpg')} style={styles.img_1} />
      <View style={styles.view_2}>
        <Image source={require('../Image/pizza.png')} style={styles.img_2} />
        <Text style={styles.txt_1}>Login..</Text>
        <Image source={require('../Image/border.png')} style={styles.img_3} />

        <View style={styles.view_3}>
          <Text
            style={{
              left: 10,
              bottom: 3,
              fontWeight: 'bold',
            }}>
            Username
          </Text>
          {/* <TextInput
            placeholder="Ex- abc123@gmail.com"
            style={styles.txt_2}
            value={Email}
            onChangeText={openemail}
          /> */}
          <View style={styles.view_4}>
            <Icon
              name="person"
              size={25}
              color="black"
              style={{top: 10, left: 5}}
            />
            <TextInput
              placeholder="Ex- abc123@gmail.com"
              style={{paddingLeft: 10}}
              value={Email}
              onChangeText={openemail}
            />
          </View>
          <Text style={{left: 10, bottom: 3, fontWeight: 'bold'}}>
            Password
          </Text>
          {/* <TextInput
            placeholder="Ex- #Pass123"
            style={styles.txt_2}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
            value={Password}
          /> */}
          <View style={styles.view_4}>
            <Icon
              name="lock-open"
              size={25}
              color="black"
              style={{top: 14, left: 5}}
            />
            {showPassword ? (
              <Icons
                name="eye-with-line"
                size={20}
                color="black"
                style={{left: 200, top: 14}}
                onPress={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Icons
                name="eye"
                size={20}
                color="black"
                style={{left: 200, top: 12}}
                onPress={() => setShowPassword(!showPassword)}
              />
            )}

            <TextInput
              placeholder="Ex- #Pass123"
              // style={{paddingLeft:10}}
              value={Password}
              secureTextEntry={showPassword}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <TouchableOpacity
            style={[styles.touchbox, {height: '20%', width: '70%', right: 10}]}
            // onPress={() => props.navigation.navigate('Dashboard')}>
            onPress={emailValidator}>
            <Text
              style={{
                fontSize: 22,
                color: 'white',
                fontWeight: 'bold',
                textAlignVertical: 'center',
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <View style={styles.view_5}>
            <Text style={{color: 'black'}}>Create an Account.</Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('SignUp')}>
              <Text style={{color: 'white', fontWeight: 'bold'}}> SignUp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  view_1: {
    flex: 1,
    backgroundColor: '#de7010',
    height: '100%',
    width: '100%',
  },
  view_2: {
    height: '70%',
    width: '80%',
    backgroundColor: '#ffffff20',
    marginHorizontal: '10%',
    marginVertical: '30%',
    top: '-25%',
  },
  view_3: {
    top: '-58%',
    marginHorizontal: '10%',
  },
  view_4: {
    height: 50,
    width: 270,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  view_5: {
    display: 'flex',
    flexDirection: 'row',
    top: 60,
    left: 55,
  },

  img_1: {
    height: '24%',
    width: '48%',
    right: '-55%',
    // top: 10,
  },
  img_2: {
    height: '40%',
    width: '75%',
    top: '-20%',
    left: '-45%',
  },
  txt_1: {
    marginLeft: '8%',
    fontSize: 50,
    top: '-28%',
    fontWeight: 'bold',
    color: 'white',
  },
  img_3: {top: '-44%', width: '65%', left: 35, marginBottom: 10},
  txt_2: {
    width: 270,
    borderColor: 'white',
    backgroundColor: 'white',
    paddingLeft: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  touchbox: {
    height: '12%',
    width: '60%',
    backgroundColor: '#542f1a',
    borderColor: '#542f1a',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    marginHorizontal: '20%',
    marginTop: '10%',
    // marginBottom:'8%'
    // left:-300
  },
});
