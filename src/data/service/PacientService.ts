import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Pacient } from "../../types/Pacient";

const COLLECTION_NAME = "pacientes";

async function getPacients(): Promise<Pacient[]> {
    const snap = await getDocs(collection(db, COLLECTION_NAME));

    if (snap.empty) return [];

    return snap.docs.map((doc) => {
        const data = doc.data() as Pacient;
        data.id = doc.id;
        return data;
    });
}

export default { getPacients };
