import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from 'react-native-vector-icons/Entypo';



export default function Update(props) {
  const [oldpassword, setOldpassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showPass, setShowPass] = useState(true);

  const getapidata = async () => {
    const ID = await AsyncStorage.getItem('user_id');
    const Token=await AsyncStorage.getItem('Token');
    const apidata = {
      eventID: '1001',
      addInfo: {
        U_ID: +ID,
        Password: oldpassword,
        New_Password: newpassword,
        guid:'4C4C4544-0036-4610-804E-B2C04F575433'
      },
    };
    try {
      const url = 'http://192.168.33.154:5140/updatepass';
      const result = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${Token}`,
            guid:'4C4C4544-0036-4610-804E-B2C04F575433',
            'Content-Type': 'application/json'},
        body: JSON.stringify(apidata),
      });
      const data = await result.json();
      if (data.rData.rCode == 0) {
        setOldpassword('');
        setNewpassword('');
        Alert.alert('Password update Successfully');
      }

      console.log(data.rData.rMessage);
      console.log('function called successfully');
    } catch (error) {
      console.log(error);
      console.log('error in api calling');
    }
  };



  return (
    <View style={styles.view_1}>
      <View style={styles.view_2}>
        <View style={{top: 40}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 40,
              color: 'white',
              fontWeight: 'bold',
              borderBottomWidth: 5,
              marginHorizontal: 12,
              borderBottomColor: 'white',
            }}>
            Update Password
          </Text>
        </View>
        <View style={{
          height: 50,
          width: 300,
          backgroundColor: '#ffffff99',
          borderRadius: 10,
          marginTop: '30%',
          marginHorizontal: '8%',
          textAlignVertical: 'center',
          display:'flex',
          flexDirection:'row'
          }}>
            <Icon name='lock' size={30} color='black' style={{marginHorizontal:10,top:10}}/>
            {showPass ? (
              <Icons
                name="eye-with-line"
                size={20}
                color="black"
                style={{left: 220, top: 14}}
                onPress={() => setShowPass(!showPass)}
              />
            ) : (
              <Icons
                name="eye"
                size={20}
                color="black"
                style={{left: 220, top: 12}}
                onPress={() => setShowPass(!showPass)}
              />
            )}
          
          <TextInput
            placeholder="Old Password"
            style={{paddingLeft:2,textAlignVertical: 'center'}}
            secureTextEntry={showPassword}
            // onChangeText={text => setOldpassword(text)}
            onChangeText={(text)=>setOldpassword(text)}
          />
        </View>
        <View style={{
          height: 50,
          width: 300,
          backgroundColor: '#ffffff99',
          borderRadius: 10,
          marginTop: 25,
          marginHorizontal: '8%',
          textAlignVertical: 'center',
          display:'flex',
          flexDirection:'row'
          }}>
            {showPassword ? (
              <Icons
                name="eye-with-line"
                size={20}
                color="black"
                style={{left: 255, top: 14}}
                onPress={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Icons
                name="eye"
                size={20}
                color="black"
                style={{left: 255, top: 12}}
                onPress={() => setShowPassword(!showPassword)}
              />
            )}
            <Icon name='lock' size={30} color='black' style={{marginHorizontal:10,top:10}}/>
          <TextInput
            placeholder="New Password"
            style={{paddingLeft:2}}
            secureTextEntry={showPassword}
            // onChangeText={text => setOldpassword(text)}
            onChangeText={(text)=>setNewpassword(text)}
          />
        </View>
        <View style={{alignItems:'center'}}>
        <TouchableOpacity
            style={{
              height: '30%',
              width: '80%',
              borderRadius: 20,
              borderWidth: 1,
              backgroundColor: '#542f1a',
              borderColor:'#542f1a',
              alignItems: 'center',
              justifyContent: 'center',
            //   marginHorizontal: '25%',
              top:'30%'
            }}
            onPress={getapidata}>
            <Text
              style={{
                fontSize: 25,
                color: 'white',
                fontWeight: 'bold',
                textAlignVertical: 'center',
                textAlign:'center'
              }}>
              Update Password
            </Text>
          </TouchableOpacity>
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
    height: '88%',
    width: '85%',
    backgroundColor: '#ffffff20',
    marginHorizontal: '8%',
    marginVertical: '10%',
    borderTopStartRadius:60,
    borderTopEndRadius:60
    // top: '-25%',
  },
});
