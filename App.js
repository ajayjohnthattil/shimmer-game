import { StyleSheet, Text, SafeAreaView} from 'react-native';
import {colors} from './src/constants'
import Game from "./src/components/Game/Game"


export default function App(){

  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SHIMER</Text>
      <Game/>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container : {
    flex: 1,
    //justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#111111",

  },
  title:{
    paddingTop:30,
    paddingBottom:50,
    fontWeight:'bold',
    color: '#FFFFFF',
    fontSize:32,
    letterSpacing:7,
  },
  
});

