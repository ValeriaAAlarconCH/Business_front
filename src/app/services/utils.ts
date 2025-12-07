export class Utils {
  // Formatear fecha
  static formatFecha(fecha: string | Date): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Formatear porcentaje
  static formatPorcentaje(valor: number): string {
    return `${(valor * 100).toFixed(1)}%`;
  }

  // Validar email
  static validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Validar teléfono
  static validarTelefono(telefono: string): boolean {
    const regex = /^[0-9\s\+\-\(\)]{7,15}$/;
    return regex.test(telefono);
  }

  // Generar ID único
  static generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Capitalizar texto
  static capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  // Limpiar texto para URL
  static slugify(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Mostrar notificación
  static mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info' = 'info', duracion: number = 5000): void {
    const contenedor = document.getElementById('notificaciones') || this.crearContenedorNotificaciones();

    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
      <div class="notificacion-contenido">
        <span class="notificacion-mensaje">${mensaje}</span>
        <button class="notificacion-cerrar">&times;</button>
      </div>
    `;

    contenedor.appendChild(notificacion);

    // Auto-eliminar después de la duración
    setTimeout(() => {
      if (notificacion.parentElement) {
        notificacion.classList.add('notificacion-desapareciendo');
        setTimeout(() => notificacion.remove(), 300);
      }
    }, duracion);

    // Evento para cerrar manualmente
    notificacion.querySelector('.notificacion-cerrar')?.addEventListener('click', () => {
      notificacion.classList.add('notificacion-desapareciendo');
      setTimeout(() => notificacion.remove(), 300);
    });
  }

  private static crearContenedorNotificaciones(): HTMLElement {
    const contenedor = document.createElement('div');
    contenedor.id = 'notificaciones';
    contenedor.className = 'notificaciones-contenedor';
    document.body.appendChild(contenedor);
    return contenedor;
  }

  // Mostrar loader
  static mostrarLoader(texto: string = 'Cargando...'): HTMLDivElement {
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = `
      <div class="loader-contenido">
        <div class="loader-spinner"></div>
        <p class="loader-text">${texto}</p>
      </div>
    `;
    document.body.appendChild(loader);
    return loader;
  }

  // Ocultar loader
  static ocultarLoader(loader: HTMLDivElement): void {
    if (loader && loader.parentElement) {
      loader.classList.add('loader-ocultando');
      setTimeout(() => loader.remove(), 300);
    }
  }

  // Validar formulario
  static validarFormulario(formulario: HTMLFormElement): boolean {
    const campos = formulario.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]');
    let valido = true;

    campos.forEach(campo => {
      campo.classList.remove('error');

      if (!campo.value.trim()) {
        campo.classList.add('error');
        this.mostrarErrorCampo(campo, 'Este campo es requerido');
        valido = false;
      } else if (campo instanceof HTMLInputElement && campo.type === 'email' && !this.validarEmail(campo.value)) {
        campo.classList.add('error');
        this.mostrarErrorCampo(campo, 'Email inválido');
        valido = false;
      } else if (campo instanceof HTMLInputElement && campo.type === 'number') {
        const valor = parseFloat(campo.value);
        const min = parseFloat(campo.min);
        const max = parseFloat(campo.max);

        if (!isNaN(min) && valor < min) {
          campo.classList.add('error');
          this.mostrarErrorCampo(campo, `El valor mínimo es ${min}`);
          valido = false;
        } else if (!isNaN(max) && valor > max) {
          campo.classList.add('error');
          this.mostrarErrorCampo(campo, `El valor máximo es ${max}`);
          valido = false;
        }
      }
    });

    return valido;
  }

  private static mostrarErrorCampo(campo: HTMLElement, mensaje: string): void {
    // Remover error anterior
    const errorAnterior = campo.parentElement?.querySelector('.error-mensaje');
    if (errorAnterior) errorAnterior.remove();

    // Crear nuevo mensaje de error
    const error = document.createElement('div');
    error.className = 'error-mensaje';
    error.textContent = mensaje;

    const contenedor = campo.parentElement || campo;
    contenedor.appendChild(error);
  }
}
