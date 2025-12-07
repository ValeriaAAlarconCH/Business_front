// Interfaces para los DTOs del backend
export interface PacienteDto {
  idPaciente?: number;
  codigoPaciente?: string;
  nombre: string;
  fechaNacimiento?: string;
  genero?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export interface EvaluacionRequestDto {
  pacientedto?: PacienteDto;
  // Variables categóricas
  marcadoresGeneticos?: string;
  autoanticuerpos?: string;
  antecedentesFamiliares?: string;
  factoresAmbientales?: string;
  etnicidad?: string;
  habitosAlimenticios?: string;
  pruebaToleranciaGlucosa?: string;
  pruebasFuncionHepatica?: string;
  diagnosticoFibrosisQuistica?: string;
  usoEsteroides?: string;
  pruebasGeneticas?: string;
  historialEmbarazos?: string;
  diabetesGestacionalPrevia?: string;
  historialPcos?: string;
  estadoTabaquismo?: string;
  sintomasInicioTemprano?: string;
  factoresSocioeconomicos?: string;
  consumoAlcohol?: string;
  actividadFisica?: string;
  pruebaOrina?: string;

  // Variables numéricas
  nivelesInsulina?: number;
  edad?: number;
  indiceMasaCorporal?: number;
  presionArterial?: number;
  nivelesColesterol?: number;
  circunferenciaCintura?: number;
  nivelesGlucosa?: number;
  aumentoPesoEmbarazo?: number;
  saludPancreatica?: number;
  funcionPulmonar?: number;
  evaluacionesNeurologicas?: number;
  nivelesEnzimasDigestivas?: number;
  pesoNacimiento?: number;
}

export interface PrediccionResponseDto {
  tipoDiabetes: string;
  tipoDiabetesEs: string;
  probabilidad: number;
  explicacion: string;
  clasificaciones: { [key: string]: string };
  informacionTipo?: TipoDiabetesInfoDto;
  recomendacionesPersonalizadas: string;
  fechaPrediccion: string;
}

export interface TipoDiabetesInfoDto {
  idTipoDiabetes: number;
  nombreEn: string;
  nombreEs: string;
  descripcion: string;
  causas: string;
  sintomas: string;
  tratamiento: string;
  recomendaciones: string;
  esComun: boolean;
}

export interface GuiaCampoDto {
  idGuia: number;
  nombreCampo: string;
  tituloEs: string;
  descripcionEs: string;
  ejemplos: string;
  rangoRecomendado: string;
  unidadMedida: string;
}

// Enums para opciones predefinidas
export enum MarcadoresGeneticos {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative'
}

export enum Autoanticuerpos {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative'
}

export enum RespuestaSiNo {
  YES = 'Yes',
  NO = 'No'
}

export enum FactoresAmbientales {
  PRESENT = 'Present',
  ABSENT = 'Absent'
}

export enum Etnicidad {
  LOW_RISK = 'Low Risk',
  HIGH_RISK = 'High Risk'
}

export enum HabitosAlimenticios {
  HEALTHY = 'Healthy',
  UNHEALTHY = 'Unhealthy'
}

export enum ActividadFisica {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High'
}

export enum FactoresSocioeconomicos {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum EstadoTabaquismo {
  SMOKER = 'Smoker',
  NON_SMOKER = 'Non-Smoker'
}

export enum ConsumoAlcohol {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High'
}

export enum PruebaToleranciaGlucosa {
  NORMAL = 'Normal',
  ABNORMAL = 'Abnormal'
}

export enum PruebaOrina {
  NORMAL = 'Normal',
  GLUCOSE_PRESENT = 'Glucose Present',
  KETONES_PRESENT = 'Ketones Present',
  PROTEIN_PRESENT = 'Protein Present'
}

export enum HistorialEmbarazos {
  NORMAL = 'Normal',
  COMPLICATIONS = 'Complications'
}

export interface CampoFormulario {
  id: string;
  nombre: string;
  tipo: 'number' | 'text' | 'select' | 'date' | 'email' | 'tel';
  etiqueta: string;
  placeholder?: string;
  requerido: boolean;
  opciones?: string[];
  min?: number;
  max?: number;
  paso?: number;
  ayuda?: string;
  unidad?: string;
}
