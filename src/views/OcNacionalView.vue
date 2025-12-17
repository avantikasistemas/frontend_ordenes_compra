<template>
  <LayoutView>
    <div class="form-container">
      <!-- Acordeón -->
      <div class="accordion" id="accordionBusqueda">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingBusqueda">
            <button
              class="accordion-button"
              :class="{ collapsed: !acordeonAbierto }"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseBusqueda"
              :aria-expanded="acordeonAbierto"
              aria-controls="collapseBusqueda"
            >
              <strong>🔍 Búsqueda de Orden de Compra</strong>
            </button>
          </h2>
          <div
            id="collapseBusqueda"
            class="accordion-collapse collapse"
            :class="{ show: acordeonAbierto }"
            aria-labelledby="headingBusqueda"
            data-bs-parent="#accordionBusqueda"
            ref="collapseElement"
          >
            <div class="accordion-body">
              <div class="card">
                <!-- Logo -->
                <img :src="logotipo" alt="logotipo" class="logotipo" />

                <!-- Texto principal -->
                <h2 class="title">FORMATO ÓRDENES DE COMPRA {{ nombre }}</h2>

                <!-- Radio buttons en fila -->
                <div class="radio-row">
                  <label>
                    <input
                      type="radio"
                      value="1"
                      v-model="tipoOc"
                      @change="tipoOcChanged(tipoOc)"
                    />
                    Nacional
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="2"
                      v-model="tipoOc"
                      @change="tipoOcChanged(tipoOc)"
                    />
                    Exterior
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
                    <input
                      type="number"
                      v-model="tasa"
                      class="input-box"
                      placeholder="Tasa"
                    />
                    <p v-if="error" class="error-text">{{ error }}</p>

                    <label class="input-label">Ingrese factor:</label>
                    <input
                      type="number"
                      v-model="factor"
                      class="input-box"
                      placeholder="Factor"
                    />
                    <p v-if="error" class="error-text">{{ error }}</p>
                  </div>

                  <!-- Botones -->
                  <div class="buttons">
                    <button class="btn btn-buscar" :disabled="cargando">
                      {{ cargando ? "Buscando..." : "Buscar" }}
                    </button>
                    <button @click.prevent="limpiar" class="btn btn-limpiar">
                      Limpiar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="data_response_oc" class="resultado-container">
      <h6 style="text-align: center; margin-bottom: 20px; font-weight: bold">
        FORMATO PARA ELABORAR ORDENES DE COMPRA {{ nombre_titulo }}
      </h6>

      <div class="info-header">
        <div class="info-row">
          <strong>Fecha:&nbsp;</strong>
          {{ data_response_oc.fecha_formateada }}&nbsp;&nbsp;-&nbsp;
          <strong>OC{{ data_response_oc.oc }}</strong
          >&nbsp;&nbsp;&nbsp;&nbsp; <strong>Moneda OC:&nbsp;</strong
          >{{ data_response_oc.nombre_moneda }} -
          {{ data_response_oc.tasav_formateado }}
        </div>
        <div class="info-row">
          <strong>Proveedor:&nbsp;</strong>
          {{ data_response_oc.data_tercero.nombres }}&nbsp;-&nbsp;{{
            data_response_oc.data_tercero.ciudad
          }}&nbsp;&nbsp;&nbsp;&nbsp; <strong>Teléfono:&nbsp;</strong
          >{{ data_response_oc.data_tercero.telefono_1 }}
        </div>
        <div class="info-row">
          <strong>Condición de Pago Proveedor:&nbsp;</strong>
          {{ data_response_oc.condicion_tercero }}
        </div>
        <div class="info-row">
          <strong>Condición de pago de esta orden de compra:&nbsp;</strong>
          {{ data_response_oc.condicion_orden }}
        </div>
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
          <tr v-for="(item, index) in data_response_oc.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.codigo }}</td>
            <td>{{ item.nota || "" }}</td>
            <td :class="{ 'cantidad-conflicto': item.cantidad_conflictiva }">
              {{ item.cantidad }}
            </td>
            <td>{{ item.pedidoc }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.otras_oc }}</td>
            <td>{{ item.descripcion }}</td>
            <td>{{ item.marca }}</td>
            <td>{{ item.und }}</td>
            <td class="text-right">{{ formatCurrency(item.costo) }}</td>
            <td class="text-right">{{ formatCurrency(item.vlr_unit) }}</td>
            <td class="text-right">{{ formatCurrency(item.valor_item) }}</td>
            <td class="text-right">{{ item.utilidad }}%</td>
            <td class="text-center">
              <a href="#" @click.prevent="abrirModalKit(item)" class="link-kit">
                <img
                  src="https://img.icons8.com/material-outlined/16/000000/search.png"
                  alt="Revisar"
                />
                Revisar
              </a>
            </td>
            <td>{{ item.cliente }}</td>
            <td>{{ item.ciudad }}</td>
            <td>{{ item.fecha_entrega }}</td>
            <td class="text-right">
              {{ formatCurrency(item.costo_total_item) }}
            </td>
            <td class="text-right">
              {{ formatCurrency(item.precio_total_item) }}
            </td>
          </tr>

          <!-- Totales -->
          <tr class="totales-row">
            <td colspan="18" class="text-right">
              <strong>Total Costo:</strong>
            </td>
            <td class="text-right">
              <strong>{{
                formatCurrency(data_response_oc.totales.costotal)
              }}</strong>
            </td>
            <td></td>
          </tr>
          <tr class="totales-row">
            <td colspan="18" class="text-right">
              <strong>Total Precio:</strong>
            </td>
            <td class="text-right">
              <strong>{{
                formatCurrency(data_response_oc.totales.totalprecio)
              }}</strong>
            </td>
            <td></td>
          </tr>
          <tr class="totales-row utilidad-total">
            <td colspan="18" class="text-right">
              <strong>Utilidad Total:</strong>
            </td>
            <td class="text-right">
              <h2 style="margin: 0; color: #2c5282">
                <strong>{{ data_response_oc.totales.utilidadtotal }}%</strong>
              </h2>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <!-- Sección de autorización -->
      <div class="autorizacion-section">
        <div v-if="data_response_oc.usuario_oc" class="usuario-info">
          <strong>Elaborado por:</strong>
          {{ data_response_oc.usuario_oc.des_usuario }} / Negociador
        </div>

        <div class="comentarios-section">
          <label for="comentarios"><strong>Comentarios:</strong></label>
          <textarea
            id="comentarios"
            v-model="comentarios"
            rows="5"
            cols="50"
            class="form-control"
          ></textarea>
        </div>

        <button
          @click="solicitarAutorizacion"
          class="btn btn-autorizacion"
          :disabled="enviandoAutorizacion"
        >
          {{ enviandoAutorizacion ? "Enviando..." : "Solicitar Autorización" }}
        </button>
      </div>

      <!-- Historial de autorizaciones -->
      <div
        v-if="
          data_response_oc.autorizaciones &&
          data_response_oc.autorizaciones.length > 0
        "
        class="historial-section"
      >
        <h6 style="text-align: center; margin-top: 30px; margin-bottom: 15px">
          <strong>Historial de Autorizaciones</strong>
        </h6>
        <table class="custom-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>O.C</th>
              <th>Autorización</th>
              <th>Equipo</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Valor Orden con IVA</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(auth, index) in data_response_oc.autorizaciones"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ auth.numero }}</td>
              <td>{{ auth.autorizacion }}</td>
              <td>{{ auth.equipo }}</td>
              <td>{{ auth.usuario }}</td>
              <td>{{ formatDate(auth.fecha) }}</td>
              <td class="text-right">{{ formatCurrency(auth.valor_total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalle de Kit -->
    <div
      class="modal fade"
      id="kitModal"
      tabindex="-1"
      aria-labelledby="kitModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      ref="kitModal"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered"
        style="max-width: 90%"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="kitModalLabel">
              Rentabilidad del Kit {{ dataKit?.info?.codigo_consultado ? dataKit.info.codigo_consultado : '' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="dataKit">
            <div class="alert alert-info" role="alert">
              <strong>ORDEN:</strong> {{ oc }} &nbsp;|&nbsp;
              <strong>PEDIDO:</strong> {{ dataKit.info.pedido }} &nbsp;|&nbsp;
              <strong>KIT:</strong> {{ dataKit.info.codigo_kit }}
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
                    <td colspan="9" class="text-right">
                      Rentabilidad Total Kit:
                    </td>
                    <td colspan="2" class="text-center">
                      {{ dataKit.totales.rentabilidad.toFixed(0) }}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-body" v-else>
            <div class="d-flex justify-content-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de éxito -->
    <div
      class="modal fade"
      id="exitoModal"
      tabindex="-1"
      aria-labelledby="exitoModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      ref="exitoModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exitoModalLabel">{{ modalTitle }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ msg }}</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de error -->
    <div
      class="modal fade"
      id="errorModal"
      tabindex="-1"
      aria-labelledby="errorModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      ref="errorModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="errorModalLabel">Error</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {{ errorMsg }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
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
import { ref, onMounted } from "vue";
import LayoutView from "../views/Layouts/LayoutView.vue";
import axios from "axios";
import { Modal } from "bootstrap";
import logotipo from "@/assets/logotipo.png";
import apiUrl from "../../config.js";

const oc = ref("");
const tasa = ref(5000);
const factor = ref(1.0);

const msg = ref("");
const error = ref("");
const errorMsg = ref("");
const modalTitle = ref("");
const cargando = ref(false);

const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const modalKitInstance = ref(null);
const kitModal = ref(null);

const loading = ref(false);
const loading_msg = ref("");
const tipoOc = ref(1); // Por defecto nacional
const nombre = ref("NACIONAL");
const nombre_titulo = ref("PROVEEDORES NACIONALES");

const data_response_oc = ref(null);
const comentarios = ref("");
const enviandoAutorizacion = ref(false);
const acordeonAbierto = ref(true);
const collapseElement = ref(null);

const dataKit = ref(null);

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "$0.00";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const buscarOcNacional = async () => {
  try {
    if (oc.value == "") {
      alert("Por favor ingrese un número de orden de compra.");
      return;
    }

    loading.value = true;
    loading_msg.value = "Buscando...";
    const response = await axios.post(
      `${apiUrl}/buscar_oc_nacional`,
      {
        oc: oc.value,
        tasa: tasa.value,
        factor: factor.value,
        tipo_oc: tipoOc.value,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      data_response_oc.value = response.data.data;
      // Cerrar el acordeón cuando hay resultados
      acordeonAbierto.value = false;
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
  oc.value = "";
  tasa.value = 5000;
  factor.value = 1.0;
  data_response_oc.value = null;
  acordeonAbierto.value = true;
};

const solicitarAutorizacion = async () => {
  if (!comentarios.value.trim()) {
    alert("Por favor ingrese un comentario.");
    return;
  }

  const confirmar =
    data_response_oc.value.conf === 1
      ? confirm(
          "Existen diferencias en las Cantidades Pedidas. ¿Desea Continuar?"
        )
      : confirm("¿Estás seguro de enviar este formulario?");

  if (!confirmar) return;

  try {
    enviandoAutorizacion.value = true;
    loading.value = true;
    loading_msg.value = "Enviando solicitud...";

    const response = await axios.post(
      `${apiUrl}/solicitar_autorizacion`,
      {
        oc: data_response_oc.value.oc,
        dolar: data_response_oc.value.tasa,
        euro: data_response_oc.value.euro3,
        usuario: data_response_oc.value.usuario_oc.usuario,
        comentario: comentarios.value,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      modalInstance.value.show();
      msg.value = "Solicitud de autorización enviada correctamente.";
      modalTitle.value = "Éxito";
      comentarios.value = "";
      // Recargar los datos para ver la nueva autorización
      await buscarOcNacional();
    }
  } catch (error) {
    console.error(error);
    modalErrorInstance.value.show();
    errorMsg.value =
      error.response?.data?.message || "Error al enviar la solicitud.";
  } finally {
    enviandoAutorizacion.value = false;
    loading.value = false;
  }
};

const abrirModalKit = async (item) => {
  dataKit.value = null;
  modalKitInstance.value.show();

  try {
    const response = await axios.post(
      `${apiUrl}/obtener_detalle_kit`,
      {
        oc: oc.value,
        codigo: item.codigo,
        dolar: tasa.value, // Usamos la tasa actual de la vista
        euro: tasa.value * factor.value,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    if (response.status === 200) {
      dataKit.value = response.data.data;
    }
  } catch (error) {
    console.error(error);
    // Podríamos cerrar el modal o mostrar un error en él
    alert("Error al cargar detalles del kit.");
  }
};

const tipoOcChanged = (tipoOc) => {
  if (tipoOc === 1 || tipoOc === "1") {
    nombre.value = "NACIONAL";
    nombre_titulo.value = "PROVEEDORES NACIONALES";
  } else if (tipoOc === 2 || tipoOc === "2") {
    nombre.value = "EXTERIOR";
    nombre_titulo.value = "PROVEEDORES DEL EXTERIOR";
  }
};

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
  modalKitInstance.value = new Modal(kitModal.value);
});
</script>

<style scoped>
body {
  background-color: #f3f4f6;
  font-family: "Roboto", sans-serif;
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

.accordion {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.accordion-item {
  border: 1px solid #ddd;
  border-radius: 8px !important;
  overflow: hidden;
}

.accordion-button {
  background-color: #f8f9fa;
  color: #333;
  font-size: 16px;
  padding: 12px 20px;
  border: none;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f3ff;
  color: #0d6efd;
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: #ddd;
}

.accordion-body {
  padding: 20px;
  background-color: #ffffff;
  justify-items: center;
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
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  text-align: left;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
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

.resultado-container {
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.info-header {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.info-row {
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
}

.cantidad-conflicto {
  background-color: #ff0000 !important;
  color: white !important;
  font-weight: bold;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.link-kit {
  color: #2563eb;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.link-kit:hover {
  text-decoration: underline;
}

.totales-row {
  background-color: #f4f6f8 !important;
  font-weight: bold;
}

.utilidad-total {
  background-color: #e0e7ff !important;
}

.autorizacion-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.usuario-info {
  margin-bottom: 15px;
  font-size: 14px;
}

.comentarios-section {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comentarios-section label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.comentarios-section textarea {
  width: 100%;
  max-width: 500px;
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
}

.btn-autorizacion {
  background-color: #2563eb;
  color: white;
  padding: 10px 30px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-autorizacion:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-autorizacion:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.historial-section {
  margin-top: 30px;
}

.table-header-kit {
  background-color: #A9D0F5 !important;
  color: #000;
  text-align: center;
  font-weight: bold;
}

.table-total-kit {
  background-color: #A9D0F5 !important;
  font-weight: bold;
}

</style>
