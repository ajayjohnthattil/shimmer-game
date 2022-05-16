import { StyleSheet, Text, View, Pressable, Alert} from 'react-native'
import React, { useState, useEffect }  from 'react'
import { colors, colorsToEmoji } from '../../constants';
import * as Clipboard from 'expo-clipboard';

const Stat = ({number,label})=>(
  <View style={{alignItems:"center", margin:10}}>
    <Text style={{color:colors.lightgrey,fontWeight:"bold", fontSize:30}}>{number}</Text>
    <Text style={{color:colors.lightgrey, fontSize:16}}>{label}</Text>
  </View>
);

const GuessDistriLine =({position,amount, percentage})=>{
  return(
    <View style={{flexDirection:"row", alignItems:"center", width:"100%"}}>
      <Text style={{color:colors.lightgrey, marginRight:10}}>{position}</Text>
      <View style={{alignSelf:"stretch", width:`${percentage}%`,backgroundColor: colors.primary, margin:5,padding:5}}>
        <Text style={{color:colors.lightgrey}}>{amount}</Text>
      </View>
    </View>
  )
};

const GuessDistribution = () => {
  return(
  <>
  <Text style={styles.subtitle}>Guess Distribution</Text>
  <GuessDistriLine position={1} amount={0} percentage={0}/>
  <GuessDistriLine position={2} amount={1} percentage={10}/>
  <GuessDistriLine position={3} amount={4} percentage={40}/>
  <GuessDistriLine position={4} amount={0} percentage={0}/>
  <GuessDistriLine position={5} amount={4} percentage={40}/>
  <GuessDistriLine position={6} amount={1} percentage={10}/>
  <GuessDistriLine position={7} amount={0} percentage={0}/>
  </>
  )
};

const EndScreen = ({won = false, rows, getCellBGColor}) => {
  
  
  const [secondsTillTomorrow, setSecondsTillTomorrow] = useState(0);
 
  const shareStats = () => {
    console.log(rows);
    const tileMap = rows.map((row,i) => row.map((cell,j) => colorsToEmoji[getCellBGColor(i,j)] ).join("")).filter((row)=> row).join('\n');
    Clipboard.setString(tileMap);
    Alert.alert('copied result tiles', 'share your result on social media');
  };
 

  useEffect (()=>{
    const updateTimer=()=>{
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);

      setSecondsTillTomorrow((tomorrow-now)/1000);

    };

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  },[]);

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
        <Stat number={10} label={"played"}/>
        <Stat number={100} label={"WIN %"}/>
        <Stat number={10} label={"Current Streak"}/>
        <Stat number={10} label={"Max Streak"}/>
      </View>
      <GuessDistribution/>

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
