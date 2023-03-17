import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import PacientDetail from "../screens/pacient/PacientDetail";
import { Routes } from "./Routes";

const Stack = createNativeStackNavigator<Routes>();

export default function Router() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PacientDetail" component={PacientDetail} />
    </Stack.Navigator>
  );
}
