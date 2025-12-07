import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { Utils } from './services/utils';
import {
  PacienteDto,
  EvaluacionRequestDto,
  PrediccionResponseDto,
  TipoDiabetesInfoDto,
  GuiaCampoDto,
  CampoFormulario,
  MarcadoresGeneticos,
  Autoanticuerpos,
  RespuestaSiNo,
  FactoresAmbientales,
  Etnicidad,
  HabitosAlimenticios,
  ActividadFisica,
  FactoresSocioeconomicos,
  EstadoTabaquismo,
  ConsumoAlcohol,
  PruebaToleranciaGlucosa,
  PruebaOrina,
  HistorialEmbarazos
} from './models/types';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild('formEvaluacion') formularioEvaluacion!: ElementRef<HTMLFormElement>;

  pacienteActual: PacienteDto | null = null;
  resultado: PrediccionResponseDto | null = null;
  tiposDiabetes: TipoDiabetesInfoDto[] = [];
  guiasCampos: GuiaCampoDto[] = [];
  selectedTipo: TipoDiabetesInfoDto | null = null;
  seccionActiva: string = 'formulario';
  showModal: boolean = false;

  opcionesSelect = {
    marcadoresGeneticos: Object.values(MarcadoresGeneticos),
    autoanticuerpos: Object.values(Autoanticuerpos),
    antecedentesFamiliares: Object.values(RespuestaSiNo),
    factoresAmbientales: Object.values(FactoresAmbientales),
    etnicidad: Object.values(Etnicidad),
    habitosAlimenticios: Object.values(HabitosAlimenticios),
    actividadFisica: Object.values(ActividadFisica),
    factoresSocioeconomicos: Object.values(FactoresSocioeconomicos),
    estadoTabaquismo: Object.values(EstadoTabaquismo),
    consumoAlcohol: Object.values(ConsumoAlcohol),
    pruebaToleranciaGlucosa: Object.values(PruebaToleranciaGlucosa),
    pruebaOrina: Object.values(PruebaOrina),
    historialEmbarazos: Object.values(HistorialEmbarazos),
    diagnosticoFibrosisQuistica: Object.values(RespuestaSiNo),
    usoEsteroides: Object.values(RespuestaSiNo),
    pruebasGeneticas: Object.values(RespuestaSiNo),
    diabetesGestacionalPrevia: Object.values(RespuestaSiNo),
    historialPcos: Object.values(RespuestaSiNo),
    sintomasInicioTemprano: Object.values(RespuestaSiNo)
  };

  campos: CampoFormulario[] = [
    { id: 'edad', nombre: 'edad', tipo: 'number', etiqueta: 'Edad (años)', requerido: true, min: 0, max: 120, paso: 1, ayuda: 'Edad del paciente en años' },
    { id: 'nivelesGlucosa', nombre: 'nivelesGlucosa', tipo: 'number', etiqueta: 'Niveles de Glucosa (mg/dL)', requerido: true, min: 0, max: 600, paso: 0.1, ayuda: 'Glucosa en sangre en ayunas' },
    { id: 'nivelesInsulina', nombre: 'nivelesInsulina', tipo: 'number', etiqueta: 'Niveles de Insulina (μU/mL)', requerido: true, min: 0, max: 100, paso: 0.1, ayuda: 'Nivel de insulina en sangre' },
    { id: 'indiceMasaCorporal', nombre: 'indiceMasaCorporal', tipo: 'number', etiqueta: 'Índice de Masa Corporal (IMC)', requerido: true, min: 10, max: 50, paso: 0.1, ayuda: 'Peso(kg) / Altura(m)²' },
    { id: 'presionArterial', nombre: 'presionArterial', tipo: 'number', etiqueta: 'Presión Arterial (mmHg)', requerido: true, min: 50, max: 250, paso: 1, ayuda: 'Presión arterial sistólica' },
    { id: 'nivelesColesterol', nombre: 'nivelesColesterol', tipo: 'number', etiqueta: 'Niveles de Colesterol (mg/dL)', requerido: true, min: 50, max: 400, paso: 1, ayuda: 'Colesterol total en sangre' },
    { id: 'circunferenciaCintura', nombre: 'circunferenciaCintura', tipo: 'number', etiqueta: 'Circunferencia de Cintura (cm)', requerido: false, min: 30, max: 200, paso: 0.1, ayuda: 'Medida de la cintura' },
    { id: 'marcadoresGeneticos', nombre: 'marcadoresGeneticos', tipo: 'select', etiqueta: 'Marcadores Genéticos', requerido: true, opciones: this.opcionesSelect.marcadoresGeneticos, ayuda: 'Presencia de marcadores genéticos relacionados con diabetes' },
    { id: 'autoanticuerpos', nombre: 'autoanticuerpos', tipo: 'select', etiqueta: 'Autoanticuerpos', requerido: true, opciones: this.opcionesSelect.autoanticuerpos, ayuda: 'Presencia de autoanticuerpos asociados al daño pancreático' },
    { id: 'antecedentesFamiliares', nombre: 'antecedentesFamiliares', tipo: 'select', etiqueta: 'Antecedentes Familiares de Diabetes', requerido: true, opciones: this.opcionesSelect.antecedentesFamiliares, ayuda: 'Historial familiar de diabetes' },
    { id: 'factoresAmbientales', nombre: 'factoresAmbientales', tipo: 'select', etiqueta: 'Factores Ambientales', requerido: true, opciones: this.opcionesSelect.factoresAmbientales, ayuda: 'Exposición a factores ambientales de riesgo' },
    { id: 'etnicidad', nombre: 'etnicidad', tipo: 'select', etiqueta: 'Etnicidad (Riesgo)', requerido: true, opciones: this.opcionesSelect.etnicidad, ayuda: 'Grupo étnico clasificado por riesgo' },
    { id: 'habitosAlimenticios', nombre: 'habitosAlimenticios', tipo: 'select', etiqueta: 'Hábitos Alimenticios', requerido: true, opciones: this.opcionesSelect.habitosAlimenticios, ayuda: 'Calidad de la dieta del paciente' },
    { id: 'actividadFisica', nombre: 'actividadFisica', tipo: 'select', etiqueta: 'Nivel de Actividad Física', requerido: true, opciones: this.opcionesSelect.actividadFisica, ayuda: 'Frecuencia e intensidad de ejercicio' },
    { id: 'factoresSocioeconomicos', nombre: 'factoresSocioeconomicos', tipo: 'select', etiqueta: 'Nivel Socioeconómico', requerido: true, opciones: this.opcionesSelect.factoresSocioeconomicos, ayuda: 'Nivel socioeconómico del paciente' },
    { id: 'estadoTabaquismo', nombre: 'estadoTabaquismo', tipo: 'select', etiqueta: 'Estado de Tabaquismo', requerido: true, opciones: this.opcionesSelect.estadoTabaquismo, ayuda: 'Consumo de tabaco' },
    { id: 'consumoAlcohol', nombre: 'consumoAlcohol', tipo: 'select', etiqueta: 'Consumo de Alcohol', requerido: true, opciones: this.opcionesSelect.consumoAlcohol, ayuda: 'Frecuencia y cantidad de consumo de alcohol' },
    { id: 'pruebaToleranciaGlucosa', nombre: 'pruebaToleranciaGlucosa', tipo: 'select', etiqueta: 'Prueba de Tolerancia a la Glucosa', requerido: true, opciones: this.opcionesSelect.pruebaToleranciaGlucosa, ayuda: 'Resultado de prueba de tolerancia a glucosa' },
    { id: 'pruebaOrina', nombre: 'pruebaOrina', tipo: 'select', etiqueta: 'Prueba de Orina', requerido: true, opciones: this.opcionesSelect.pruebaOrina, ayuda: 'Resultado de análisis de orina' },
    { id: 'historialEmbarazos', nombre: 'historialEmbarazos', tipo: 'select', etiqueta: 'Historial de Embarazos', requerido: false, opciones: this.opcionesSelect.historialEmbarazos, ayuda: 'Complicaciones durante embarazos previos' },
    { id: 'diabetesGestacionalPrevia', nombre: 'diabetesGestacionalPrevia', tipo: 'select', etiqueta: 'Diabetes Gestacional Previa', requerido: false, opciones: this.opcionesSelect.diabetesGestacionalPrevia, ayuda: 'Diabetes durante embarazos anteriores' },
    { id: 'historialPcos', nombre: 'historialPcos', tipo: 'select', etiqueta: 'Historial de PCOS', requerido: false, opciones: this.opcionesSelect.historialPcos, ayuda: 'Síndrome de ovario poliquístico' },
    { id: 'sintomasInicioTemprano', nombre: 'sintomasInicioTemprano', tipo: 'select', etiqueta: 'Síntomas de Inicio Temprano', requerido: false, opciones: this.opcionesSelect.sintomasInicioTemprano, ayuda: 'Síntomas de diabetes a edad temprana' },
    { id: 'diagnosticoFibrosisQuistica', nombre: 'diagnosticoFibrosisQuistica', tipo: 'select', etiqueta: 'Diagnóstico de Fibrosis Quística', requerido: false, opciones: this.opcionesSelect.diagnosticoFibrosisQuistica, ayuda: 'Diagnóstico previo de fibrosis quística' },
    { id: 'usoEsteroides', nombre: 'usoEsteroides', tipo: 'select', etiqueta: 'Uso de Esteroides', requerido: false, opciones: this.opcionesSelect.usoEsteroides, ayuda: 'Uso habitual o histórico de esteroides' },
    { id: 'aumentoPesoEmbarazo', nombre: 'aumentoPesoEmbarazo', tipo: 'number', etiqueta: 'Aumento de Peso en Embarazo (kg)', requerido: false, min: 0, max: 50, paso: 0.1, ayuda: 'Incremento de peso durante el embarazo' },
    { id: 'saludPancreatica', nombre: 'saludPancreatica', tipo: 'number', etiqueta: 'Salud Pancreática (puntuación)', requerido: false, min: 0, max: 100, paso: 1, ayuda: 'Puntuación del estado funcional del páncreas' },
    { id: 'funcionPulmonar', nombre: 'funcionPulmonar', tipo: 'number', etiqueta: 'Función Pulmonar (%)', requerido: false, min: 0, max: 100, paso: 1, ayuda: 'Capacidad respiratoria' },
    { id: 'nivelesEnzimasDigestivas', nombre: 'nivelesEnzimasDigestivas', tipo: 'number', etiqueta: 'Niveles de Enzimas Digestivas', requerido: false, min: 0, max: 200, paso: 1, ayuda: 'Concentración de enzimas digestivas' },
    { id: 'pesoNacimiento', nombre: 'pesoNacimiento', tipo: 'number', etiqueta: 'Peso al Nacer (gramos)', requerido: false, min: 500, max: 6000, paso: 1, ayuda: 'Peso del paciente al nacer' }
  ];

  secciones = [
    { titulo: 'Datos Personales', campos: ['edad'] },
    { titulo: 'Variables Clínicas Principales', campos: ['nivelesGlucosa', 'nivelesInsulina', 'indiceMasaCorporal', 'presionArterial', 'nivelesColesterol', 'circunferenciaCintura'] },
    { titulo: 'Factores de Riesgo', campos: ['marcadoresGeneticos', 'autoanticuerpos', 'antecedentesFamiliares', 'factoresAmbientales', 'etnicidad', 'habitosAlimenticios', 'actividadFisica', 'factoresSocioeconomicos', 'estadoTabaquismo', 'consumoAlcohol'] },
    { titulo: 'Pruebas Médicas', campos: ['pruebaToleranciaGlucosa', 'pruebaOrina'] },
    { titulo: 'Historial Médico', campos: ['historialEmbarazos', 'diabetesGestacionalPrevia', 'historialPcos', 'sintomasInicioTemprano', 'diagnosticoFibrosisQuistica', 'usoEsteroides'] },
    { titulo: 'Datos Adicionales', campos: ['aumentoPesoEmbarazo', 'saludPancreatica', 'funcionPulmonar', 'nivelesEnzimasDigestivas', 'pesoNacimiento'] }
  ];

  formModel: { [key: string]: string | number } = {};

  constructor(private apiService: ApiService, private renderer: Renderer2) {}

  async ngOnInit(): Promise<void> {
    try {
      const conexion = await this.apiService.verificarConexion();
      if (!conexion) {
        Utils.mostrarNotificacion('No se pudo conectar.', 'error');
      }

      await this.cargarTiposDiabetes();
      await this.cargarGuiasCampos();
      this.cargarEjemplo();

      Utils.mostrarNotificacion('Sistema cargado', 'success');
    } catch (error) {
      console.error('Error inicializando app:', error);
      Utils.mostrarNotificacion('Error al inicializar', 'error');
    }
  }

  async procesarFormulario(): Promise<void> {
    if (!this.formularioEvaluacion.nativeElement || !Utils.validarFormulario(this.formularioEvaluacion.nativeElement)) {
      return;
    }

    const datos: EvaluacionRequestDto = {};

    Object.entries(this.formModel).forEach(([key, value]) => {
      if (value !== '') {
        if (['nivelesInsulina', 'edad', 'indiceMasaCorporal', 'presionArterial', 'nivelesColesterol', 'circunferenciaCintura', 'nivelesGlucosa', 'aumentoPesoEmbarazo', 'saludPancreatica', 'funcionPulmonar', 'evaluacionesNeurologicas', 'nivelesEnzimasDigestivas', 'pesoNacimiento'].includes(key)) {
          datos[key as keyof EvaluacionRequestDto] = Number(value);
        } else {
          datos[key as keyof EvaluacionRequestDto] = value as string;
        }
      }
    });

    try {
      this.resultado = await this.apiService.realizarPrediccion(datos);
      this.cambiarSeccion('resultados');
    } catch (error) {
      console.error('procesando formulario:', error);
    }
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  limpiarFormulario(): void {
    this.formModel = {};
    Utils.mostrarNotificacion('Formulario limpiado', 'info');
  }

  cargarEjemplo(): void {
    this.formModel = {
      edad: 45,
      nivelesGlucosa: 180,
      nivelesInsulina: 35,
      indiceMasaCorporal: 28.5,
      presionArterial: 135,
      nivelesColesterol: 220,
      circunferenciaCintura: 95,
      marcadoresGeneticos: 'Negative',
      autoanticuerpos: 'Negative',
      antecedentesFamiliares: 'Yes',
      factoresAmbientales: 'Present',
      etnicidad: 'High Risk',
      habitosAlimenticios: 'Unhealthy',
      actividadFisica: 'Low',
      factoresSocioeconomicos: 'Medium',
      estadoTabaquismo: 'Non-Smoker',
      consumoAlcohol: 'Moderate',
      pruebaToleranciaGlucosa: 'Abnormal',
      pruebaOrina: 'Glucose Present',
      historialEmbarazos: 'Normal',
      diabetesGestacionalPrevia: 'No',
      historialPcos: 'No',
      sintomasInicioTemprano: 'No',
      diagnosticoFibrosisQuistica: 'No',
      usoEsteroides: 'No',
      aumentoPesoEmbarazo: 15,
      saludPancreatica: 65,
      funcionPulmonar: 85,
      nivelesEnzimasDigestivas: 45,
      pesoNacimiento: 3200
    };
    Utils.mostrarNotificacion('ejemplo cargado', 'info');
  }

  async cargarTiposDiabetes(): Promise<void> {
    try {
      this.tiposDiabetes = await this.apiService.obtenerTiposDiabetes();
    } catch (error) {
      console.error('Error tipos de diabetes:', error);
    }
  }

  async cargarGuiasCampos(): Promise<void> {
    try {
      this.guiasCampos = await this.apiService.obtenerGuiasCampos();
    } catch (error) {
      console.error('Error cargando guías:', error);
    }
  }

  mostrarDetallesTipo(tipo: TipoDiabetesInfoDto): void {
    this.selectedTipo = tipo;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.selectedTipo = null;
  }

  imprimir(): void {
    window.print();
  }

  guardarPDF(): void {
    Utils.mostrarNotificacion('Funcionalidad PDF en desarrollo', 'info');
  }

  formatFecha(fecha: string): string {
    return Utils.formatFecha(fecha);
  }

  formatPorcentaje(valor: number): string {
    return Utils.formatPorcentaje(valor);
  }
}
