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

export default function Sncks({navigation, route}) {

  const [snacksData, setSnacksData] = useState([]);
  const [snacksData1, setSnacksData1] = useState([]);
  const isFocused = useIsFocused();

  const press = () => {
    navigation.goBack();
  };
  const {Type} = route.params;
  console.log(Type, 'Type');

  const navigateToDetail = (item) => {
    // Navigate to the detail page based on the item type (veg or non-veg)
    const pagePrefix = item.Type === 'veg' ? 'Snk' : 'NSnk';
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

  const getapidata = async () => {
    const UID = await AsyncStorage.getItem('user_id');
    const Token = await AsyncStorage.getItem('Token');

    try {

      const snacksfoodapidata = {
        eventID: '1001',
        snacksfoodaddinfo: {
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

      const snacksfoodaddInfoString = JSON.stringify(snacksfoodapidata.snacksfoodaddinfo);
      console.log('snacksfoodaddInfoString', snacksfoodaddInfoString);

      const snacksfoodencData = encryptAESData(snacksfoodaddInfoString, encryptionKey);
      console.log('snacksfoodencData', snacksfoodencData);

      const snacksfoodhashData = await sha256(snacksfoodaddInfoString);
      console.log('snacksfoodhashData', snacksfoodhashData);

      const snacksfoodencHash = await RSA.encrypt(snacksfoodhashData, Publickey);
      console.log('snacksfoodencHash', snacksfoodencHash);

      
      const url = 'http://192.168.33.154:5140/snacksfood';
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
            encData: snacksfoodencData,
          },
        }),
      });
      const data = await result.json();
      console.log(data.rData.rMessage, 'start');
      setSnacksData(data.rData.rMessage);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };


  
 
  const getApiSnackData = async () => {
    const Token = await AsyncStorage.getItem('Token');
    const UID = await AsyncStorage.getItem('user_id');
    try {

      const snacksrecipeapidata = {
        eventID: '1001',
        snacksrecipeaddinfo: {
          U_ID: UID,
          ItemId: 1,
        },
      };

      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey');

      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const snacksrecipraddInfoString = JSON.stringify(snacksrecipeapidata.snacksrecipeaddinfo);
      console.log('snacksrecipraddInfoString', snacksrecipraddInfoString);

      const snacksrecipeencData = encryptAESData(snacksrecipraddInfoString, encryptionKey);
      console.log('snacksrecipeencData', snacksrecipeencData);

      const snacksrecipehashData = await sha256(snacksrecipraddInfoString);
      console.log('snacksrecipehashData', snacksrecipehashData);

      const snacksrecipeencHash = await RSA.encrypt(snacksrecipehashData, Publickey);
      console.log('snacksrecipeencHash', snacksrecipeencHash);


      const url = 'http://192.168.33.154:5140/recipe';
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`,
          guid: guid,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventID: '1002',
          addInfo: {
            encData: snacksrecipeencData,
            encHashData: snacksrecipeencHash
          },
        }),
      });
      const data = await result.json();
      // console.log(data, 'HomeData function called successfully');
      setSnacksData1(data.rData.rMessage);
    } catch (error) {
      console.log(error);
      console.log('error in api calling');
    }
  };
  // useEffect(() => {
  //   getapidata();
  // }, []);
  useEffect(() => {
    getApiSnackData();
  }, [isFocused]);

  
  const filteredData = snacksData1?.filter(item => {
    if (Type === 'veg' && item.Type === 'veg') {
      return true;
    } else if (Type === 'non-veg' && item.Type === 'non-veg') {
      return true;
    }
    return false;
  });
  return (
    <View style={{backgroundColor:'#ffddd9',}}>
      <View>
        <Heading heading_name={'Snackks'} press={press} />
      </View>
      <ScrollView style={{marginBottom:'20%',}}>
        <FlatList
          data={filteredData}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigateToDetail(item)}
              key={item.ItemId} // Add a unique key for each item
            >
           
              <View
                style={styles.view_1}>
                <View>
                  <Image source={{uri: `data:image/jpeg;base64,${item.ItemImage}`}} style={{height: 70, width: 70}} />
                </View>
                <View>
                  <Text
                    style={styles.txt_1}>
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
  view_1:{
    display: 'flex',
    flexDirection: 'row',
    width: 350,
    backgroundColor: 'white',
    marginTop: 20,
    elevation: 2,
    marginHorizontal: '8%',
  },
  txt_1:{fontSize: 25, fontWeight: '800', paddingLeft: 20,top:16}
})
