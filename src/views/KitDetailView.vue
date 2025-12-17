<template>
  <div class="result-container">
    <h2 class="title" v-if="dataKit">
      Rentabilidad del Kit {{ dataKit.info?.codigo_consultado }}
    </h2>
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando detalles del kit...</p>
    </div>

    <div v-if="error" class="alert alert-danger mt-4" role="alert">
      {{ error }}
    </div>

    <div v-if="dataKit" class="content-wrapper">
      <div class="alert alert-info" role="alert">
        <strong>ORDEN:</strong> {{ oc }} &nbsp;|&nbsp; <strong>PEDIDO:</strong>
        {{ dataKit.info.pedido }} &nbsp;|&nbsp; <strong>KIT:</strong>
        {{ dataKit.info.codigo_kit }}
      </div>

      <h6 class="mb-3">Detalle del Kit en el Pedido</h6>

      <div class="table-responsive">
        <table class="table table-bordered table-hover custom-table">
          <thead class="table-header-kit">
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Descripción</th>
              <th class="text-right">Cant. Pedida</th>
              <th class="text-right">Cant. x Kit</th>
              <th class="text-right">Precio Venta Unit.</th>
              <th class="text-right">Costo Unitario</th>
              <th class="text-right">Costo Total</th>
              <th>Moneda Gen</th>
              <th class="text-right">Costo Total (Pesos)</th>
              <th class="text-right">Precio Venta Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="kitItem in dataKit.items" :key="kitItem.c">
              <td>{{ kitItem.c }}</td>
              <td>{{ kitItem.codigo }}</td>
              <td>{{ kitItem.descripcion }}</td>
              <td class="text-right">{{ kitItem.cantidad_ped }}</td>
              <td class="text-right">{{ kitItem.cantidad_x_kit }}</td>
              <td class="text-right">
                {{ formatCurrency(kitItem.valor_unit) }}
              </td>
              <td class="text-right">
                {{ formatCurrency(kitItem.costo_unit) }}
              </td>
              <td class="text-right">
                {{ formatCurrency(kitItem.costo_total) }}
              </td>
              <td>{{ kitItem.moneda }}</td>
              <td class="text-right">
                {{ formatCurrency(kitItem.costo_total_pesos) }}
              </td>
              <td class="text-right">
                {{ formatCurrency(kitItem.precio_venta_total) }}
              </td>
            </tr>
            <!-- Totales -->
            <tr class="table-total-kit">
              <td colspan="9" class="text-right">TOTALES:</td>
              <td class="text-right">
                {{ formatCurrency(dataKit.totales.costo_total_pesos) }}
              </td>
              <td class="text-right">
                {{ formatCurrency(dataKit.totales.precio_venta_total) }}
              </td>
            </tr>
            <tr class="table-total-kit">
              <td colspan="9" class="text-right">Rentabilidad Total Kit:</td>
              <td colspan="2" class="text-center">
                {{ dataKit.totales.rentabilidad.toFixed(0) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import apiUrl from "../../config.js";

const route = useRoute();

const oc = ref("");
const codigo = ref("");
const dolar = ref(0);
const euro = ref(0);

const dataKit = ref(null);
const loading = ref(false);
const error = ref("");

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "$0.00";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const fetchKitDetails = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await axios.post(
      `${apiUrl}/obtener_detalle_kit`,
      {
        oc: oc.value,
        codigo: codigo.value,
        dolar: dolar.value,
        euro: euro.value,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    if (response.status === 200) {
      dataKit.value = response.data.data;
    }
  } catch (err) {
    console.error(err);
    error.value =
      err.response?.data?.message || "Error al cargar los detalles del kit.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  oc.value = route.query.oc;
  codigo.value = route.query.codigo;
  dolar.value = parseFloat(route.query.dolar || 0);
  euro.value = parseFloat(route.query.euro || 0);

  if (oc.value && codigo.value) {
    fetchKitDetails();
  } else {
    error.value = "Faltan parámetros requeridos (oc, codigo).";
  }
});
</script>

<style scoped>
.result-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  min-height: 100vh; /* Ocupa toda la altura para que no se vea cortado si es poco contenido */
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.custom-table {
  width: 100%;
  font-size: 0.9rem;
}

.custom-table th,
.custom-table td {
  vertical-align: middle;
  padding: 8px;
}

.table-header-kit {
  background-color: #f8f9fa;
  font-weight: bold;
}

.table-total-kit {
  background-color: #e9ecef;
  font-weight: bold;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}
</style>
