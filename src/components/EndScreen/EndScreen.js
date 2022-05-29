import { StyleSheet, Text, View, Pressable, Alert} from 'react-native'
import React, { useState, useEffect }  from 'react'
import { colors, colorsToEmoji } from '../../constants';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stat = ({number,label})=>(
  <View style={{alignItems:"center", margin:10}}>
    <Text style={{color:colors.lightgrey,fontWeight:"bold", fontSize:30}}>{number}</Text>
    <Text style={{color:colors.lightgrey, fontSize:16}}>{label}</Text>
  </View>
);

const GuessDistriLine =({position,amount, percentage })=>{
  return(
    <View style={{flexDirection:"row", alignItems:"center", width:"100%"}}>
      <Text style={{color:colors.lightgrey, marginRight:10}}>{position}</Text>
      <View style={{alignSelf:"stretch", width:`${percentage}%`,backgroundColor: colors.primary, margin:5,padding:5}}>
        <Text style={{color:colors.lightgrey}}>{amount}</Text>
      </View>
    </View>
  )
};

const GuessDistribution = ({distribution , played}) => {
  if(!distribution) return null;
  return(
  <>
  <Text style={styles.subtitle}>Guess Distribution</Text>
  <GuessDistriLine position={1} amount={distribution[1]} percentage={distribution[1]/played*100}/>
  <GuessDistriLine position={2} amount={distribution[2]} percentage={distribution[2]/played*100}/>
  <GuessDistriLine position={3} amount={distribution[3]} percentage={distribution[3]/played*100}/>
  <GuessDistriLine position={4} amount={distribution[4]} percentage={distribution[4]/played*100}/>
  <GuessDistriLine position={5} amount={distribution[5]} percentage={distribution[5]/played*100}/>
  <GuessDistriLine position={6} amount={distribution[6]} percentage={distribution[6]/played*100}/>
  <GuessDistriLine position={7} amount={distribution[7]} percentage={distribution[7]/played*100}/>
  </>
  )
};

const EndScreen = ({won = false, rows, getCellBGColor}) => {
  
  
  const [secondsTillTomorrow, setSecondsTillTomorrow] = useState(0);

  const [played,setPlayed] = useState(0);
  const [winRate,setWinRate] = useState(0);
  const [currentStreak,setCurrentStreak] = useState(0);
  const [maxStreak,setMaxStreak] = useState(0);

  //guess distribution
  const [distribution,setDistribution] = useState([0,0,0,0,0,0,0,0])
  
 
  const shareStats = () => {
    console.log(rows);
    const tileMap = rows.map((row,i) => row.map((cell,j) => colorsToEmoji[getCellBGColor(i,j)] ).join("")).filter((row)=> row).join('\n');
    Clipboard.setString(tileMap);
    Alert.alert('copied result tiles', 'share your result on social media');
  };
 

  useEffect(()=>{
    readState();
  },[]);

  useEffect (()=>{
    const updateTimer=()=>{
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);

      setSecondsTillTomorrow((tomorrow-now)/1000);

    };

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  },[]);

  const readState = async() => {
    const dataString = await AsyncStorage.getItem("@game");
    let data;
     try{
       data = JSON.parse(dataString);
       //console.log(data);
       
     } catch(e){
       console.log(e);
    }

    const keys = Object.keys(data);
    const values = Object.values(data);

    setPlayed(keys.length); //no. of entries in data will be the no. of games played
    
    const numberOfWins = values.filter((game) => game.gameState === 'won').length; // filter out the 'won' gameStates to know how many were won
    setWinRate(Math.floor(numberOfWins/keys.length *100)); //calculate win%

    let streakCount = 0;
    
    let prevKey = 0;

    let dist = [0,0,0,0,0,0,0,0];

    //setting stats which require looping through data 
    // currentStreak, maxStreak, distribution
    keys.forEach(key => {

      const day = parseInt(key.split('-')[1]);
      
      if(data[key].gameState === 'won' && prevKey + 1 === day){
        streakCount+=1;
        if(maxStreak<streakCount) setMaxStreak(streakCount);
      }
      else if (data[key].gameState === 'won'){

        streakCount = 1;
        
        dist[data[key].currentRow] +=1;
      }
      else streakCount = 0;
      
      prevKey = day;
    })
      setCurrentStreak(streakCount) 
      setDistribution(dist);
      console.log(dist)
       
       //setLoaded(true);
  }


  const formatSeconds = () => {
    let x = secondsTillTomorrow;
    const hours = Math.floor(x/(60*60));
    x= x - hours*60*60;
    const minutes = Math.floor(x/(60));
    x = x - minutes * 60;
    const seconds = Math.floor(x%60);

    return `${hours}:${minutes}:${seconds}`;
    
  }

  return (
    <View>
      <Text style={styles.title}>Good Game, Well Played.</Text>
      <Text style={styles.subtitle}>STATISTICS</Text>
      <View style= {{flexDirection:"row",marginBottom:10}}>
        <Stat number={played} label={"played"}/>
        <Stat number={winRate} label={"WIN %"}/>
        <Stat number={currentStreak} label={"Current Streak"}/>
        <Stat number={maxStreak} label={"Max Streak"}/>
      </View>
      <GuessDistribution distribution={distribution} played = {played}/>

      <View style={{flexDirection:"row"}}>
        <View style={{alignItems:"center", flex:1}}>
          <Text style={{color:colors.lightgrey}}>Next Word</Text>
          <Text style={{color:colors.lightgrey,fontSize:24,fontWeight:"bold"}}>{formatSeconds()}</Text>
        </View>
        <Pressable style={{flex:1, backgroundColor:colors.primary, borderRadius:25, alignItems:"center", justifyContent:"center"}} onPress={shareStats}>
          <Text style={{color: colors.lightgrey, fontWeight: "bold"}}>Share</Text>
        </Pressable>
      </View>
      
    </View>
  )
};

export default EndScreen;

const styles = StyleSheet.create({
  title:{
    fontSize: 30,
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  subtitle :{
    fontSize: 20,
    color: colors.lightgrey,
    textAlign:"center",
    marginVertical:15,
    fontWeight:"bold",
  },

}
);
