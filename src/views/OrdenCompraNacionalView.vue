<template>
    <div class="form-container">
        <div class="header">
            <img :src="logo" :alt="logo">
            <h1>SOLICITUD DE APROBACIÓN DE ORDENES DE COMPRA</h1>
        </div>
        <div class="form-section">
            <div class="form-grid">
                <div>
                    <label for="oc_nac">Orden de Compra Nacional :</label>
                    <input type="number" id="oc_nac" class="form-control" v-model="oc_nac">
                </div>
                <div>
                    <label for="tasa_dolar">Tasa Dolar:</label>
                    <input type="number" id="tasa_dolar" class="form-control" v-model="tasa_dolar">
                </div>
                <div>
                    <label for="oc_ext">Orden de Compra Exterior:</label>
                    <input type="number" id="oc_ext" class="form-control" v-model="oc_ext">
                </div>
                <div>
                    <label for="factor">Factor Dolar/Euro:</label>
                    <input type="number" id="factor" class="form-control" v-model="factor">
                </div>
 

            </div>
        </div>
        <div class="buttons">
            <button class="consultar">Consultar</button>
            <button class="restablecer" @click="resetForm">Restablecer</button>
        </div>   
    </div>
</template>
  
<script setup>
import { ref } from "vue";
import logo from '@/assets/logo.png';

const oc_nac = ref("");
const tasa_dolar = ref("5000");
const oc_ext = ref("");
const factor = ref("1.00");

const resetForm = () => {
    oc.value = "1234";
    dolar4.value = "5000";
    factor.value = "1.00";
};
</script>
  
<style scoped>

body {
    background-color: #f3f4f6;
    font-family: 'Roboto', sans-serif;
}

.form-container {
    width: 50%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #ffffff;
    padding: 32px;
    border-bottom: 2px solid #e5e7eb;
    display: flex;
    flex-direction: column;
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
.form-section {
    border: 1px solid #e5e7eb;
    padding: 8px;
    margin-bottom: 0;
}
.form-section h2 {
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 6px;
}
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}
@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
@media (min-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr 1fr;
    }
}
@media (min-width: 1024px) {
    .form-grid {
        grid-template-columns: 1fr 1fr;
    }
}
.form-grid label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 2px;
}
.form-grid input,
.form-grid select {
    width: 100%;
    border: 1px solid #e5e7eb;
    padding: 8px;
    font-size: 0.9rem; /* Hacer la fuente más pequeña */
    height: 35px; /* Reducir la altura */
}

.form-grid select {
    height: 32px;
}

.buttons {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}
.buttons button {
    padding: 8px 16px;
    color: #ffffff;
    border: none;
    cursor: pointer;
}
.buttons .consultar {
    background-color: #ffc300;
    border-radius: 20px;
}
.buttons .consultar:hover {
    background-color: #ffd858;
}
.buttons .restablecer {
    background-color: #9b3460;
    border-radius: 20px;
}
.buttons .restablecer:hover {
    background-color: #cf3476;
}
  
</style>
  