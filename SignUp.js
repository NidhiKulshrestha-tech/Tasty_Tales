import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import Icons from 'react-native-vector-icons/Entypo';
import {RSA} from 'react-native-rsa-native';
import CryptoJS from 'react-native-crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sha256} from 'react-native-sha256';
import CryptoComponent from '../component/CryptoComponent';



export default function SignUp(props) {
  const [toggleButton, setToggleButton] = useState(false);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Mobile, setMobile] = useState('');
  const [Password, setPassword] = useState('');
  const [Type, setType] = useState('');
  const [emailerror, setEmailerror] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const [selectedOption, setSelectedOption] = useState('');
  console.log(selectedOption, 'selectedOption');

  const handleOptionChange = option => {
    setSelectedOption(option);
  };
  const validateemail = () => {
    console.log('function called');
    const emailvalidation =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!emailvalidation.test(Email)) {
      setEmailerror('Enter valid email address');
    } else {
      setEmailerror('');
    }
  };

  const generateKey = async () => {
    try {
      const generatedkeys = await RSA.generateKeys(2048);
      const privateKey = generatedkeys.private;
      const publicKey = generatedkeys.public;

      await AsyncStorage.setItem('PrivateKey', privateKey);
      await AsyncStorage.setItem('PublicKey', publicKey);
      // await AsyncStorage.setItem('EncPrivateKey',encryptedPrivateKey);

      // console.log('Public Key', publicKey);
      // console.log('Priivate Key ', privateKey);
      // console.log('Enc Private Key',encryptedPrivateKey)
    } catch (error) {
      console.error('error in generating keys', error);
    }
  };

  const generateguid = async () => {
    const guid = DeviceInfo.getUniqueIdSync();

    console.log('guid', guid);
  };
  useEffect(() => {
    generateKey();
  }, []);

  

  const SaveData = async () => {
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
    
    // const cryptoComponent = new CryptoComponent();
    console.log('function');
    if (Name === '' || Mobile === '' || Email === '' || Password === '') {
      Alert.alert('Enter Valid details');
    } else {
      if (emailerror === '') {
        try{
        const data = {
          eventID: '1001',
          eaddInfo: {
            Name: Name,
            Email: Email,
            Mobile: Mobile,
            Password: Password,
            Type: selectedOption,
          },
        };


      const privateKey = await AsyncStorage.getItem('PrivateKey');
        console.log('privateKey', privateKey);

        const publicKey = await AsyncStorage.getItem('PublicKey');
        console.log('publicKey', publicKey);
        


        const guid = DeviceInfo.getUniqueIdSync();
        console.log(guid, 'guid');
  
        const encryptionKey = guid;
  
        const addInfoString = JSON.stringify(data.eaddInfo);
        console.log('addInfoString', addInfoString);
  
        const encData =encryptAESData(
          addInfoString,
          encryptionKey
        );
        console.log('encryptedData', encData)
  
        const hashData = await sha256(addInfoString);
        console.log('hashData', hashData);
  
        const encHashData = await RSA.encrypt(hashData, publicKey);
        console.log('encryptedHashData', encHashData);
  
        const kID =encryptAESData(
          privateKey,
          encryptionKey,
        );
        console.log('encryptedKeyData', kID);
        
        const edata = {
          eventID: '1001',
          addInfo: {
            encData: encData,
            encHashData: encHashData,
            kID: kID,
            guid: guid,
          },
        };
       
        console.log('encdataStringdataString', edata);

        
          const url = 'http://192.168.33.154:5140/registration';
          let getresult = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(edata),
          });
          const result = await getresult.json();
          console.log(result, ',hhh');

          if (result.rData.rCode == 0) {
            setName('');
            setEmail('');
            setMobile('');
            setPassword('');
            Alert.alert('User Registred Successfully');

            props.navigation.navigate('Login');
          }else{
            Alert.alert('User Already Exist');
          }
        } catch (error) {
          console.log(error);
          console.log('error in api calling');
        }
      } else {
        Alert.alert('Enter valid details');
      }
    }
  };
  
  return (
    // <ScrollView style={{height:height}}>
    <View style={styles.view_1}>
      <Image source={require('../Image/dish.jpg')} style={styles.img_1} />

      <View style={styles.view_2}>
        <Image source={require('../Image/pizza.png')} style={styles.img_2} />
        <Text style={styles.txt_1}>SignUp</Text>
        <Image source={require('../Image/border.png')} style={styles.img_3} />
        <View style={styles.view_3}>
          <Text style={{left: 10, bottom: 3, fontWeight: 'bold'}}>NAME</Text>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <TextInput
              placeholder="Ex- John Doe"
              style={styles.txt_2}
              value={Name}
              onChangeText={text => setName(text)}
            />
          </View>
          <Text style={{left: 10, bottom: 3, fontWeight: 'bold'}}>EMAIL</Text>
          <TextInput
            placeholder="Ex- johndoe@gmail.com"
            style={styles.txt_2}
            value={Email}
            onChangeText={text => setEmail(text)}
            onBlur={validateemail}
          />
          <Text style={{left: 10, bottom: 3, fontWeight: 'bold'}}>
            MOBILE NUMBER
          </Text>
          <TextInput
            placeholder="Ex- 0123456789"
            keyboardType="numeric"
            maxLength={10}
            value={Mobile}
            onChangeText={text => setMobile(text)}
            style={styles.txt_2}
          />
          <Text style={{left: 10, bottom: 3, fontWeight: 'bold'}}>
            Select your choice
          </Text>
          <View
            style={{display: 'flex', flexDirection: 'row', marginBottom: 20}}>
            <CheckBox
              value={selectedOption === 'veg'}
              onValueChange={() => handleOptionChange('veg')}
            />
            <Text style={{top: 5, fontWeight: 'bold'}}>Veg</Text>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', top: '-8%'}}>
            <CheckBox
              value={selectedOption === 'non-veg'}
              onValueChange={() => handleOptionChange('non-veg')}
            />
            <Text style={{top: 5, fontWeight: 'bold'}}>Non-Veg</Text>
          </View>
          <Text style={{left: 10, bottom: 3, fontWeight: 'bold', top: '-3%'}}>
            PASSWORD
          </Text>

          <View style={styles.view_4}>
            <Icon
              name="lock-open"
              size={25}
              color="black"
              style={{top: 10, left: 5}}
            />
            {showPassword ? (
              <Icons
                name="eye-with-line"
                size={25}
                color="black"
                style={{left: 230, top: 12}}
                onPress={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Icons
                name="eye"
                size={25}
                color="black"
                style={{left: 230, top: 12}}
                onPress={() => setShowPassword(!showPassword)}
              />
            )}

            <TextInput
              placeholder="Ex- #Pass123"
              // style={{paddingRight:5}}
              secureTextEntry={true}
              onChangeText={val => setPassword(val)}
              value={Password}
            />
          </View>
          <TouchableOpacity style={styles.touchbox} onPress={SaveData}>
            <Text
              style={{
                fontSize: 22,
                color: 'white',
                fontWeight: 'bold',
                textAlignVertical: 'center',
              }}>
              SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  view_1: {
    // flex: 1,
    backgroundColor: '#de7010',
    height: '100%',
    width: '100%',
  },
  img_1: {
    height: '20%',
    width: '40%',
    right: '-58%',
    top: 10,
  },
  img_2: {
    height: '30%',
    width: '50%',
    top: '-12%',
    left: -80,
  },
  img_3: {top: '-33%', width: '70%', left: 40},

  view_2: {
    height: '85%',
    width: '90%',
    backgroundColor: '#ffffff20',
    marginHorizontal: '5%',
    bottom: '10%',
  },
  view_3: {top: '-52%', marginHorizontal: '10%'},
  view_4: {
    height: 50,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  txt_1: {
    marginLeft: '15%',
    fontSize: 50,
    top: '-20%',
    fontWeight: 'bold',
    color: 'white',
  },
  txt_2: {
    width: 300,
    borderColor: 'white',
    backgroundColor: 'white',
    paddingLeft: 15,
    borderRadius: 10,
    marginBottom: 20,
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
    // marginBottom:'8%'
    // left:-300
  },
});

//
