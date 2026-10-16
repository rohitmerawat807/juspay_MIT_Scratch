import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.title}>Scratch</Text>
      </View>

      <View style={styles.stage} />

      <View style={styles.editor}>
        <View style={styles.palette} />
        <View style={styles.script} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f1fc',
  },
  toolbar: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#855cd6',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  stage: {
    aspectRatio: 4 / 3,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d9e3f2',
    backgroundColor: '#fff',
  },
  editor: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#d9e3f2',
  },
  palette: {
    width: 150,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#d9e3f2',
  },
  script: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});
