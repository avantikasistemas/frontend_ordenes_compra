<template>
  <div class="auth-container">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Procesando...</span>
      </div>
      <p class="mt-3">Procesando su solicitud...</p>
    </div>

    <div v-else class="result-box">
      <div v-if="success" class="alert alert-success">
        <h4 class="alert-heading">¡Proceso Realizado!</h4>
        <p>Favor cerrar esta ventana.</p>
      </div>
      <div v-else class="alert alert-danger">
        <h4 class="alert-heading">Error</h4>
        <p>{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import apiUrl from '../../config.js';

const route = useRoute();
const loading = ref(true);
const success = ref(false);
const errorMsg = ref('');

onMounted(async () => {
  const { oc, token, user } = route.query;

  if (!oc || !token || !user) {
    loading.value = false;
    errorMsg.value = 'Faltan parámetros en la URL.';
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/autorizar_oc`, {
      oc,
      token,
      user
    }, {
        headers: {
            Accept: "application/json"
        }
    });

    if (response.status === 200) {
        success.value = true;
    }
  } catch (error) {
    console.error(error);
    errorMsg.value = error.response?.data?.message || 'Error al procesar la autorización.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.result-box {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  text-align: center;
}
</style>
