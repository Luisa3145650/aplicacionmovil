import React from 'react';
import { requireNativeComponent, ViewStyle, StyleProp } from 'react-native';

interface AvatarViewProps {
  name: string;
  style?: StyleProp<ViewStyle>;
}

const NativeAvatarView = requireNativeComponent<AvatarViewProps>('AvatarView');

const AvatarView: React.FC<AvatarViewProps> = ({ name, style }) => {
  return (
    <NativeAvatarView 
      name={name} 
      style={[
        { borderRadius: 9999, overflow: 'hidden' }, // Needed for Android to make it circular
        style
      ]} 
    />
  );
};

export default AvatarView;
