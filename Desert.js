import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Heading from '../component/Heading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'react-native-crypto-js'
import {sha256} from 'react-native-sha256';
import {RSA} from 'react-native-rsa-native';

export default function Desert({navigation, route}) {
  const [desertData, setDesertData] = useState([]);
  const [desertData1, setDesertData1] = useState('');
  const [snacksData1, setSnacksData1] = useState('');
  const isFocused = useIsFocused();
  const press = () => {
    navigation.goBack();
  };


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


  const getapidata = async () => {
    const UID = await AsyncStorage.getItem('user_id');
    const Token = await AsyncStorage.getItem('Token');

    try {
      const desertfoodapidata = {
        eventID: '1001',
        desertfoodaddinfo: {
          ItemId: 1,
          U_ID: UID
        },
      };

      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey');

      console.log('desertttttttttt',Privatekey);
      console.log('desertttttttttt', Publickey);

      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const desertfoodaddInfoString = JSON.stringify(desertfoodapidata.desertfoodaddinfo);
      console.log('desertfoodaddInfoString', desertfoodaddInfoString);

      const desertfoodencData = encryptAESData(desertfoodaddInfoString, encryptionKey);
      console.log('desertfoodencData', desertfoodencData);

      const desertfoodhashData = await sha256(desertfoodaddInfoString);
      console.log('desertfoodhashData', desertfoodhashData);

      const desertfoodencHash = await RSA.encrypt(desertfoodhashData, Publickey);
      console.log('desertfoodencHash', desertfoodencHash);


      const url = 'http://192.168.33.154:5140/desertfood';
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`,
          guid: guid,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventID: '1001',
          addInfo: {
            encData: desertfoodencData,
            encHashData: desertfoodencHash,
          },
        }),
      });
      const data = await result.json();
      console.log(data.rData.rMessage, 'start');
      setDesertData(data.rData.rMessage);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const getApiDesertData = async () => {
    const Token = await AsyncStorage.getItem('Token');
    const UID = await AsyncStorage.getItem('user_id');

    
    try {
      const desertrecipeapidata = {
        eventID: '1001',
        desertrecipeaddinfo: {
          U_ID: UID,
          ItemId: 1,
        },
      };

      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey');

      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const desertrecipraddInfoString = JSON.stringify(desertrecipeapidata.desertrecipeaddinfo);
      console.log('desertrecipraddInfoString', desertrecipraddInfoString);

      const desertrecipeencData = encryptAESData(desertrecipraddInfoString, encryptionKey);
      console.log('desertrecipeencData', desertrecipeencData);

      const desertrecipehashData = await sha256(desertrecipraddInfoString);
      console.log('desertrecipehashData', desertrecipehashData);

      const desertrecipeencHash = await RSA.encrypt(desertrecipehashData, Publickey);
      console.log('desertrecipeencHash', desertrecipeencHash);

      const url = 'http://192.168.33.154:5140/recipe';
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`,
          guid: guid,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventID: '1004',
          addInfo: {
            encData: desertrecipeencData,
            encHashData: desertrecipeencHash,
          },
        }),
      });
      const data = await result.json();
      // console.log(data, 'HomeData function called successfully');
      setDesertData1(data.rData.rMessage);
    } catch (error) {
      console.log(error);
      console.log('error in api calling');
    }
  };
  // useEffect(() => {
  //   getapidata();
  // }, []);
  useEffect(() => {
    getApiDesertData();
  }, []);

  return (
    <View style={{backgroundColor: '#ffddd9'}}>
      <View>
        <Heading heading_name={'Desert'} press={press} />
      </View>
      <ScrollView style={{marginBottom: '20%'}}>
        <FlatList
          data={desertData1}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DesertData', {
                  items: item,
                })
              }>
              <View style={styles.view_1}>
                <View>
                  <Image
                    source={{uri: `data:image/jpeg;base64,${item.ItemImage}`}}
                    style={{height: 70, width: 70}}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: '800',
                      paddingLeft: 20,
                      top: 16,
                    }}>
                    {item.ItemName}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  view_1: {
    display: 'flex',
    flexDirection: 'row',
    width: 350,
    backgroundColor: 'white',
    marginTop: 20,
    elevation: 2,
    marginHorizontal: '8%',
  },
});
