import React,{useState,useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
import StartersData from './Pages/StartersData';
import MainCourseData from './Pages/MainCourseData';
import SnacksData from './Pages/SnacksData';
import DesertData from './Pages/DesertData';
import Splash from './Pages/Splash';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import Starters from './Pages/Starters';
import Main_course from './Pages/Main_course';
import Sncks from './Pages/Sncks';
import Desert from './Pages/Desert';
import Profile from './Pages/Profile';
import Update from './Pages/Update';



const stack = createNativeStackNavigator();


  export  default function App({navigation}) {

  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    
    const checkUserToken = async () => {
      try {
        const Token = await AsyncStorage.getItem('Token');
        setUserToken(Token)

      
      } catch (error) {
        console.error('Error checking user token:', error);
      }
    };
    checkUserToken();
  }, []);

  const renderScreens = () => {
    if (!userToken) {
      return (
        <NavigationContainer>
              <stack.Navigator screenOptions={{headerShown: false}}>
                <stack.Screen name='Splash' component={Splash}/>
                <stack.Screen name='Home' component={Home}/>
                <stack.Screen name='SignUp' component={SignUp}/>
                <stack.Screen name='Login' component={Login}/>
                <stack.Screen name='Dashboard' component={Dashboard}/>
                <stack.Screen name='Profile' component={Profile}/>
                <stack.Screen name='Update' component={Update}/>
                <stack.Screen name='Starters' component={Starters}/>
                <stack.Screen name='Main_course' component={Main_course}/>
                <stack.Screen name='Sncks' component={Sncks}/>
                <stack.Screen name='Desert' component={Desert}/>
                <stack.Screen name='StartersData' component={StartersData}/>
                <stack.Screen name='MainCourseData' component={MainCourseData}/>
                <stack.Screen name='SnacksData' component={SnacksData}/>
                <stack.Screen name='DesertData' component={DesertData}/>
              </stack.Navigator>
            </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
        <stack.Navigator screenOptions={{headerShown: false}}>
          <stack.Screen name='Dashboard' component={Dashboard}/>
          <stack.Screen name='Profile' component={Profile}/>
          <stack.Screen name='Update' component={Update}/>
          <stack.Screen name='Starters' component={Starters}/>
          <stack.Screen name='Main_course' component={Main_course}/>
          <stack.Screen name='Sncks' component={Sncks}/>
          <stack.Screen name='Desert' component={Desert}/>
          <stack.Screen name='StartersData' component={StartersData}/>
          <stack.Screen name='MainCourseData' component={MainCourseData}/>
          <stack.Screen name='SnacksData' component={SnacksData}/>
          <stack.Screen name='DesertData' component={DesertData}/>
          {/* <stack.Screen name='Splash' component={Splash}/> */}
          <stack.Screen name='Home' component={Home}/>
          <stack.Screen name='SignUp' component={SignUp}/>
          <stack.Screen name='Login' component={Login}/>
        </stack.Navigator>
      </NavigationContainer>
      );
    }
  };

  return renderScreens();
};