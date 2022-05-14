import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert} from 'react-native';
import Keyboard from './src/components/Keyboard';
import {CLEAR, ENTER, colors, colorsToEmoji} from './src/constants'
import * as Clipboard from 'expo-clipboard';

const NUMBER_OF_TRIES=7;

const getDayOfTheYear =()=>{
  const now =new Date();
  const start = new Date(now.getFullYear(),0,0);
  const diff = now-start;
  const oneDay = 1000*60*60*24;
  const day =Math.floor(diff/oneDay);
  return day;
};
const dayOfTheYear = getDayOfTheYear();
const wordsList = ["became","become","before","behalf","behind","belief","belong","berlin","better","beyond","bishop","border","bottle","bottom","bought","branch","breath","bridge","bright","broken","budget","burden","bureau","button","camera","cancer","cannot","carbon","career","castle","casual","caught","center","centre","chance","change","charge","choice","choose","chosen","church","circle","client","closed","closer","coffee","column","combat","coming","common","comply","copper","corner","costly","county","couple","course","covers","create","credit","crisis","custom","damage","danger","dealer","debate","decade","decide","defeat","defend","define","degree","demand","depend","deputy","desert","design","desire","detail","detect","device","differ","dinner","direct","doctor","dollar","domain","double","driven","driver","during","easily","eating","editor","effect","effort","eighth","either","eleven","emerge","empire","employ","enable","ending","energy","engage","engine","enough","ensure","entire","entity","equity","escape","estate","ethnic","exceed","except","excess","expand","expect","expert","export","extend","extent","fabric","facing","factor","failed","fairly","fallen","family","famous","father","fellow","female","figure","filing","finger","finish","fiscal","flight","flying","follow","forced","forest","forget","formal","format","former","foster","fought","fourth","French","friend","future","garden","gather","gender","german","global","golden","ground","growth","guilty","handed","handle","happen","hardly","headed","health","height","hidden","holder","honest","impact","import","income","indeed","injury","inside","intend","intent","invest","island","itself","jersey","joseph","junior","killed","labour","latest","latter","launch","lawyer","leader","league","leaves","legacy","length","lesson","letter","lights","likely","linked","liquid","listen","little","living","losing","lucent","luxury","mainly","making","manage","manner","manual","margin","marine","marked","market","martin","master","matter","mature","medium","member","memory","mental","merely","merger","method","middle","miller","mining","minute","mirror","mobile","modern","modest","module","moment","morris","mostly","mother","motion","moving","murder","museum","mutual","myself","narrow","nation","native","nature","nearby","nearly","nights","nobody","normal","notice","notion","number","object","obtain","office","offset","online","option","orange","origin","output","oxford","packed","palace","parent","partly","patent","people","period","permit","person","phrase","picked","planet","player","please","plenty","pocket","police","policy","prefer","pretty","prince","prison","profit","proper","proven","public","pursue","raised","random","rarely","rather","rating","reader","really","reason","recall","recent","record","reduce","reform","regard","regime","region","relate","relief","remain","remote","remove","repair","repeat","replay","report","rescue","resort","result","retail","retain","return","reveal","review","reward","riding","rising","robust","ruling","safety","salary","sample","saving","saying","scheme","school","screen","search","season","second","secret","sector","secure","seeing","select","seller","senior","series","server","settle","severe","sexual","should","signal","signed","silent","silver","simple","simply","single","sister","slight","smooth","social","solely","sought","source","soviet","speech","spirit","spoken","spread","spring","square","stable","status","steady","stolen","strain","stream","street","stress","strict","strike","string","strong","struck","studio","submit","sudden","suffer","summer","summit","supply","surely","survey","switch","symbol","system","taking","talent","target","taught","tenant","tender","tennis","thanks","theory","thirty","though","threat","thrown","ticket","timely","timing","tissue","toward","travel","treaty","trying","twelve","twenty","unable","unique","united","unless","unlike","update","useful","valley","varied","vendor","versus","victim","vision","visual","volume","walker","wealth","weekly","weight","wholly","window","winner","winter","within","wonder","worker","wright","writer","yellow"];
const words = ["Victim","Killed","Hardly","Mental","Junior","Suffer","Severe","Fiscal","Easily","Region","Proven","Saving","Replay","Unlike","Mutual","Detect","Remove","Handle","Injury","Better","Length","Nation","Bought","Please","During","Defeat","Rescue","Period","Source","Volume","Social","Resort","Patent","Handed","Strike","Signal","Search","Empire","Wealth","Lights","Eighth","Winter","Should","Jersey","Flight","Escape","Plenty","Planet","Museum","Report","Health","Effect","Likely","Wright","Native","Sister","Castle","Rather","Nature","Doctor","Change","Module","Honest","Differ","Server","Border","Choice","Summit","Merely","Policy","Reward","Bottom","Bottle","Entire","Obtain","Centre","Unless","Versus","Latest","Raised","Liquid","Stream","Prefer","Charge","Memory","Really","Visual","French","Listen","Secret","Morris","Island","Trying","Caught","Writer","Spread","Manner","Import","Stable","Partly","Unable","Making","Twenty","Family","Summer","Remain","Leaves","People","Father","Within","Golden","Joseph","Saying","Simply","Random","Select","Tissue","Career","Legacy","Coffee","Orange","Nearby","Income","Submit","Forced","Mining","Editor","Strain","Modest","Weight","Wholly","Fallen","Desire","Notion","Choose","Driver","Repeat","Toward","Taught","Latter","Fourth","Retail","Tender","Seller","Branch","Center","Costly","Smooth","Regime","Forget","Client","Enough","Moment","Vendor","Gender","Motion","Minute","Market","Losing","Margin","Deputy","Senior","Recall","Reduce","Labour","Pursue","Threat","Silent","Hidden","Eating","Simple","Growth","Dollar","Common","Expect","Reader","Exceed","Tenant","Closer","Closed","Spoken","Design","Weekly","Lesson","Define","Profit","Fairly","Future","Copper","Living","Middle","Itself","Defend","Depend","Cannot","Facing","Intent","Finish","Garden","Prince","Expand","Intend","Enable","Demand","Danger","Driven","Stress","United","Slight","Figure","Member","Factor","Screen","Permit","Speech","Remote","Flying","Friend","Riding","Detail","Chosen","Decide","Seeing","Sector","County","Lucent","Sexual","Invest","Marine","Status","Decade","Happen","Supply","Famous","Lawyer","Silver","Ticket","Chance","Letter","Pocket","Little","Matter","Manual","Recent","Reveal","Damage","Former","Circle","Custom","Single","Strict","Walker","Palace","Coming","String","Desert","Second","Steady","Merger","Combat","Theory","Comply","Height","Secure","Safety","Miller","Settle","Beyond","Gather","German","Option","Failed","Taking","Spirit","Studio","Marked","Timing","Export","Church","Public","Guilty","Switch","Salary","Normal","Budget","Varied","Mostly","Result","Picked","Travel","Fabric","Linked","Ethnic","Format","Pretty","Symbol","Online","Parent","Mainly","Object","Relate","Office","Myself","Nearly","Course","Crisis","Direct","Square","Effort","Murder","Robust","Carbon","Ground","Forest","Foster","Nights","Luxury","Though","Scheme","Reason","Method","Treaty","Degree","Follow","Filing","Global","Casual","Indeed","Bishop","Equity","Unique","Review","Thanks","Sample","Relief","Valley","Offset","Packed","Yellow","Spring","Person","Impact","Record","Martin","Except","Sought","Formal","Regard","Thrown","Police","Useful","Notice","Origin","Stolen","Dealer","Broken","Manage","Energy","Repair","Engage","Struck","Holder","Talent","Column","Timely","Rarely","Covers","Credit","Proper","Street","Fellow","Cancer","Estate","Sudden","Expert","Create","Debate","Wonder","Player","Headed","Dinner","Soviet","Tennis","School","Device","Female","Return","Retain","Signed","Ruling","Reform","Double","Employ","Window","Medium","League","Mirror","Modern","Eleven","Winner","Burden","Launch","Emerge","Inside","Extend","Mature","Output","Surely","Target","Solely","Nobody","Worker","Rising","Finger","Extent","Fought","Mother","Rating","Ensure","Prison","Bridge","Moving","Camera","Button","Oxford","Survey","Either","Corner","Ending","Excess","Master","Update","Thirty","Bureau","Domain","Number","Breath","Strong","Engine","Leader","Mobile","Series","Bright","System","Season","Couple","Phrase","Entity","Twelve","Narrow","Vision"];


