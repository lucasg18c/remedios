import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PacientService from "../../data/service/PacientService";
import MedicationService from "../../data/service/MedicationService";
import { Pacient } from "../../types/Pacient";
import { Unsubscribe } from "firebase/firestore";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Medicament } from "../../types/Medicament";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../routes/Routes";
import { StackNavigationProp } from "@react-navigation/stack";

function truncateDate(date: Date) {
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

const weekdayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [currentTimeSpan, setCurrentTimeSpan] = useState("");

  const [pacients, setPacients] = useState<Pacient[]>([]);
  const unsubs = useRef<Unsubscribe[]>([]);

  async function refresh() {
    try {
      clearSubs();

      const fromDate = truncateDate(new Date());
      const toDate = truncateDate(new Date());

      if (fromDate.getHours() < 12) {
        fromDate.setHours(0);
        toDate.setHours(12);
      } else {
        fromDate.setHours(12);
        toDate.setHours(0);
        toDate.setDate(toDate.getDate() + 1);
      }

      const fromTime = fromDate.getTime();
      const toTime = toDate.getTime();

      setLoading(true);
      const pacientList = await PacientService.getPacients();
      setPacients(pacientList);

      for (let pacient of pacientList) {
        const medList = await MedicationService.getMedicationsByPacient(
          pacient.id
        );

        if (medList.length == 0) {
          continue;
        }

        pacient.medications = medList;

        const found = medList.find((med) => {
          const time = med.fechaHora.getTime();
          return time >= fromTime && time < toTime;
        });

        if (!found) continue;

        pacient.currentMedication = found;

        setCurrentTimeSpan(
          `${
            weekdayNames[found.fechaHora.getDay()]
          } - ${found.fechaHora.getHours()}:00 hs`
        );

        const listen = MedicationService.listenMedication(found.id, (med) => {
          setPacients((prevPacient) => {
            const v = [...prevPacient];
            const p = v!.find((p) => p.id === pacient.id);
            const m = p!.medications!.findIndex((me) => me.id == med.id);

            p!.currentMedication = med;
            p!.medications![m] = med;

            return v;
          });
        });
        unsubs.current.push(listen);
      }

      setPacients(pacientList);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function clearSubs() {
    unsubs.current.forEach((s) => s());
  }

  async function handleToggle(idPacient: string, medicament: Medicament) {
    try {
      const pacientList = [...pacients];
      const pacientFound = pacientList.find((p) => p.id === idPacient)!;
      const medicamentFound = pacientFound.currentMedication!.remedios.find(
        (r) => r.remedio === medicament.remedio
      )!;
      medicamentFound.suministrado = !medicamentFound.suministrado;
      setPacients(pacientList);
      await MedicationService.updateMedication(pacientFound.currentMedication!);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    refresh();

    return () => clearSubs();
  }, []);

  const nav = useNavigation<StackNavigationProp<Routes>>();
  function handlePressPacient(pacient: Pacient) {
    nav.navigate("PacientDetail", { data: JSON.stringify(pacient) });
  }

  return (
    <View style={{ marginHorizontal: 20 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "500",
          marginTop: 60,
          color: "#323232",
        }}
      >
        Remedios
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          marginTop: 40,
          color: "#323232",
        }}
      >
        {currentTimeSpan}
      </Text>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        {pacients.map((pacient, key) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => handlePressPacient(pacient)}
              style={{
                marginTop: 20,
                backgroundColor: "#D9DFFF",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <View>
                <Text
                  style={{
                    marginBottom: 12,
                    fontWeight: "500",
                    fontSize: 16,
                    color: "#323232",
                  }}
                >
                  {pacient.nombre}
                </Text>

                {(pacient.currentMedication?.remedios.length ?? 0) == 0 &&
                  !loading && <Text>Todo listo!</Text>}

                {pacient.currentMedication?.remedios?.map((med, medKey) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleToggle(pacient.id, med)}
                      key={medKey}
                      style={{
                        marginTop: 12,
                        borderRadius: 50,
                        backgroundColor: med.suministrado
                          ? "#C0CAFF"
                          : "#D9DFFF",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          padding: 5,
                          alignItems: "center",
                        }}
                      >
                        {med.suministrado ? (
                          <MaterialIcons
                            name="check"
                            size={24}
                            color="#323232"
                          />
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
                          {med.remedio}
                        </Text>
                        <Text style={{ color: "#323232" }}>
                          ({med.cantidad})
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
