
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, ActivityIndicator} from 'react-native';
import Keyboard from '../Keyboard';
import {CLEAR, ENTER, colors, colorsToEmoji} from '../../constants'
import * as Clipboard from 'expo-clipboard';
import words from '../../words';
import wordList from '../../wordList';
import { copyArray, getDayKey, getDayOfTheYear } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EndScreen from '../EndScreen'
import Animated, {SlideInLeft,FlipInEasyX, FlipInEasyY, ZoomIn} from 'react-native-reanimated';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const NUMBER_OF_TRIES=7;
const dayOfTheYear = getDayOfTheYear();
const dayKey = getDayKey();

const Game = () => {

    //AsyncStorage.removeItem("@game");
    const word = words[dayOfTheYear].toLowerCase();
    //console.log(word);
    const letters = word.split("");
  
    const [rows,setRows]= useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
    );

    const [currentRow, setCurrentRow]= useState(0);
    const [currentCol, setCurrentCol]= useState(0);
    const [gameState, setGameState]= useState('playing'); // playing, won, lost
    const [loaded, setLoaded]= useState(false);

    useEffect(() => {
        if(currentRow>0){
            checkGameState();
        }
    },[currentRow]
    );

    useEffect(()=>{
       if(loaded){
        persistState();
      } 
    },[rows, currentCol, currentRow, gameState]);

    useEffect(()=>{
        readState();
    },[]);

    const persistState = async () =>{

      const dataForTheDay = {
        rows,
        currentRow,
        currentCol,
        gameState,
      };

      try{
        const existingDataString = await AsyncStorage.getItem('@game');
        const existingData = existingDataString?JSON.parse(existingDataString):{};
        existingData[dayKey] = dataForTheDay;

        const dataString = JSON.stringify(existingData);
        await AsyncStorage.setItem("@game",dataString);
        
      } catch(e){
        console.log("failed to setItem data to asyncstorage",e)
      }
    }
    const readState = async() => {
      const dataString = await AsyncStorage.getItem("@game");
      console.log(dataString);
       try{
         const data = JSON.parse(dataString);
         const day = data[dayKey]
         setRows(day.rows);
         setCurrentRow(day.currentRow);
         setCurrentCol(day.currentCol);
         setGameState(day.gameState);

       } catch(e){
         console.log("couldn't parse state");
      }
      setLoaded(true);
    }

    const checkGameState = () =>{
        if(checkIfWon() && gameState !== 'won') { 
           // Alert.alert('hurray', 'you won', [{text:'Share', onPress: shareScore}]);
            setGameState('won');
        }
    
    else if(checkIfLost() && gameState !== 'lost') {
     // Alert.alert('better luck next life');
      setGameState('lost');
    }
  }

  const checkIfWon = () => {
    const row = rows[currentRow-1];
    return row.every((letter,i) => letter === letters[i]);
  }
  const checkIfLost = () => {
    return !checkIfWon() && currentRow === rows.length;
  }

  const checkIfValidWord = () =>{

    const x = rows[currentRow].join('');
    
    const found = wordList.includes(x);

    if(!found) {
      showMessage({
        message: "Invalid Word !!",
        type: "default",
        backgroundColor: "white",
        color: "#606060", // text color
      });
    }

    return found
  }

  // const shareScore = () =>{
  //   const tileMap = rows.map((row,i) => row.map((cell,j) => colorsToEmoji[getCellBGColor(i,j)] ).join("")).filter((row)=> row).join('\n');
  //   Clipboard.setString(tileMap);
  //   Alert.alert('copied result tiles', 'share your result on social media')
  // }

  const onKeyPressed = (key) =>{

    if(gameState !== 'playing'){
      return;
    }

    const updatedRows = copyArray(rows);

    if(key===CLEAR){
      const prevCol = currentCol - 1;
      if(prevCol>=0){
        updatedRows[currentRow][prevCol]="";
        setRows(updatedRows);
        setCurrentCol(prevCol);
      }
      return;
    }

    if(key===ENTER){
      if(currentCol===rows[0].length && checkIfValidWord()){
        setCurrentRow(currentRow+1);
        setCurrentCol(0);  
      }
      return;
    }

    if(currentCol<rows[0].length){
      updatedRows[currentRow][currentCol]=key;
      setRows(updatedRows);
      setCurrentCol(currentCol+1);
    }
    
  }

  const isCellActive = (row,col) =>{
      return row===currentRow && col===currentCol;
  }

  const getCellBGColor=(row, col)=>{
    const letter=rows[row][col];
    if(row>=currentRow){return colors.black;}
    if(letter===letters[col]){ return colors.primary;}
    if(letters.includes(letter)){ return colors.secondary;}
    return colors.darkgrey;
  }
  // const getCellBGStyle=(i,j)=>
  //   [
  //     styles.cell,
  //     { 
  //       borderColor: isCellActive(i,j)?colors.grey:colors.darkgrey,
  //       backgroundColor: getCellBGColor(i,j)
  //     },
  //   ]
  

  const getLettersWithColor = (color) =>{
    return rows.flatMap((row,i) => 
      row.filter((cell,j) => getCellBGColor(i,j)=== color))
  }
  const greenCaps=  getLettersWithColor(colors.primary);
  const yellowCaps= getLettersWithColor(colors.secondary);
  const greyCaps= getLettersWithColor(colors.darkgrey);

  if(!loaded){
    return (<ActivityIndicator/>)
  }

  if(gameState !== 'playing')
  {
    return (<EndScreen word={word} rows={rows} getCellBGColor={getCellBGColor}/>)
  }

  return(
 
    <>
       <ScrollView style={styles.map}>
        {
          rows.map((row,i) => (
            <Animated.View 
            entering={SlideInLeft.delay(i*80)}
            key = {`row-${i}`}
            style={styles.row} 
            >
            {row.map((cell,j) => (
              <>
              {
              i<currentRow &&
              (<Animated.View 
              entering={FlipInEasyY.delay(j* 100)}
              key={`cell-${i}-${j}`}  
              style={[
                styles.cell,
                { 
                  borderColor: isCellActive(i,j)?colors.grey:colors.darkgrey,
                  backgroundColor: getCellBGColor(i,j)
                },
              ]}  
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </Animated.View>)
              }
              {
              i===currentRow && !!cell &&
              (<Animated.View 
              entering={ZoomIn}
              key={`cell-active-${i}-${j}`}  
              style={[
                styles.cell,
                { 
                  borderColor: isCellActive(i,j)?colors.grey:colors.darkgrey,
                  backgroundColor: getCellBGColor(i,j)
                },
              ]}  
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </Animated.View>)
              }
              {
              !cell &&
              (<Animated.View 
              entering={FlipInEasyY.delay(100)}
              key={`cell-blank-${i}-${j}`}  
              style={[
                styles.cell,
                { 
                  borderColor: isCellActive(i,j)?colors.grey:colors.darkgrey,
                  backgroundColor: getCellBGColor(i,j)
                },
              ]}  
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </Animated.View>)
              }
              </>
            ))}   
            </Animated.View>
        ))}
        </ScrollView>
        <Keyboard 
            onKeyPressed={onKeyPressed}
            greenCaps={greenCaps}
            yellowCaps={yellowCaps}
            greyCaps={greyCaps}
        />
        <FlashMessage position="center" />
    </>
  )
};

const styles = StyleSheet.create({
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

export default Game;
