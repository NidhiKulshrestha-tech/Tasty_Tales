import React from 'react';
import { View, Text } from 'react-native';
import CryptoJS from 'crypto-js';

const CryptoComponent = ({ addInfoString, encryptionKey }) => {
  const encryptAESData = () => {
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

  return (
    <View>
      {/* You can render any UI components or elements here */}
      <Text>Encrypted Data: {encryptAESData()}</Text>
    </View>
  );
};

export default CryptoComponent;
