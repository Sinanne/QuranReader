import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid } from 'react-native';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View style={styles.progressBarContainer}>
      <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default ProgressBar;
