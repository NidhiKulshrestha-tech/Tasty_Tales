import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Heading from '../component/Heading';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
import {sha256} from 'react-native-sha256';
import {RSA} from 'react-native-rsa-native';
import DeviceInfo from 'react-native-device-info';
// import {useIsFocused} from '@react-navigation/native';

export default function Starters({navigation, route}) {
  const [startersData, setStartersData] = useState([]);
  const [staterData, setStaterData] = useState([]);
  const isFocused = useIsFocused();
  const {Type} = route.params;
  console.log(Type, 'Type');

  const press = () => {
    navigation.goBack();
  };

  const navigateToDetail = item => {
    // Navigate to the detail page based on the item type (veg or non-veg)
    const pagePrefix = item.Type === 'veg' ? 'Page' : 'NPage';
    const pageName = `${pagePrefix}${item.ItemId}`;
    navigation.navigate('StartersData', {
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


  const getApiStarterData = async () => {
    const Token = await AsyncStorage.getItem('Token');
    const UID = await AsyncStorage.getItem('user_id');
    
    try {

      const starterapidatarecipe = {
        eventID: '1001',
        starterrecipeaddinfo: {
          U_ID: UID,
          ItemId: 1,
        },
      };

      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey');

      // console.log('staterrecipeeeeeeeeeee',Privatekey);
      // console.log('staterrecipeeeeeeeeeee', Publickey);

      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const starterrecipeaddInfoString = JSON.stringify(starterapidatarecipe.starterrecipeaddinfo);
      console.log('starterrecipeaddInfoString', starterrecipeaddInfoString);


      const starterrecipeencData = encryptAESData(starterrecipeaddInfoString, encryptionKey);
      console.log('starterrecipeencData', starterrecipeencData);

      const starterrecipiehashData = await sha256(starterrecipeaddInfoString);
      console.log('starterrecipiehashData', starterrecipiehashData);

      const starterrecipeencHash = await RSA.encrypt(starterrecipiehashData, Publickey);
      console.log('starterrecipeencHash', starterrecipeencHash);

      
      const url = 'http://192.168.33.154:5140/recipe';
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
            encData: starterrecipeencData,
            encHashData: starterrecipeencHash
          },
        }),
      });
      const data = await result.json();
      console.log(data, 'HomeData function called successfully');
      setStaterData(data.rData.rMessage);
    } catch (error) {
      console.log(error);
      console.log('error in api calling');
    }
  };

  const getapidata = async () => {
    const UID = await AsyncStorage.getItem('user_id');
    const Token = await AsyncStorage.getItem('Token');

    try {

      const starterfoodapidata = {
        eventID: '1001',
        starterfoodaddinfo: {
          U_ID: UID,
          Type: Type,
        },
      };

      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey');

      // console.log(Privatekey);
      // console.log(Publickey);
      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');


      const encryptionKey = guid;


      const starterfoodaddInfoString = JSON.stringify(starterfoodapidata.starterfoodaddinfo);
      console.log('starterfoodaddInfoString', starterfoodaddInfoString);

      const starterfoodencData = encryptAESData(starterfoodaddInfoString, encryptionKey);
      console.log('starterfoodencData', starterfoodencData);

      const starterfoodhashData = await sha256(starterfoodaddInfoString);
      console.log('starterfoodhashData', starterfoodhashData);

      const starterfoodencHash = await RSA.encrypt(starterfoodhashData, Publickey);
      console.log('starterfoodencHash', starterfoodencHash);


      const url = 'http://192.168.33.154:5140/starterfood';
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
            encData: starterfoodencData,
            encHashData: starterfoodencHash,
          },
        }),
      });
      const data = await result.json();
      // console.log(data.rData.rMessage, 'start');
      setStartersData(data.rData.rMessage);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  useEffect(() => {
    getApiStarterData();
  }, []);
  useEffect(() => {
    getapidata();
  }, []);



  const filteredData = staterData?.filter(item => {
    if (Type === 'veg' && item.Type === 'veg') {
      return true;
    } else if (Type === 'non-veg' && item.Type === 'non-veg') {
      return true;
    }
    return false;
  });
  return (
    <View style={{backgroundColor: '#ffddd9'}}>
      <View>
        <Heading heading_name={'Starters'} press={press} />
      </View>
      <ScrollView style={{marginBottom: '20%'}}>
        <FlatList
          data={filteredData}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => navigateToDetail(item)}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: 350,
                  backgroundColor: 'white',
                  marginTop: 20,
                  elevation: 2,
                  marginHorizontal: '8%',
                }}>
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
