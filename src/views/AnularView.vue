<template>
    <LayoutView>
        <div class="form-container">
            <div class="header">
                <img :src="logo" :alt="logo">
                <h1>ANULACIÓN DE ORDENES DE COMPRA</h1>
            </div>
        </div>

        <form @submit.prevent="peticionAnular">
            <div class="seguimiento-row">
                <div>
                    <label for="usuario">Usuario:</label>
                    <select id="usuario" v-model="usuario" class="form-select seguimiento-select">
                        <option value=null>Seleccione usuario</option>
                        <option value="JARAUJO">JARAUJO</option>
                        <option value="MMIRANDA">MMIRANDA</option>
                        <option value="NFERNANDEZ">NFERNANDEZ</option>
                        <option value="NMERCADO">NMERCADO</option>
                        <option value="PCARBONELL">PCARBONELL</option>
                        <option value="RODRIGUEZC">RODRIGUEZC</option>
                        <option value="YORDONEZ">YORDONEZ</option>
                    </select>
                </div>
                <div>
                    <label for="oc">Número OC:</label>
                    <input type="text" id="oc" v-model="oc" class="form-control" placeholder="Ingrese el número de OC">
                </div>
                <div>
                    <label for="motivo">Motivo:</label>
                    <textarea id="motivo" v-model="motivo" class="form-control" placeholder="Ingrese el motivo de la anulación"></textarea>
                </div>
                <button class="anular">Anular</button>
            </div>
        </form>

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
import logo from '@/assets/logo.png';
import apiUrl from "../../config.js";

const oc = ref("");
const usuario = ref(null);
const motivo = ref('');

const modalTitle = ref('');
const modalInstance = ref(null);
const modalErrorInstance = ref(null);

const msg = ref('');
const errorMsg = ref('');

const loading = ref(false);
const loading_msg = ref('');

// Función para anular la orden de compra
const peticionAnular = async () => {
    loading.value = true;
    loading_msg.value = 'Enviando petición de anulación de orden de compra. ';
    try {
        const response = await axios.post(
            `${apiUrl}/peticion_anular_orden_compra`, 
            { 
                oc: oc.value,
                usuario: usuario.value,
                comentario: motivo.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            modalTitle.value = 'Información';
            msg.value = response.data.message;
            modalInstance.value.show();
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    } finally {
        loading.value = false;
    }
}

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
//   cargarDatos();
});

</script>
  
<style scoped>
body {
    background-color: #f3f4f6;
    font-family: 'Roboto', sans-serif;
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

.header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}
.header img {
    margin-right: 8px;
    width: 32px; 
    height: 32px;
}
.header h1 {
    font-size: 1.25rem;
    font-weight: bold;
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

.seguimiento-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    margin-bottom: 12px;
}

.seguimiento-row textarea{
    width: 700px;
}

.seguimiento-select {
    min-width: 160px;
    max-width: 180px;
}

.error-text {
  color: red;
  font-size: 13px;
  margin-top: 6px;
}

.anular {
    padding: 8px 16px;
    color: #ffffff;
    border: none;
    cursor: pointer;
    background-color: #9b3460;
    border-radius: 20px;
    transition: 0.3s;
}

.anular:hover {
    background-color: #cf3476;
}

</style>