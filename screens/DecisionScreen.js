import React from 'react';
import { View, Text, Image,StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

class DecisionTimeScreen extends React.Component {
    render() {
        return (
            <View style={styles.decisionTimeScreenContainer}>
                <Image source={require('../assets/its-decision-time.android.png')}/>
                <Text style={{paddingTop: 20}}>click the food to get going </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    decisionTimeScreenContainer: {flex:1,alignItems:'center',justifyContent:'center'}
});

const Stack = createStackNavigator();

const DecisionScreen = () => {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName ="DecisionTimeScreen"
      >
        <Stack.Screen name="DecisionTimeScreen" component={DecisionTimeScreen} />
      </Stack.Navigator>
    )
}

export default DecisionScreen;
