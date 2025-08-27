<template>
    <LayoutView>
        <div class="form-container">
            <div class="card">
                <!-- Logo -->
                <img :src="logotipo" alt="logotipo" class="logotipo" />

                <!-- Texto principal -->
                <h2 class="title">FORMATO ÓRDENES DE COMPRA {{ nombre }}</h2>

                <!-- Radio buttons en fila -->
                <div class="radio-row">
                  <label>
                    <input type="radio" value="1" v-model="tipoOc" @change="tipoOcChanged(tipoOc)" /> Nacional
                  </label>
                  <label>
                    <input type="radio" value="2" v-model="tipoOc" @change="tipoOcChanged(tipoOc)" /> Exterior
                  </label>
                </div>

                <!-- Cuadro interno -->
                <form @submit.prevent="buscarOcNacional">
                    <div class="input-section">
                        <label class="input-label">Ingrese número de oc:</label>
                        <input
                            type="number"
                            v-model="oc"
                            class="input-box"
                            placeholder="Número de OC"
                        />
                        <p v-if="error" class="error-text">{{ error }}</p>
                        <label class="input-label">Ingrese tasa:</label>
                        <input type="number" v-model="tasa" class="input-box" placeholder="Tasa" />
                        <p v-if="error" class="error-text">{{ error }}</p>

                        <label class="input-label">Ingrese factor:</label>
                        <input type="number" v-model="factor" class="input-box" placeholder="Factor" />
                        <p v-if="error" class="error-text">{{ error }}</p>
                    </div>
            
                    <!-- Botones -->
                    <div class="buttons">
                    <button
                        class="btn btn-buscar"
                        :disabled="cargando"
                    >
                        {{ cargando ? 'Buscando...' : 'Buscar' }}
                    </button>
                    <button @click.prevent="limpiar" class="btn btn-limpiar">Limpiar</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="data_response_oc">
            <h6 style="justify-self: center;">FORMATO PARA ELABORAR ORDENES DE COMPRA {{ nombre_titulo }}</h6>
            <div style="display: flex;">
              <strong>Fecha:&nbsp;</strong> {{ data_response_oc.fecha_formateada }}&nbsp;&nbsp;-&nbsp;OC{{oc}}&nbsp;&nbsp;<strong>Moneda OC:&nbsp;</strong>{{ data_response_oc.nombre_moneda }} - {{ data_response_oc.tasav }}
            </div>
            <div style="display: flex;">
              <strong>Proveedor:&nbsp;</strong> {{ data_response_oc.data_tercero.nombres }}&nbsp;-&nbsp;{{ data_response_oc.data_tercero.ciudad }}&nbsp;&nbsp;<strong>Teléfono:</strong>&nbsp;{{ data_response_oc.data_tercero.telefono_1 }}
            </div>
            <div style="display: flex;">
              <strong>Condición de Pago Proveedor:&nbsp;</strong> {{ data_response_oc.condicion_tercero }}
            </div>
            <div style="display: flex;">
              <strong>Condición de pago de esta orden de compra:&nbsp;</strong> {{ data_response_oc.condicion_orden }}
            </div>

            <table class="custom-table">
              <thead>
                <tr>
                  <th rowspan="2">Item</th>
                  <th rowspan="2">Código</th>
                  <th rowspan="2">Observación</th>
                  <th rowspan="2">Cantidad a Comprar</th>
                  <th rowspan="2">Cantidad Pedida</th>
                  <th rowspan="2">Stock Disponible</th>
                  <th rowspan="2">Backorder Disponible</th>
                  <th rowspan="2">Descripción</th>
                  <th rowspan="2">Marca</th>
                  <th rowspan="2">Presentación</th>
                  <th colspan="3">Valores antes de IVA</th>
                  <th rowspan="2">% Utilidad</th>
                  <th rowspan="2">KIT</th>
                  <th rowspan="2">Cliente</th>
                  <th rowspan="2">Ciudad</th>
                  <th rowspan="2">Fecha Compromiso</th>
                  <th rowspan="2">Costo Total por Item</th>
                  <th rowspan="2">Precio Total por Item</th>
                </tr>
                <tr>
                  <th>Costo Cotizado</th>
                  <th>Costo Unitario a Comprar</th>
                  <th>Precio Venta Unitario</th>
                </tr>
              </thead>
              <tbody>
                <!-- Aquí van tus filas dinámicas -->
              </tbody>
            </table>


        </div>


        <!-- Modal de éxito -->
        <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exitoModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>{{ msg }}</p>                    
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de error -->
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="errorModalLabel">Error</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      {{ errorMsg }}
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  </div>
              </div>
          </div>
        </div>
    
        <!-- Overlay de carga -->
        <div v-if="loading" class="loading-overlay">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden"></span>
            </div>
            <p class="mt-2 text-light">{{ loading_msg }}</p>
        </div>
    </LayoutView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LayoutView from '../views/Layouts/LayoutView.vue';
