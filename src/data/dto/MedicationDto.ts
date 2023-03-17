import { MedicamentDto } from "./MedicamentDto";

export type MedicationDto = {
  fechaHora: Date;
  idPaciente: string;
  remedios: MedicamentDto[];
};
