import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect} from 'react';


export default function Splash(props) {
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      console.log('HEllo');
      props.navigation.navigate('Home');
    }, 2000);
    return () => clearTimeout(redirectTimeout);
  }, [props.nevigation]);
  return (
    <View style={styles.bg}>
      <View style={styles.ring}>
        <View>
          <Image source={require('../Image/plate.png')} />
        </View>
      </View>
      <View>
        <Text style={styles.txt}>Tasty-Tales</Text>
        <Image source={require('../Image/yumm.png')} style={styles.emoji} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#de7010',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    borderRadius: 200,
    backgroundColor: '#ffffff99',
    borderWidth: 1,
    borderColor: '#ffffff99',
    padding: 9,
  },
  ring: {
    borderRadius: 400,
    backgroundColor: '#ffffff90',
    borderWidth: 50,
    borderColor: '#ffffff60',
    padding: 11,
  },
  img: {
    height: 20,
    width: 200,
  },
  txt: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    top: 70,
  },
  emoji: {
    height: 60,
    width: 60,
    top: 70,
    marginHorizontal: 100,
  },
});
