import { Medicament } from "./Medicament";

export type Medication = {
    id: string;
    fechaHora: Date;
    idPaciente: string;
    remedios: Medicament[];
};
