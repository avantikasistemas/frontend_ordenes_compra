<template>
    <div class="form-container">
        <div class="header">
            <img :src="logo" :alt="logo">
            <h1>{{ mensaje }}</h1>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import logo from '@/assets/logo.png';
import apiUrl from "../../config.js";

const route = useRoute();
const id = route.params.id; // Captura el id de la URL
const accion = route.query.accion;
const mensaje = ref('');

// ✅ Función para cargar los datos de la orden de compra
const validarAnulacionOc = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/validar_anulacion_orden_compra`,
            { 
                id: parseInt(id),
                accion: parseInt(accion)
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            mensaje.value = response.data.message;
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};


// Código que se ejecuta al montar el componente
onMounted(() => {
    validarAnulacionOc();
});

</script>
  
<style scoped>
body {
    background-color: #f3f4f6;
    font-family: 'Roboto', sans-serif;
}

.main-content {
  padding: 20px;
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
    justify-content: center;
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
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    margin-bottom: 12px;
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

.btn-si {
    padding: 8px 16px;
    width: 100px;
    color: #ffffff;
    border: none;
    cursor: pointer;
    background-color: #00a50e;
    border-radius: 20px;
    transition: 0.3s;
}

.btn-si:hover {
    background-color: #00f35d;
}

.btn-no {
    padding: 8px 16px;
    width: 100px;
    color: #ffffff;
    border: none;
    cursor: pointer;
    background-color: #5e5e5e;
    border-radius: 20px;
    transition: 0.3s;
}

.btn-no:hover {
    background-color: #9b9b9b;
}

</style>