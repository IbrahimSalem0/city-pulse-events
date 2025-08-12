import React from 'react';
import { Text } from 'react-native';
import { SafeArea } from '../components';
import { styles } from './SplashScreen.styles';

export default function SplashScreen() {
  return (
    <SafeArea>
      <Text style={styles.title}>City Pulse</Text>
      <Text style={styles.subtitle}>Local Events Explorer</Text>
    </SafeArea>
  );
}
