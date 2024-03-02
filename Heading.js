import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Heading({heading_name, press}) {
  return (
    <View>
        <TouchableOpacity onPress={press} style={styles.iconbox}><Icon name="angle-left"
            size={30}
            color="black"
             />
        </TouchableOpacity>
      
        
        <Text style={styles.textbox}>{heading_name}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    textbox: {
        fontSize: 25,
        marginTop: 0,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'absolute',
        marginHorizontal:'33%',
        // left: 60,
        top: 25
        // marginBottom: 10
      },
      iconbox: {
        
      
        marginTop: 28,
        marginBottom: 10,
        marginLeft: 20
      },
});
