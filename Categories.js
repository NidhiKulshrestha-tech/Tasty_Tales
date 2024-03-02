import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
// import { Image } from 'react-native-paper/lib/typescript/components/Avatar/Avatar'

export default function Categories({props ,type}) {
 
  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{}}
        contentContainerStyle={{paddingHorizontal: 15}}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={{marginTop: 22, marginHorizontal: 10}}>
            <TouchableOpacity
               onPress={() => props.navigation.navigate('Starters' ,{Type:type})}>
              <Image
                source={require('../Image/starters.jpg')}
                style={{height: 55, width: 55, borderRadius: 50}}
              />
              <Text style={{color:'black'}}>Starters</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 22, marginHorizontal: 10}}>
            <TouchableOpacity onPress={() => props.navigation.navigate('Main_course',{Type:type})}>
              <Image
                source={require('../Image/main-course.jpeg')}
                style={{height: 55, width: 55, borderRadius: 50}}
              />
              <Text style={{color:'black'}}>Main Course</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 22, marginHorizontal: 10}}>
            <TouchableOpacity onPress={() => props.navigation.navigate('Sncks',{Type:type})}>
              <Image
                source={require('../Image/snacks.jpg')}
                style={{height: 55, width: 55, borderRadius: 50}}
              />
              <Text style={{color:'black'}}>Snacks</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 22, marginHorizontal: 10}}>
            <TouchableOpacity onPress={() => props.navigation.navigate('Desert')}>
              <Image
                source={require('../Image/desert.jpeg')}
                style={{height: 55, width: 55, borderRadius: 50}}
              />
              <Text style={{color:'black'}}>Desert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
