import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import Keyboard from './src/components/Keyboard';
import {colors} from './src/constants'

const NUMBER_OF_TRIES=7;
const copyArray = (arr) =>{
  return [...arr.map((rows)=> [...rows])];
};

export default function App(){

  word = "hellos";
  letters = word.split("");

  const [rows,setRows]= useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [currentRow, setCurrentRow]= useState(0);
  const [currentCol, setCurrentCol]= useState(0);

  const onKeyPressed = (key) =>{
    console.log(key);
    const updatedRows = copyArray(rows);
    updatedRows[currentRow][currentCol]=key;
    console.log(key);
    setRows(updatedRows);
    setCurrentCol(currentCol+1);
  }

  const isCellActive = (row,col) =>{
      return row===currentRow && col===currentCol;
  }
  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SHIMER</Text>
       <ScrollView style={styles.map}>
        {
          rows.map((row,i) => (
            <View key = {`row-${i}`}style={styles.row} >
            {row.map((cell,j) => (
              <View 
              key={`cell-${i}-${j}`}  
              style={[styles.cell,{ borderColor: isCellActive(i,j)?colors.grey:colors.darkgrey}]}
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}   
            </View>
        ))}
    </ScrollView>
    <Keyboard onKeyPressed={onKeyPressed}/>
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
  map:{
    alignSelf:'stretch',
    height:100,
  },
  row:{
    alignSelf:'stretch',
    flexDirection:'row',
    justifyContent:'center',
    //height: 60,
  },
    
  cell:{
    borderWidth:1,
    borderColor: colors.darkgrey,
    flex:1,
    maxWidth:60,
    aspectRatio:1,
    margin:3,
    justifyContent:'center',
    alignItems:'center',
  },
  
  cellText :{
      color: colors.lightgrey,
      fontWeight: 'bold',
      fontSize: 28,
  }
});

