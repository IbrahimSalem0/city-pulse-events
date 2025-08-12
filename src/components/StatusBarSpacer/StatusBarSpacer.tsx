import React from 'react';
import { View, StatusBar, Platform } from 'react-native';

interface StatusBarSpacerProps {
  backgroundColor?: string;
  height?: number;
}

export default function StatusBarSpacer({ 
  backgroundColor = 'transparent', 
  height 
}: StatusBarSpacerProps) {
  const statusBarHeight = height || (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0);

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={backgroundColor}
        translucent={true}
      />
      <View style={{ height: statusBarHeight, backgroundColor }} />
    </>
  );
}
