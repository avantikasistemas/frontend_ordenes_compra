<template>
    <LayoutView>
        <div class="form-container">

            <div class="card">
                <!-- Logo -->
                <img :src="logotipo" alt="logotipo" class="logotipo" />

                <!-- Texto principal -->
                <h2 class="title">FORMATO ÓRDENES DE COMPRA NACIONAL</h2>

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
const errorMsg = ref('');
const modalTitle = ref('');

const modalInstance = ref(null);
const modalErrorInstance = ref(null);

const loading = ref(false);
const loading_msg = ref('');

const buscarOcNacional = async () => {
    try {
        loading.value = true;
        loading_msg.value = 'Buscando...';
        const response = await axios.post(
            `${apiUrl}/buscar_oc_nacional`, 
            {
                oc: oc.value,
                tasa: tasa.value,
                factor: factor.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        if (response.status === 200) {
            console.log(response.data.data);
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
</style>