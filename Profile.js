import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';

const {height} = Dimensions.get('window');

export default function Profile(props) {
  const isFocused = useIsFocused();

  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Mobile, setMobile] = useState('');
  const [Type, setType] = useState('');

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = option => {
    setSelectedOption(option);
  };


  const getapidata = async () => {
    const UID = await AsyncStorage.getItem('user_id');
    const Token=await AsyncStorage.getItem('Token');
    console.log(UID)
    // console.log(UID, 'ID111');
    // const apidata = {
    //   eventID: '1001',
    //   addInfo: {
    //     U_ID: UID,
    //   },
    // };

    try {
      const url = 'http://192.168.33.154:5140/profiledashboard';
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`,
          guid:'4C4C4544-0036-4610-804E-B2C04F575433',
          'Content-Type': 'application/json'},
        body: JSON.stringify(
          {
          eventID: '1001',
          addInfo: {
           U_ID: +UID,
            },
           } ),
      });
      const data = await result.json();
      console.log(data, 'data dashboard');

      setName(data.rData.Name);
      setEmail(data.rData.Email);
      setMobile(data.rData.Mobile);
      setType(data.rData.Type);

      console.log('function called successfully');
    } catch (error) {
      console.log(error);
      console.log('error in api calling');
    }
  };
  useEffect(() => {
    getapidata();
    // getapidata1();
  },[]);



  const EditData = async () => {
    console.log(selectedOption ,'selectedOption hheueuye')
    const ID = await AsyncStorage.getItem('user_id');
   const Token=await AsyncStorage.getItem('Token');
    // console.log(ID, 'id');
    const Data = {
      eventID: '1001',
      addInfo: {
        U_ID: +ID,
        Name: Name,
        Email: Email,
        Mobile: Mobile,
        Type:selectedOption,
        guid:'4C4C4544-0036-4610-804E-B2C04F575433'
        
      },
    };

    // console.log(Data);
    try {
      const url = 'http://192.168.33.154:5140/editprofile';
      let getresult = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${Token}`,
            guid:'4C4C4544-0036-4610-804E-B2C04F575433',
            'Content-Type': 'application/json'},
        body: JSON.stringify(Data),
      });

      const result = await getresult.json();
      console.log(result, 'result document');
      if (result.rData.rCode !== 0) throw new Error(result.rData.rMessage);

      props.navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#e36319'}}>
      <View style={{flex: 1.1, backgroundColor: '#e36319'}}>
        <View>
          <Text style={[styles.txt, {top: 60}]}>EDIT PROFILE</Text>
        </View>
      </View>
      <View style={styles.portion_2}>
        <View style={{display: 'flex', alignItems: 'center'}}>
          <Image
            source={require('../Image/profile.png')}
            style={{height: 100, width: 100, borderRadius: 50, bottom: 40}}
          />
        </View>
        <View style={{marginHorizontal:50}}>
          <Text style={{paddingLeft:10,marginBottom:5}}>Name</Text>
          <View
            style={{
              height: 50,
              width: 300,
              backgroundColor: 'grey',
              borderRadius: 10,
              marginBottom:15
              
            }}>
            <TextInput
              placeholder="Enter Your Name"
              keyboardType={'default'}
              value={Name}
              onChangeText={txt => setName(txt)}
              style={{paddingLeft:20}}
            />
          </View>
          <Text style={{paddingLeft:10,marginBottom:5}}>Email</Text>
          <View
            style={{
              height: 50,
              width: 300,
              backgroundColor: 'grey',
              borderRadius: 10,
              marginBottom:15
              
            }}>
            <TextInput
              placeholder="Enter Your Name"
              keyboardType={'default'}
              value={Email}
              onChangeText={txt => setEmail(txt)}
              style={{paddingLeft:20}}
            />
          </View>
          <Text style={{paddingLeft:10,marginBottom:5}}>Mobile</Text>
          <View
            style={{
              height: 50,
              width: 300,
              backgroundColor: 'grey',
              borderRadius: 10,
              marginBottom:15
              
            }}>
            <TextInput
              placeholder="Enter Your Mobile"
              keyboardType={'numeric'}
              value={Mobile}
              onChangeText={txt => setMobile(txt)}
              style={{paddingLeft:20}}
            />
          </View>
          <Text style={{paddingLeft:10,marginBottom:5}}>CHOICE</Text>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <CheckBox value={selectedOption === 'veg'}
                onValueChange={() => handleOptionChange('veg')}/>
                <Text style={{top: 5, fontWeight: 'bold'}}>Veg</Text>
          </View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
          <CheckBox
                value={selectedOption === 'non-veg'}
                onValueChange={() => handleOptionChange('non-veg')}
              />
              <Text style={{top: 5, fontWeight: 'bold'}}>Non-Veg</Text>
          </View>
          
        </View>
        <View style={{display:'flex',alignItems:'center'}}>
        <TouchableOpacity
          style={{height:'30%',width:'50%',backgroundColor:'#542f1a',borderRadius:20}}
          onPress={EditData}>
          <Text
            style={{
              fontSize: 22,
              color: 'white',
              fontWeight: 'bold',
              textAlignVertical: 'center',
              textAlign:'center',
              top:10
            }}>
            Save
          </Text>
        </TouchableOpacity>
        </View>
        <View style={{display:'flex',alignItems:'center'}}>
        <TouchableOpacity
          style={{height:'30%',width:'50%',backgroundColor:'#542f1a',borderRadius:20,bottom:'60%'}}
          onPress={() => props.navigation.navigate('Update')}>
          <Text
            style={{
              fontSize: 22,
              color: 'white',
              fontWeight: 'bold',
              textAlignVertical: 'center',
              textAlign:'center',
              top:10
            }}>
            Update
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  portion_2: {
    flex: 3,
    backgroundColor: 'white',
    borderTopStartRadius: 80,
    borderTopEndRadius: 80,
  },
  txt: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    borderBottomWidth: 6,
    borderColor: 'white',
    marginHorizontal: '10%',
  },
  
});
