import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../constants';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

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

const EndScreen = ({won = false}) => {
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