const copyArray = (arr) =>{
  return [...arr.map((rows)=> [...rows])];
};

export default function App(){

  const word = words[dayOfTheYear].toLowerCase();
  
  const letters = word.split("");
  
  const [rows,setRows]= useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [currentRow, setCurrentRow]= useState(0);
  const [currentCol, setCurrentCol]= useState(0);
  const [gameState, setGameState]= useState('playing'); // playing, won, lost

  useEffect(() => {
    if(currentRow>0){
      checkGameState();
    }
  },[currentRow]
  );


  const checkGameState = () =>{
    if(checkIfWon() && gameState !== 'won') { 
      Alert.alert('hurray', 'you won', [{text:'Share', onPress: shareScore}]);
      setGameState('won');
    }
    
    else if(checkIfLost() && gameState !== 'lost') {
      Alert.alert('better luck next life');
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

  const shareScore = () =>{
    const tileMap = rows.map((row,i) => row.map((cell,j) => colorsToEmoji[getCellBGColor(i,j)] ).join("")).filter((row)=> row).join('\n');
    Clipboard.setString(tileMap);
    Alert.alert('copied result tiles', 'share your result on social media')
  }

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
      if(currentCol===rows[0].length){
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

  const getCellBGColor=(row,col)=>{
    const letter=rows[row][col];
    if(row>=currentRow){return colors.black;}
    if(letter===letters[col]){ return colors.primary;}
    if(letters.includes(letter)){ return colors.secondary;}
    return colors.darkgrey;
  }

  const getLettersWithColor = (color) =>{
    return rows.flatMap((row,i) => 
      row.filter((cell,j) => getCellBGColor(i,j)=== color))
  }
  const greenCaps=  getLettersWithColor(colors.primary);
  const yellowCaps= getLettersWithColor(colors.secondary);
  const greyCaps= getLettersWithColor(colors.darkgrey);

  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SHIMER</Text>
       <ScrollView style={styles.map}>
        {
          rows.map((row,i) => (
            <View 
            key = {`row-${i}`}
            style={styles.row} 
            >
            {row.map((cell,j) => (
              <View 
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
              </View>
            ))}   
            </View>
        ))}
    </ScrollView>
    <Keyboard 
      onKeyPressed={onKeyPressed}
      greenCaps={greenCaps}
      yellowCaps={yellowCaps}
      greyCaps={greyCaps}
    />
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

