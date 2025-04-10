import AsyncStorage from '@react-native-async-storage/async-storage';


  export const saveData= async(token,key)=>  {
    try {
        await AsyncStorage.setItem(key,token); 
      
       
        } catch (e) {
        console.log(e);
      }
}

export const _retrieveData = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data;
    } catch (error) {
      console.log(error);
    }
  }


  export const AUTH_TOKEN="auth_token"
  export const IsFirstLaunch = "true"

  export const premium="premium"