import axios from 'axios';
import { Modal } from 'bootstrap';
import logotipo from '@/assets/logotipo.png';
import apiUrl from "../../config.js";

const oc = ref('');
const tasa = ref(5000);
const factor = ref(1.00);

const msg = ref('');
const error = ref('');
const errorMsg = ref('');
const modalTitle = ref('');
const cargando = ref(false);

const modalInstance = ref(null);
const modalErrorInstance = ref(null);

const loading = ref(false);
const loading_msg = ref('');
const tipoOc = ref(1); // Por defecto nacional
const nombre = ref('NACIONAL');
const nombre_titulo = ref('PROVEEDORES NACIONALES');

const data_response_oc = ref(null);

const buscarOcNacional = async () => {
    try {
      if (oc.value == ''){
        alert('Por favor ingrese un número de orden de compra.');
        return;
      }

      loading.value = true;
      loading_msg.value = 'Buscando...';
      const response = await axios.post(
          `${apiUrl}/buscar_oc_nacional`, 
          {
                oc: oc.value,
                tasa: tasa.value,
                factor: factor.value,
                tipo_oc: tipoOc.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        if (response.status === 200) {
            data_response_oc.value = response.data.data;
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    } finally {
        loading.value = false;
    }
};

const limpiar = () => {
  oc.value = '';
  tasa.value = 5000;
  factor.value = 1.00;
}

const tipoOcChanged = (tipoOc) => {
  if (tipoOc === 1 || tipoOc === "1") {
    nombre.value = 'NACIONAL';
    nombre_titulo.value = 'PROVEEDORES NACIONALES';
  } else if (tipoOc === 2 || tipoOc === "2") {
    nombre.value = 'EXTERIOR';
    nombre_titulo.value = 'PROVEEDORES DEL EXTERIOR';
  }
};

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
});

</script>

<style scoped>
body {
    background-color: #f3f4f6;
    font-family: 'Roboto', sans-serif;
}

:deep(.main-content) {
  padding: 0 !important;
}

.form-container {
    position: sticky;
    top: 0;
    background-color: #ffffff; /* Asegura que el fondo sea sólido */
    z-index: 1000; /* Para que esté por encima del contenido al hacer scroll */
    padding: 16px;
    border-bottom: 2px solid #e5e7eb; /* Línea divisoria */
    width: 100%;
    display: flex;
    flex-direction: column; /* Asegura que los elementos internos se acomoden verticalmente */
    align-self: center;
}

.card {
  width: 320px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-self: center;
}

.logotipo {
  display: block;
  margin: 0 auto 10px;
  width: 150px;
  height: auto;
}

.title {
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.radio-row {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  align-items: center;
}

.radio-row label {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-section {
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}

.input-box {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #bbb;
  border-radius: 4px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-buscar {
  background-color: #ffd95e;
  color: black;
}

.btn-buscar:hover {
  background-color: #ffd343;
  color: white;
}

.btn-limpiar {
  background-color: #940404;
  color: white;
}

.btn-limpiar:hover {
  background-color: #f84f4f;
  color: white;
}

.error-text {
  color: red;
  font-size: 13px;
  margin-top: 6px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  text-align: left;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  border-radius: 8px;
  overflow: hidden;
}

.custom-table thead th {
  background-color: #f4f6f8;
  color: #374151;
  font-weight: 600;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
}

.custom-table thead tr:first-child th {
  text-align: center;
}

.custom-table tbody td {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  color: #111827;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

.custom-table tbody tr:hover {
  background-color: #eef2f7;
  transition: background 0.2s ease-in-out;
}

</style>