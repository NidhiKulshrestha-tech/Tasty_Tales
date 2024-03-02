import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
// import Btn from '../component/Btn';

export default function Home(props) {
  return (
    <View style={{flex: 1, backgroundColor: '#e36319'}}>
      <View style={{flex: 1.1, backgroundColor: '#e36319'}}>
        <View>
          <Text style={[styles.txt, {top: 40}]}>Welcome</Text>
          <Text style={[styles.txt, {top: 40}]}>To</Text>
          <Text style={[styles.txt, {top: 40}]}>Tasty-Tales</Text>
        </View>
        
      </View>
      
      <View style={styles.portion_2}>
        
        
        <View style={{display:'flex',flexDirection:'row'}}>
        <Image source={require('../Image/pizza.png')} style={{bottom:10,left:-260}}/>
        
        <TouchableOpacity
          style={[styles.touchbox,{top:'60%'}]}
          onPress={() => props.navigation.navigate('SignUp')}>
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
        <View>
        <TouchableOpacity
          style={{height:'35%',width:'50%',borderRadius:20,
          borderWidth:1,backgroundColor:'#542f1a',alignItems:'center',justifyContent:'center',marginHorizontal:'25%',top:-40}}
          onPress={() => props.navigation.navigate('Login')}>
          <Text
            style={{
              fontSize: 22,
              color: 'white',
              fontWeight: 'bold',
              textAlignVertical: 'center',
            }}>
            Login
          </Text>
        </TouchableOpacity></View>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  txt: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white'
  },
  portion_2: {
    flex: 2.5,
    backgroundColor: 'white',
    borderTopStartRadius: 80,
    borderTopEndRadius: 80,

  },
  touchbox: {
    height:'20%',
    width:'50%',
    backgroundColor:'#542f1a',
    alignItems:'center',
    borderRadius:20,
    borderWidth:1,
    justifyContent:'center',
    // marginHorizontal:'25%',
    // marginBottom:'8%'
    left:-300
    
  },
});
