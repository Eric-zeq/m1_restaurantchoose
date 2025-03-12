import React from "react";
import Constants from 'expo-constants'
import { Image,Platform } from "react-native";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import PeopleScreen from './screens/PeopleScreen'
import DecisionScreen from './screens/DecisionScreen'
import RestaurantsScreen from './screens/RestaurantsScreen'

const platformOS = Platform.OS.toLowerCase();

const Tab = createMaterialTopTabNavigator();
const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="DecisionScreen" // 设置初始路由
      screenOptions={{
        animationEnabled: true, // 启用动画
        swipeEnabled: true, // 启用滑动切换
        lazy: true, // 启用懒加载
        tabBarPosition: Platform.OS === 'android' ? 'top' : 'bottom', // 设置 TabBar 位置
        tabBarActiveTintColor: '#ff0000', // 激活状态的颜色
        tabBarShowIcon: true, // 显示图标
        tabBarStyle: {
          paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0, // 根据平台设置 paddingTop
        },
      }}
    >
      <Tab.Screen
        name="PeopleScreen"
        component={PeopleScreen}
        options={{
          tabBarLabel: 'People', // 标签文本
          tabBarIcon: ({ color }) => ( // 图标
            <Image
              source={require('./assets/icon-people.png')}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
      />
        <Tab.Screen
        name="DecisionScreen"
        component={DecisionScreen}
        options={{
          tabBarLabel: 'Decision', // 标签文本
          tabBarIcon: ({ color }) => ( // 图标
            <Image
              source={require('./assets/icon-decision.png')}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RestaurantsScreen"
        component={RestaurantsScreen}
        options={{
          tabBarLabel: 'Restaurants', // 标签文本
          tabBarIcon: ({ color }) => ( // 图标
            <Image
              source={require('./assets/icon-restaurants.png')}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Tabs;


