import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  PacienteDto,
  EvaluacionRequestDto,
  PrediccionResponseDto,
  TipoDiabetesInfoDto,
  GuiaCampoDto
} from '../models/types';
import { Utils } from './utils';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = '/api';  // Usa el proxy configurado en proxy.conf.json
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              Utils.mostrarNotificacion('Error en los datos enviados', 'error');
              break;
            case 401:
              Utils.mostrarNotificacion('No autorizado', 'error');
              break;
            case 404:
              Utils.mostrarNotificacion('Recurso no encontrado', 'error');
              break;
            case 500:
              Utils.mostrarNotificacion('Error del servidor', 'error');
              break;
            default:
              Utils.mostrarNotificacion('Error de conexión', 'error');
          }
        } else if (error.request) {
          Utils.mostrarNotificacion('No se pudo conectar al servidor', 'error');
        }
        return Promise.reject(error);
      }
    );
  }

  // ========== PREDICCIONES ==========
  async realizarPrediccion(datos: EvaluacionRequestDto): Promise<PrediccionResponseDto> {
    try {
      const loader = Utils.mostrarLoader('Realizando predicción...');
      const response: AxiosResponse<PrediccionResponseDto> = await this.api.post('/evaluaciones/predecir', datos);
      Utils.ocultarLoader(loader);
      Utils.mostrarNotificacion('Predicción completada exitosamente', 'success');
      return response.data;
    } catch (error) {
      Utils.mostrarNotificacion('Error al realizar la predicción', 'error');
      throw error;
    }
  }

  // ========== PACIENTES ==========
  async registrarPaciente(paciente: PacienteDto): Promise<PacienteDto> {
    try {
      const response: AxiosResponse<PacienteDto> = await this.api.post('/pacientes/registrar', paciente);
      Utils.mostrarNotificacion('Paciente registrado exitosamente', 'success');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async obtenerPacientes(): Promise<PacienteDto[]> {
    try {
      const response: AxiosResponse<PacienteDto[]> = await this.api.get('/pacientes/listar');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async buscarPacientePorCodigo(codigo: string): Promise<PacienteDto> {
    try {
      const response: AxiosResponse<PacienteDto> = await this.api.get(`/pacientes/codigo/${codigo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ========== TIPOS DE DIABETES ==========
  async obtenerTiposDiabetes(): Promise<TipoDiabetesInfoDto[]> {
    try {
      const response: AxiosResponse<TipoDiabetesInfoDto[]> = await this.api.get('/tipos-diabetes/listar');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async obtenerTipoPorNombre(nombreEn: string): Promise<TipoDiabetesInfoDto> {
    try {
      const response: AxiosResponse<TipoDiabetesInfoDto> = await this.api.get(`/tipos-diabetes/nombre/${encodeURIComponent(nombreEn)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async obtenerTiposComunes(): Promise<TipoDiabetesInfoDto[]> {
    try {
      const response: AxiosResponse<TipoDiabetesInfoDto[]> = await this.api.get('/tipos-diabetes/comunes');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ========== GUÍAS DE CAMPOS ==========
  async obtenerGuiasCampos(): Promise<GuiaCampoDto[]> {
    try {
      const response: AxiosResponse<GuiaCampoDto[]> = await this.api.get('/guias-campos/listar');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async obtenerGuiaPorCampo(nombreCampo: string): Promise<GuiaCampoDto> {
    try {
      const response: AxiosResponse<GuiaCampoDto> = await this.api.get(`/guias-campos/campo/${encodeURIComponent(nombreCampo)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ========== EVALUACIONES ==========
  async obtenerEvaluacionesPorPaciente(idPaciente: number): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await this.api.get(`/evaluaciones/paciente/${idPaciente}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async obtenerEstadisticas(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.get('/evaluaciones/estadisticas');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ========== UTILIDADES ==========
  async verificarConexion(): Promise<boolean> {
    try {
      await this.api.get('/pacientes/listar');
      return true;
    } catch (error) {
      return false;
    }
  }
}
