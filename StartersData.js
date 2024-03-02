import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { decode } from 'base-64';
import { useRoute } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function StartersData({ route }) {
  const [recipeData, setRecipeData] = useState('');
  const { items } = route.params;

  useEffect(() => {
    const base64String = items?.Recipe;
    const decodedString = decode(base64String);
    setRecipeData(decodedString);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.txt_1}>{items.ItemName}</Text>
        <Image
          source={{
            uri: `data:image/jpeg;base64,${items?.ItemImage}`,
          }}
          style={styles.img_1}
        />
        <ScrollView style={styles.recipeScrollView}>
          <Text style={styles.txt_3}>{recipeData}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0e1c5',
    minHeight: height, // Use minHeight instead of height
  },
  txt_1: {
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black',
    borderBottomWidth: 5,
    marginHorizontal: 80,
    marginTop: 30,
  },
  img_1: {
    height: 300,
    width: '90%',
    marginHorizontal: '6%',
    marginTop: 30,
  },
  recipeScrollView: {
    marginTop: 20,
    marginHorizontal: 15,
    paddingLeft: 10,
    flexGrow: 1, // Use flexGrow to allow content to expand
  },
  txt_3: {
    fontSize: 15,
    color: 'black',
  },
});
