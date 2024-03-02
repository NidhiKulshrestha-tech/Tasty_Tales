import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {RSA} from 'react-native-rsa-native';
import DeviceInfo from 'react-native-device-info';
import Categories from '../component/Categories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import {sha256} from 'react-native-sha256';

export default function Dashboard(props) {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Mobile, setMobile] = useState('');
  const [Type, setType] = useState('');
  const [filteredVegDish, setFilteredVegDish] = useState([]);
  const [homeData, setHomeData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const isFocused = useIsFocused();

  

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
      const apidata = {
        eventID: '1001',
        eaddinfo: {
          U_ID: UID,
        },
      };
      


      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey')
      console.log(Privatekey);
      console.log(Publickey);
      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const addInfoString = JSON.stringify(apidata.eaddinfo);
      console.log('addInfoString', addInfoString);

      const encData = encryptAESData(addInfoString, encryptionKey);
      console.log('encryptedData', encData);

      const hashData = await sha256(addInfoString);
      console.log('hashData', hashData);

      const encHash = await RSA.encrypt(hashData, Publickey);
      console.log('encryptedHashDataaaaaaaa', encHash);

     

      const url = 'http://192.168.33.154:5140/profiledashboard';
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
            encData: encData,
            encHashData: encHash,
           
          },
        }),
        
      });
      // console.log('addinfo',addInfo)
      const data = await result.json();
      console.log(data, 'data dashboard');

      setName(data.rData.Name);
      setEmail(data.rData.Email);
      setMobile(data.rData.Mobile);
      setType(data.rData.Type);

      console.log('function called successfully');
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    } catch (error) {
      console.log(error);
      console.log('error in api calling');
    }
  };

  const getApiHomeData = async () => {
    // const Token = await AsyncStorage.getItem('Token');

    const Token = await AsyncStorage.getItem('Token');
    const UID = await AsyncStorage.getItem('user_id');
    // console.log('Entering getApiHomeData');
    try {
      const profapidata = {
        eventID: '1001',
        profaddinfo: {
          U_ID: UID,
          ItemId: 1,
        },
      };
      

      const Privatekey = await AsyncStorage.getItem('PrivateKey');
      const Publickey = await AsyncStorage.getItem('PublicKey');


      console.log('homeeeeeeeeeee',Privatekey);
      console.log('homeeeeeeeeeee', Publickey);


      const guid = DeviceInfo.getUniqueIdSync();
      console.log(guid, 'guid');

      const encryptionKey = guid;

      const homeaddInfoString = JSON.stringify(profapidata.profaddinfo);
      console.log('addInfoString', homeaddInfoString);

      const homeencData = encryptAESData(homeaddInfoString, encryptionKey);
      console.log('homeencryptedData', homeencData);

      const homehashData = await sha256(homeaddInfoString);
      console.log('homehashData', homehashData);

      const homeencHash = await RSA.encrypt(homehashData, Publickey);
      console.log('homeencHash', homeencHash);

    
      const url = 'http://192.168.33.154:5140/home';
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`,
          guid: '33260d51a4cf3a7b',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventID: '1001',
          addInfo: {
            encData: homeencData,
            encHashData: homeencHash
          },
        }),
      });
      // console.log('addinfo',result)
      const data = await result.json();
      console.log(data, 'HomeData dashboard');

      setHomeData(data.rData.rMessage);
      console.log('  HomeData function called successfully');
    } catch (error) {
      console.log(error);
      console.log('error in home api calling');
    }
  };

  useEffect(() => {
    getapidata();
  }, [isFocused]);
  useEffect(() => {
    getApiHomeData();
  }, []);
  

 
  // const filteredData = homeData?.filter(item => {
  //   if (Type === 'veg' && item.Type === 'veg') {
  //     return true;
  //   } else if (Type === 'non-veg' && item.Type === 'non-veg') {
  //     return true;
  //   }
  //   return false;
  // });

  const filteredData = homeData?.filter(item => {
    if (
      (Type === 'veg' || Type === 'non-veg') &&
      item.Type.toLowerCase() === Type.toLowerCase() &&
      item.ItemName.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    } else if (
      !Type ||
      (Type !== 'veg' &&
        Type !== 'non-veg' &&
        item.ItemName.toLowerCase().includes(searchText.toLowerCase()))
    ) {
      return true;
    }
    return false;
  });
  const logOut = async () => {
    const Token = await AsyncStorage.removeItem('Token');
    props.navigation.navigate('Login');
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar style="dark" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        style={{marginVertical: 6, paddingTop: 14}}>
        <View style={styles.view_1}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Profile')}>
            <Image
              source={require('../Image/profile.png')}
              style={{height: 40, width: 40}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={logOut}>
            <AntDesign name="logout" size={30} color="black" />
          </TouchableOpacity>
        </View>
        {/* Greetings and a punch line */}
        <View style={styles.view_2}>
          <Text style={styles.txt_1}>
            {/* Hello */}
            Hello,{Name}!
          </Text>
          <Text style={styles.txt_1}>{Email}</Text>
          <Text style={styles.txt_1}>{Type}</Text>
          <View>
            <Text style={styles.txt_2}>Make your own food</Text>
          </View>
          <Text style={styles.txt_2}>
            stay at <Text style={{color: '#fbbe24'}}>home</Text>
          </Text>
        </View>
        {/* Search bar */}
        <View style={styles.view_3}>
          <TextInput
            placeholderTextColor={'grey'}
            style={{flex: 1, marginBottom: 2, paddingLeft: 15}}
            placeholder="Search any Recipe"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <View>
            <Icons name="search" size={25} color="grey" style={{padding: 10}} />
          </View>
        </View>
        {/* Categories */}
        <View>
          <Categories props={props} type={Type} />
        </View>

        <FlatList
          data={filteredData}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate(`StartersData`, {
                  items: item,
                })
              }>
              <View style={styles.view_4}>
                <View>
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${item?.ItemImage}`,
                    }}
                    style={{height: 70, width: 70}}
                  />
                </View>
                <View>
                  <Text style={styles.txt_3}>{item.ItemName}</Text>
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
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  view_2: {
    marginHorizontal: 15,
    marginVertical: 5,
    marginBottom: 2,
    marginTop: 6,
  },
  view_3: {
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#bab9b690',
    padding: 6,
    marginTop: 25,
  },
  view_4: {
    display: 'flex',
    flexDirection: 'row',
    width: 350,
    backgroundColor: 'white',
    marginTop: 20,
    elevation: 2,
    marginHorizontal: '8%',
  },
  txt_1: {
    fontWeight: 'bold',
    color: 'black',
  },
  txt_2: {
    fontWeight: '900',
    fontSize: 30,
    color: 'black',
  },
  txt_3: {
    fontSize: 25,
    fontWeight: '800',
    paddingLeft: 20,
    top: 16,
  },
});
