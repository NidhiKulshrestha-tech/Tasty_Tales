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

export default function Main_course({navigation, route}) {
  const [MainData, setMainData] = useState([]);
  const [mainData1, setMain1Data] = useState([]);
  const isFocused = useIsFocused();
  const {Type} = route.params;
  console.log(Type, 'Type');

  const press = () => {
    navigation.goBack();
  };
  const navigateToDetail = item => {
    // Navigate to the detail page based on the item type (veg or non-veg)
    const pagePrefix = item.Type === 'veg' ? 'Main' : 'NMain';
    const pageName = `${pagePrefix}${item.ItemId}`;
    navigation.navigate('MainCourseData', {
      items: item,
    });
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
      const maincoursefoodapidata = {
        eventID: '1001',
        maincoursefoodaddinfo: {
          ItemId: 1,
          U_ID: UID,
          Type: Type
        },
      };

      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey');

      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const maincoursefoodaddInfoString = JSON.stringify(maincoursefoodapidata.maincoursefoodaddinfo);
      console.log('maincoursefoodaddInfoString', maincoursefoodaddInfoString);

      const maincoursefoodencData = encryptAESData(maincoursefoodaddInfoString, encryptionKey);
      console.log('maincoursefoodencData', maincoursefoodencData);

      const maincoursefoodhashData = await sha256(maincoursefoodaddInfoString);
      console.log('maincoursefoodhashData', maincoursefoodhashData);

      const maincoursefoodencHash = await RSA.encrypt(maincoursefoodhashData, Publickey);
      console.log('maincoursefoodencHash', maincoursefoodencHash);


      const url = 'http://192.168.33.154:5140/maincoursefood';
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
            encData: maincoursefoodencData,
            encHashData: maincoursefoodencHash,
          },
        }),
      });
      const data = await result.json();
      console.log(data.rData.rMessage, 'Mainccccccc');
      setMainData(data.rData.rMessage);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  

  const filteredData = mainData1?.filter(item => {
    if (Type === 'veg' && item.Type === 'veg') {
      return true;
    } else if (Type === 'non-veg' && item.Type === 'non-veg') {
      return true;
    }
    return false;
  });

  const getApiMainData = async () => {

    console.log('hiiiiiiiiiiiiiiiiiiii')
    const Token = await AsyncStorage.getItem('Token');
    const UID = await AsyncStorage.getItem('user_id');
    try {

      const mainrecipeapidata = {
        eventID: '1001',
        mainrecipeaddinfo: {
          ItemId: 1,
          U_ID: UID
        },
      };

      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey');

      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const mainrecipeaddInfoString = JSON.stringify(mainrecipeapidata.mainrecipeaddinfo);
      console.log('mainrecipeaddInfoString', mainrecipeaddInfoString);

      const mainrecipeencData = encryptAESData(mainrecipeaddInfoString, encryptionKey);
      console.log('mainrecipeencData', mainrecipeencData);

      const mainrecipehashData = await sha256(mainrecipeaddInfoString);
      console.log('mainrecipehashData', mainrecipehashData);

      const mainrecipeencHash = await RSA.encrypt(mainrecipehashData, Publickey);
      console.log('mainrecipeencHash', mainrecipeencHash);


      const url = 'http://192.168.33.154:5140/recipe';
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`,
          guid: guid,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventID: '1003',
          addInfo: {
            encData: mainrecipeencData,
            encHashData: mainrecipeencHash

          },
        }),
      });
      const data = await result.json();
      console.log(data, 'getApiMainData function called successfully');
      setMain1Data(data.rData.rMessage);
    } catch (error) {
      console.log(error);
      console.log('error in api calling');
    }
  };

  // useEffect(() => {
  //   getapidata();
  // }, []);
  useEffect(() => {
    getApiMainData();
  }, []);

  return (
    <View style={{backgroundColor: '#ffddd9'}}>
      <View>
        <Heading heading_name={'Maincourse'} press={press} />
      </View>
      <ScrollView style={{marginBottom: '20%'}}>
        <FlatList
          data={filteredData}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => navigateToDetail(item)}
              key={item.ItemId} // Add a unique key for each item
            >
              <View style={styles.view_1}>
                <View>
                  <Image
                    source={{uri: `data:image/jpeg;base64,${item.ItemImage}`}}
                    style={{height: 70, width: 70}}
                  />
                </View>
                <View>
                  <Text style={styles.txt_1}>{item.ItemName}</Text>
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
  txt_1: {fontSize: 25, fontWeight: '800', paddingLeft: 20, top: 16},
});
