import { Medication } from "./Medication";

export type Pacient = {
    id: string;
    nombre: string;
    medications?: Medication[];
    currentMedication?: Medication;
};
