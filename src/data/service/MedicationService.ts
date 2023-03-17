import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Medication } from "../../types/Medication";
import { MedicationDto } from "../dto/MedicationDto";

const COLLECTION_NAME = "medicaciones";

async function getMedicationsByPacient(
  pacientId: string
): Promise<Medication[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTION_NAME), where("idPaciente", "==", pacientId))
  );

  if (snap.empty) return [];

  return snap.docs.map((doc) => {
    const data = doc.data() as any;

    data.id = doc.id;
    data.fechaHora = data.fechaHora.toDate();
    return data as Medication;
  });
}

function listenMedication(
  id: string,
  observer: (medication: Medication) => any
) {
  return onSnapshot(doc(db, COLLECTION_NAME, id), (d) => {
    const med = d.data() as any;
    med.id = d.id;
    med.fechaHora = med.fechaHora.toDate();
    observer(med as Medication);
  });
}

function updateMedication(medication: Medication) {
  return setDoc(doc(db, COLLECTION_NAME, medication.id), {
    fechaHora: medication.fechaHora,
    idPaciente: medication.idPaciente,
    remedios: medication.remedios,
  } as MedicationDto);
}

export default { getMedicationsByPacient, listenMedication, updateMedication };
