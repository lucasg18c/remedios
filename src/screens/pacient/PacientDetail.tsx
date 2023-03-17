import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Pacient } from "../../types/Pacient";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { Routes } from "../../routes/Routes";

const weekdayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function PacientDetail() {
  const route = useRoute();
  const nav = useNavigation<StackNavigationProp<Routes>>();

  const [pacient, setPacient] = useState<Pacient | null>(null);

  useEffect(() => {
    const params = route.params as { data: string };
    const data = JSON.parse(params.data) as Pacient;
    data.medications = data.medications?.sort(
      (a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    );
    setPacient(data);
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          marginTop: StatusBar.currentHeight,
        }}
      >
        <TouchableOpacity onPress={nav.goBack}>
          <MaterialIcons name="arrow-back" size={32} color="#323232" />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 12,
            fontSize: 20,
            color: "#323232",
            fontWeight: "500",
          }}
        >
          {pacient?.nombre ?? "Detalle"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ marginHorizontal: 32, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {pacient?.medications?.map((med, key) => {
          const time = new Date(med.fechaHora);

          return (
            <View key={key}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  marginTop: 40,
                  color: "#323232",
                }}
              >
                {`${
                  weekdayNames[time.getDay()]
                } ${time.getDate()} - ${time.getHours()}:00 hs`}
              </Text>

              {med.remedios?.map((rem, remKey) => {
                return (
                  <View
                    key={remKey}
                    style={{
                      flexDirection: "row",
                      padding: 5,
                      alignItems: "center",
                      marginTop: 12,
                      borderRadius: 50,
                      backgroundColor: rem.suministrado ? "#C0CAFF" : "#D9DFFF",
                    }}
                  >
                    {rem.suministrado ? (
                      <MaterialIcons name="check" size={24} color="#323232" />
                    ) : (
                      <MaterialIcons
                        name="check-box-outline-blank"
                        size={24}
                        color="#323232"
                      />
                    )}
                    <Text
                      style={{
                        marginHorizontal: 12,
                      }}
                    >
                      {rem.remedio}
                    </Text>
                    <Text style={{ color: "#323232" }}>({rem.cantidad})</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
