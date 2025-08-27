<template>
<LayoutView>
    <div class="form-container">
        <div class="header">
            <img :src="logo" :alt="logo">
            <h1>CONTROL DE ESTADO DE ORDENES DE COMPRA</h1>
        </div>
        <!-- Acordeón de filtros -->
        <div class="accordion" id="filterAccordion">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingFilters">
                    <button 
                        class="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#collapseFilters" 
                        aria-expanded="false" 
                        aria-controls="collapseFilters"
                        >
                        Filtros
                    </button>
                </h2>
                <div 
                    id="collapseFilters" 
                    class="accordion-collapse collapse" 
                    aria-labelledby="headingFilters" 
                    data-bs-parent="#filterAccordion"
                >
                    <div class="accordion-body">
                        <div class="filter-container">
                            <h2>Consultar</h2>
                            <div class="form-grid">
                                <div class="form-row">
                                    <div>
                                        <label for="oc">OC:</label>
                                        <input type="number" id="oc" class="form-control" v-model="oc" @input="resetearPaginacion">
                                    </div>
                                    <div>
                                        <label for="fecha_oc_desde">Fecha de la OC Desde:</label>
                                        <input type="date" id="fecha_oc_desde" v-model="fecha_oc_desde" @input="resetearPaginacion">
                                    </div>
                                    <div>
                                        <label for="fecha_oc_hasta">Fecha de la OC Hasta:</label>
                                        <input type="date" id="fecha_oc_hasta" v-model="fecha_oc_hasta" @input="resetearPaginacion">
                                    </div>
                                    <div>
                                        <label for="usuario">Usuario:</label>
                                        <select id="usuario" class="form-control form-control-sm mb-2" v-model="selectUsuario" @input="resetearPaginacion">
                                            <option :value="null">Seleccione Usuario</option>
                                            <option v-for="usuario in lista_usuarios" :value="usuario.usuario">{{ usuario.des_usuario }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="estado_orden">Estado:</label>
                                        <select id="estado_orden" class="form-control" v-model="estado_orden" @input="resetearPaginacion">
                                            <option :value="null">Seleccione Estado</option>
                                            <option :value="1">ANULADO</option>
                                            <option :value="0">VIGENTE</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div>
                                        <label for="enviada_a_aprobar">Envíada a aprobar ¿Sí – No?:</label>
                                        <select id="enviada_a_aprobar" class="form-control" v-model="enviada_a_aprobar" @input="resetearPaginacion">
                                            <option :value="null">Seleccione Estado</option>
                                            <option :value="1">SI</option>
                                            <option :value="0">NO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="solicitud_aprobacion">Aprobada ¿Sí – No?:</label>
                                        <select id="solicitud_aprobacion" class="form-control" v-model="solicitud_aprobacion" @input="resetearPaginacion">
                                            <option :value="null">Seleccione Estado</option>
                                            <option :value="1">SI</option>
                                            <option :value="0">NO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="enviada_proveedor">Enviada al Proveedor: ¿Sí – No?:</label>
                                        <select id="enviada_proveedor" class="form-control" v-model="enviada_proveedor" @input="resetearPaginacion">
                                            <option :value="null">Seleccione Estado</option>
                                            <option :value="1">SI</option>
                                            <option :value="0">NO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="confirmada_proveedor">Confirmada por el Proveedor ¿Sí – No?:</label>
                                        <select id="confirmada_proveedor" class="form-control" v-model="confirmada_proveedor" @input="resetearPaginacion">
                                            <option :value="null">Seleccione Estado</option>
                                            <option :value="1">SI</option>
                                            <option :value="0">NO</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="buttons">
                            <button class="consultar" @click="handleGetDatos">Consultar</button>
                            <button class="exportar" @click="handleGetRegistros">Exportar</button>
                            <button class="guardar" @click="guardar_registro_estado_oc">Guardar</button>
                            <button class="limpiar" @click="limpiarCampos">Limpiar</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>

    <div class="container-n">
        <div class="table-container">
            <h3 class="h3-title">NÚMERO DE REGISTROS</h3>
            <table>
                <thead>
                    <tr>
                        <th># de OC</th>
                        <th>Fecha de OC</th>
                        <th>Nombre del proveedor</th>
                        <th>Estado OC</th>
                        <th>¿Enviada a aprobar?</th>
                        <th>¿Aprobada?</th>
                        <th>¿Enviada al proveedor?</th>
                        <th>¿Confirmado por el proveedor?</th>
                        <th>Fecha de envío al proveedor</th>
                        <th>Observaciones</th>
                        <th>Seguimiento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="lista_ordenes.length === 0">
                        <td colspan="11" class="no-registros">No hay registros disponibles</td>
                    </tr>
                    <tr v-else v-for="orden in lista_ordenes" :key="orden.consecutivo" @click="selectRow(orden)" :class="{ 'selected-row': orden.consecutivo === selectedOrdenId }">
                        <td>{{ orden.numero }}</td>
                        <td>{{ orden.fecha_orden_compra }}</td>
                        <td>{{ orden.proveedor }}</td>
                        <td>{{ orden.estado }}</td>
                        <td>
                            <select v-model="orden.enviada_a_aprobar" class="form-control" @change="updateEnviadaAprobar(orden)">
                                <option :value="null">Seleccione Estado</option>
                                <option :value="1">SI</option>
                                <option :value="0">NO</option>
                            </select>
                        </td>
                        <td>{{ orden.autorizada }}</td>
                        <td>
                            <select v-model="orden.enviada_a_proveedor" class="form-control" @change="updateEnviadaProveedor(orden)">
                                <option :value="null">Seleccione Estado</option>
                                <option :value="1">SI</option>
                                <option :value="0">NO</option>
                            </select>
                        </td>
                        <td>
                            <select v-model="orden.confirmada_por_proveedor" class="form-control" @change="updateConfirmadaProveedor(orden)">
                                <option :value="null">Seleccione Estado</option>
                                <option :value="1">SI</option>
                                <option :value="0">NO</option>
                            </select>
                        </td>
                        <td>
                            <input type="date" v-model="orden.fecha_envio_proveedor" @change="updateFecha(orden)" class="form-control" :min="orden.fecha_orden_compra">
                        </td>
                        <td>
                            <textarea class="form-control" v-model="orden.observaciones" @change="updateTextArea(orden)"></textarea>
                        </td>
                        <td>
                            <span 
                                class="seguimiento-icono" 
                                @click="abrirModalSeguimiento(orden)" 
                                title="Ver seguimiento"
                            >
                                <!-- Icono lupa SVG -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#808080" viewBox="0 0 24 24">
                                  <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 2a6 6 0 1 1 0 12A6 6 0 0 1 10 4zm8.707 15.293-4.1-4.1A7.963 7.963 0 0 1 10 18a8 8 0 1 1 8-8c0 1.61-.48 3.11-1.393 4.393l4.1 4.1a1 1 0 0 1-1.414 1.414z"/>
                                </svg>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" v-if="total_registros > 15">
          <label for="records-per-page">Registros por página:</label>
          <select 
            id="records-per-page" 
            v-model="limit" 
            @change="changePage(1)"
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
          <button 
            :disabled="position <= 1" 
            @click="changePage(1)"
          >
            Primera
          </button>
          
          <button 
            :disabled="position <= 1" 
            @click="changePage(position - 1)"
          >
            Anterior
          </button>
          
          <span>Página {{ position }} de {{ total_paginas }}</span>
          
          <button 
            :disabled="position >= total_paginas" 
            @click="changePage(position + 1)"
          >
            Siguiente
          </button>
          
          <button 
            :disabled="position >= total_paginas" 
            @click="changePage(total_paginas)"
          >
            Última
          </button>
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

    <!-- Modal de pregunta -->
    <div class="modal fade" id="preguntaModal" tabindex="-1" aria-labelledby="preguntaModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="preguntaModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="preguntaModalLabel">Registro Existente</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {{msg}}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-pregunta-modal" @click="actualizarCotizacion">Si</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
            </div>
        </div>
    </div>

    <!-- Modal de error -->
    <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="errorModal" style="z-index: 12000;">
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

    <!-- Modal de seguimiento -->
    <div class="modal fade" id="seguimientoModal" tabindex="-1" aria-labelledby="seguimientoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="seguimientoModal">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="seguimientoModalLabel">Seguimiento de Orden de compra #: {{ oc_seguimiento }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Contenedor informativo de la OC -->
                    <div class="seguimiento-info">
                        <div><strong>OC:</strong> {{ oc_seguimiento }}</div>
                        <div><strong>Fecha OC:</strong> {{ fecha_oc_seguimiento }}</div>
                        <div><strong>Proveedor:</strong> {{ proveedor_seguimiento }}</div>
                        <div><strong>Estado:</strong> {{ estado_seguimiento }}</div>
                    </div>
                    <hr>
                    <div class="seguimiento-row">
                        <div>
                            <label for="usuarioSeguimiento">Usuario:</label>
                            <select id="usuarioSeguimiento" v-model="usuarioSeguimiento" class="form-select seguimiento-select">
                                <option value=null>Seleccione usuario</option>
                                <option value="RODRIGUEZC">RODRIGUEZC</option>
                                <option value="PCARBONELL">PCARBONELL</option>
                            </select>
                        </div>
                        <div>
                            <label for="comentarioSeguimiento">Comentario Seguimiento:</label>
                            <textarea id="comentarioSeguimiento" v-model="comentarioSeguimiento" class="form-control seguimiento-textarea" placeholder="Escriba un comentario..."></textarea>
                        </div>
                        <span class="seguimiento-guardar-icono" @click="guardarSeguimiento" title="Guardar seguimiento">
                                <!-- Icono guardar cuadrado pequeño (disquete) -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#28a745">
                                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                                    <rect x="7" y="7" width="10" height="6" fill="#fff"/>
                                    <rect x="9" y="15" width="6" height="2" fill="#fff"/>
                                    <rect x="10" y="9" width="4" height="2" fill="#28a745"/>
                                </svg>
                        </span>
                    </div>
                    <hr>
                    <!-- Tabla de seguimientos si hay información -->
                    <div v-if="list_seguimientos && list_seguimientos.length > 0" class="seguimiento-tabla-container">
                        <h6 class="seguimiento-tabla-titulo">Historial de seguimientos</h6>
                        <div class="seguimiento-tabla-scroll">
                            <table class="table table-bordered seguimiento-tabla">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuario</th>
                                        <th>Comentario</th>
                                        <th>Fecha de creación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in list_seguimientos" :key="item.id">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.usuario }}</td>
                                        <td>{{ item.comentario }}</td>
                                        <td>{{ item.created_at }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
import axios from 'axios';
import LayoutView from '../views/Layouts/LayoutView.vue';
import { Modal } from 'bootstrap';
import logo from '@/assets/logo.png';
import apiUrl from "../../config.js";

const oc = ref("");
const fecha_oc_desde = ref(null);
const fecha_oc_hasta = ref(null);
const solicitud_aprobacion = ref(null);
const enviada_proveedor = ref(null);
const confirmada_proveedor = ref(null);
const lista_usuarios = ref([]);
const selectUsuario = ref(null);
const fechaDesdeFormateada = ref(null);
const fechaHastaFormateada = ref(null);
const estado_orden = ref(null);
const enviada_a_aprobar = ref(null);
const lista_ordenes = ref([]);

const modalTitle = ref('');
const modalInstance = ref(null);
const modalErrorInstance = ref(null);
const modalPreguntaInstance = ref(null);
const registrosEditados = ref([]);

const selectedOrdenId = ref(null);
const selectedNumeroOrden = ref(null);
const selectedEnviadaAprobar = ref(null);
const selectedEnviadaProveedor = ref(null);
const selectedConfirmadaProveedor = ref(null);
const selectedFechaEnvioProveedor = ref(null);
const selectedObservaciones = ref("");

const total_paginas = ref(0);
const total_registros = ref(0);
const limit = ref(15);
const position = ref(1);

const msg = ref('');
const errorMsg = ref('');

const loading = ref(false);
const loading_msg = ref('');

// Modal de seguimiento
const seguimientoModalInstance = ref(null);
const oc_seguimiento = ref(null);
const fecha_oc_seguimiento = ref(null);
const proveedor_seguimiento = ref('');
const estado_seguimiento = ref('');
const list_seguimientos = ref([]);

const usuarioSeguimiento = ref(null);
const comentarioSeguimiento = ref("");

// ✅ Función para guardar un registro de orden de compra
const guardar_registro_estado_oc = async () => {
    try {
        registrosEditados.value = lista_ordenes.value.filter(orden => orden.editado);
        if (registrosEditados.value.length === 0) {
            msg.value = "No hay cambios para guardar.";
            modalTitle.value = "Información";
            modalInstance.value.show();
            return;
        }

        const response = await axios.post(
            `${apiUrl}/guardar_registro_estado_oc`, 
            {
                ordenes: registrosEditados.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            msg.value = response.data.message;
            modalTitle.value = "Información.";
            modalInstance.value.show();
            lista_ordenes.value.forEach(orden => orden.editado = false); // Resetear estado de edición
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};
// ✅ Función para cargar las ordenes de compra segun el filtro dado
const get_orden_compra_data = async () => {
    try {
        if (oc.value){
            oc.value = oc.value.toString();
        }
        if (fecha_oc_desde.value){
            fechaDesdeFormateada.value = fecha_oc_desde.value.replace(/-/g, ""); // Reemplaza los guiones por nada
        }
        if (fecha_oc_hasta.value){
            fechaHastaFormateada.value = fecha_oc_hasta.value.replace(/-/g, ""); // Reemplaza los guiones por nada
        }
        if (solicitud_aprobacion.value != null){
            solicitud_aprobacion.value = solicitud_aprobacion.value.toString();
        }
        if (enviada_proveedor.value != null){
            enviada_proveedor.value = enviada_proveedor.value.toString();
        }
        if (confirmada_proveedor.value != null){
            confirmada_proveedor.value = confirmada_proveedor.value.toString();
        }
        if (estado_orden.value != null){
            estado_orden.value = estado_orden.value.toString();
        }
        if (enviada_a_aprobar.value != null){
            enviada_a_aprobar.value = enviada_a_aprobar.value.toString();
        }

        const response = await axios.post(
            `${apiUrl}/get_orden_compra_data`, 
            {
                oc: oc.value,
                fecha_oc_desde: fechaDesdeFormateada.value,
                fecha_oc_hasta: fechaHastaFormateada.value,
                solicitud_aprobacion: solicitud_aprobacion.value,
                usuario: selectUsuario.value,
                enviada_proveedor: enviada_proveedor.value,
                confirmada_proveedor: confirmada_proveedor.value,
                estado_orden: estado_orden.value,
                enviada_a_aprobar: enviada_a_aprobar.value,
                limit: parseInt(limit.value),
                position: parseInt(position.value),
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            msg.value = response.data.message;
            lista_ordenes.value = response.data.data.registros.map(
                orden => (
                    {
                        ... orden, 
                        editado: false,
                        enviada_a_aprobar: orden.enviada_a_aprobar,
                        enviada_a_proveedor: orden.enviada_a_proveedor,
                        confirmada_por_proveedor: orden.confirmada_por_proveedor,
                    }
                ));
            total_paginas.value = response.data.data.total_pag;
            total_registros.value = response.data.data.total_registros;
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};
// ✅ Función para exportar los datos a un archivo excel
const exportar_excel = async () => {
    try {
        if (oc.value){
            oc.value = oc.value.toString();
        }
        if (fecha_oc_desde.value){
            fechaDesdeFormateada.value = fecha_oc_desde.value.replace(/-/g, ""); // Reemplaza los guiones por nada
        }
        if (fecha_oc_hasta.value){
            fechaHastaFormateada.value = fecha_oc_hasta.value.replace(/-/g, ""); // Reemplaza los guiones por nada
        }
        if (solicitud_aprobacion.value != null){
            solicitud_aprobacion.value = solicitud_aprobacion.value.toString();
        }
        if (enviada_proveedor.value != null){
            enviada_proveedor.value = enviada_proveedor.value.toString();
        }
        if (confirmada_proveedor.value != null){
            confirmada_proveedor.value = confirmada_proveedor.value.toString();
        }
        if (estado_orden.value != null){
            estado_orden.value = estado_orden.value.toString();
        }
        if (enviada_a_aprobar.value != null){
            enviada_a_aprobar.value = enviada_a_aprobar.value.toString();
        }

        const response = await axios.post(
            `${apiUrl}/generar_excel`, 
            {
                oc: oc.value,
                fecha_oc_desde: fechaDesdeFormateada.value,
                fecha_oc_hasta: fechaHastaFormateada.value,
                solicitud_aprobacion: solicitud_aprobacion.value,
                usuario: selectUsuario.value,
                enviada_proveedor: enviada_proveedor.value,
                confirmada_proveedor: confirmada_proveedor.value,
                estado_orden: estado_orden.value,
                enviada_a_aprobar: enviada_a_aprobar.value,
            },
            {
                headers: {
                    Accept: "application/json",
                },
                responseType: "blob",  // Indicar que esperamos un archivo binario
            }
        );
        if (response.status === 200) {

            // Crear una URL para el blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "datos.xlsx"); // Nombre del archivo
            document.body.appendChild(link);
            link.click();

            // Limpiar el enlace después de la descarga
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return ""
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};
// ✅ Función para cargar los usuarios en el select de usuarios
const cargarDatos = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/get_usuarios`, {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            msg.value = response.data.message;
            lista_usuarios.value = response.data.data
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
};
// ✅ Función para seleccionar el registro a editar
const selectRow = (orden) => {
    selectedOrdenId.value = orden.consecutivo;
    selectedNumeroOrden.value = orden.numero;
    selectedEnviadaAprobar.value = orden.enviada_a_aprobar;
    selectedEnviadaProveedor.value = orden.enviada_a_proveedor;
    selectedConfirmadaProveedor.value = orden.confirmada_por_proveedor;
    selectedFechaEnvioProveedor.value = orden.fecha_envio_proveedor;
    if (orden.observaciones) {
        selectedObservaciones.value = orden.observaciones.trim();
    }
};
// ✅ Función para marcar un registro como editado
const marcarEditado = (orden) => {
    orden.editado = true;
};
// ✅ Función para actualizar el valor del select enviado a aprobar
const updateEnviadaAprobar = (orden) => {
    selectedEnviadaAprobar.value = orden.enviada_a_aprobar;
    marcarEditado(orden);
};
// ✅ Función para actualizar el valor del select enviado a proveedor
const updateEnviadaProveedor = (orden) => {
    selectedEnviadaProveedor.value = orden.enviada_a_proveedor;
    marcarEditado(orden);
};
// ✅ Función para actualizar el valor del select confirmado a aprobar
const updateConfirmadaProveedor = (orden) => {
    selectedConfirmadaProveedor.value = orden.confirmada_por_proveedor;
    marcarEditado(orden);
};
// ✅ Función para actualizar el valor de la fecha envío proveedor
const updateFecha = (orden) => {
    selectedFechaEnvioProveedor.value = orden.fecha_envio_proveedor;
    marcarEditado(orden);
};
// ✅ Función para actualizar el valor del textarea
const updateTextArea = (orden) => {
    selectedObservaciones.value = orden.observaciones;
    marcarEditado(orden);
};
// ✅ Función para limpiar los campos del formulario de cotización
const limpiarCampos = () => {
  oc.value = '';
  fecha_oc_desde.value = '';
  fecha_oc_hasta.value = '';
  fechaDesdeFormateada.value = null;
  fechaHastaFormateada.value = null;
  solicitud_aprobacion.value = null;
  enviada_proveedor.value = null;
  selectUsuario.value = null;
  confirmada_proveedor.value = null;
  estado_orden.value = null;
  enviada_a_aprobar.value = null;
  lista_ordenes.value = [];
  total_registros.value = 0;
  position.value = 1;
  limit.value = 15;
};
// ✅ Función para cambiar pagina del paginador
const changePage = async (newPosition) => {
  position.value = newPosition;
  await get_orden_compra_data(); // Vuelve a cargar los datos con el nuevo límite y posición
};
// ✅ Función para resetear paginacion cuando haya cambio en los filtros
const resetearPaginacion = () => {
    position.value = 1;
};
// ✅ Función para realizar carga de pantalla de espera.
const handleGetRegistros = async () => {
  try {
    loading.value = true; // Mostrar el spinner antes de la llamada API
    loading_msg.value = 'Exportando datos, por favor espere...';
      await exportar_excel(); // Llama a la función que obtiene los correos
  } catch (error) {
      console.error('Error al exportar excel:', error);
  } finally {
    loading.value = false; // Oculta el spinner al finalizar la operación
  }
};
// ✅ Función para realizar carga de pantalla de espera.
const handleGetDatos = async () => {
  try {
    loading.value = true; // Mostrar el spinner antes de la llamada API
    loading_msg.value = 'Consultando datos, por favor espere...';
      await get_orden_compra_data(); // Llama a la función que obtiene los correos
  } catch (error) {
      console.error('Error al consultar datos:', error);
  } finally {
    loading.value = false; // Oculta el spinner al finalizar la operación
  }
};
// ✅ Función para guardar un seguimiento a una orden de compra.
const guardarSeguimiento = async () => {
    // if (usuarioSeguimiento.value == null || usuarioSeguimiento.value == "" || usuarioSeguimiento.value == "null" || comentarioSeguimiento.value == null || comentarioSeguimiento.value == "") {
    //     alert('Por favor, complete todos los campos.');
    //     return;
    // }
    try {

        const response = await axios.post(
            `${apiUrl}/guardar_seguimiento`, 
            {
                oc: oc_seguimiento.value,
                usuario: usuarioSeguimiento.value,
                comentario: comentarioSeguimiento.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            await cargarDatosSeguimiento();
            limpiarCamposModal();
            alert('Seguimiento guardado con éxito.');
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
}
// ✅ Función para abrir el modal de seguimiento
const abrirModalSeguimiento = async (orden) => {
    oc_seguimiento.value = orden.numero;
    fecha_oc_seguimiento.value = orden.fecha_orden_compra;
    proveedor_seguimiento.value = orden.proveedor;
    estado_seguimiento.value = orden.estado;
    if (!seguimientoModalInstance.value) {
        seguimientoModalInstance.value = new Modal(seguimientoModal);
    }
    await cargarDatosSeguimiento();
    seguimientoModalInstance.value.show();
};

const limpiarCamposModal = () => {
    usuarioSeguimiento.value = null;
    comentarioSeguimiento.value = "";
};

const cargarDatosSeguimiento = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/cargar_datos_seguimiento`, 
            {
                oc: oc_seguimiento.value
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            list_seguimientos.value = response.data.data;
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    }
}

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
  modalPreguntaInstance.value = new Modal(preguntaModal);
  seguimientoModalInstance.value = new Modal(seguimientoModal);
  cargarDatos();
});

</script>
  
<style scoped>

body {
    background-color: #f3f4f6;
    font-family: 'Roboto', sans-serif;
}

.accordion {
  margin-top: 1px;
}

.btn-acordeon {
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.accordion-button{
    font-size: 14px;
    padding: 10px;
}

.accordion-body .filter-container h2 {
    font-size: 1.2rem;
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

.container-n {
    width: 100%;
    height: calc(100vh - 120px); /* Ajusta la altura para que la tabla ocupe el espacio restante */
    padding: 16px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-self: center;
    overflow: hidden; /* Evita el scroll en toda la página */
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
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.form-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
}

.form-row:last-child {
    grid-template-columns: repeat(4, 1fr);
}
@media (min-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr 1fr;
    }
}
@media (min-width: 1024px) {
    .form-grid {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
.form-grid label {
    display: block;
    font-size: 0.75rem;
    margin-bottom: 2px;
}
.form-grid input,
.form-grid select {
    width: 100%;
    border: 1px solid #e5e7eb;
    padding: 8px;
    font-size: 0.7rem; /* Hacer la fuente más pequeña */
    height: 30px; /* Reducir la altura */
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
    transition: 0.3s;
}
.buttons .consultar:hover {
    background-color: #ffd858;
}
.buttons .exportar {
    background-color: #808080;
    border-radius: 20px;
    transition: 0.3s;
}
.buttons .exportar:hover {
    background-color: rgb(188, 188, 188);
}
.buttons .guardar {
    background-color: #191919;
    border-radius: 20px;
    transition: 0.3s;
}
.buttons .guardar:hover {
    background-color: #616161;
}
.buttons .limpiar {
    background-color: #9b3460;
    border-radius: 20px;
    transition: 0.3s;
}
.buttons .limpiar:hover {
    background-color: #cf3476;
}
.h3-title {
    font-size: 1.25rem;
    font-weight: bold;
}
/* Tabla */
.table-container {
    flex-grow: 1; /* Permite que la tabla ocupe todo el espacio restante */
    overflow-y: auto; /* Activa el scroll interno en la tabla */
    max-height: 100%; /* Se ajusta a la altura disponible */
}
table {
    width: 100%;
    border-collapse: collapse;

    position: relative;
}
/* Dejar fija la cabecera */
thead {
    position: sticky;
    top: 0;
    background-color: #e5e7eb; /* Fijar color de fondo para que no sea transparente */
    z-index: 10; /* Asegurar que esté sobre el contenido */
}
th, td {
    border: 1px solid #e5e7eb;
    padding: 8px;
    text-align: left;
    font-size: 0.75rem;
}
th {
    background-color: #e5e7eb;
}

/* Reducir el tamaño de los select dentro de la tabla */
.table-container table select {
    width: 80px; /* Ajusta el ancho */
    padding: 4px; /* Reduce el padding interno */
    font-size: 0.875rem; /* Hace el texto un poco más pequeño */
}

.table-container table input {
    width: 150px; /* Ajusta el ancho */
    padding: 4px; /* Reduce el padding interno */
    font-size: 0.875rem; /* Hace el texto un poco más pequeño */
}

/* Ajustar el tamaño del textarea dentro de la tabla */
.table-container table textarea {
    width: 100%; /* Ocupar todo el ancho de la celda */
    min-width: 200px; /* Asegurar un tamaño mínimo */
    height: 50px; /* Un poco más alto */
    resize: vertical; /* Permitir que el usuario lo ajuste en altura */
    font-size: 0.875rem;
}

.no-registros {
    text-align: center;
    font-weight: bold;
    color: #888;
    padding: 16px;
    font-size: 1rem;
}

.selected-row {
  background-color: #fff7dd;
  border: 1px solid #b4ab0a;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 2px;
  font-size: 14px; /* Reduce el tamaño de la fuente */
  padding: 8px;
}

.pagination label {
  margin-right: 10px;
  font-size: 0.9rem;
}

.pagination select {
  margin-right: 20px;
  padding: 4px;
  font-size: 0.8rem;
  height: 30px;
}

.pagination button {
  background-color: #ffc300;
  color: white;
  border: none;
  padding: 4px 8px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  height: 30px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 0.9rem;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7); /* Fondo oscuro */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Asegura que esté sobre todo */
}

/* Contenedor informativo de la OC en la modal de seguimiento */
.seguimiento-info {
    display: flex;
    gap: 32px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px 18px;
    margin-bottom: 18px;
    font-size: 1rem;
    color: #333;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.seguimiento-info div {
    min-width: 120px;
}
/* Estilos para la row de seguimiento en la modal */
.seguimiento-row {
    display: flex;
    align-items: center;
    gap: 20px;
    background: #f8f9fa;
    margin-bottom: 12px;
}
.seguimiento-select {
    min-width: 160px;
    max-width: 180px;
}
.seguimiento-textarea {
    flex: 2;
    min-width: 400px;
    max-width: 1000px;
    height: 40px;
    resize: vertical;
}
.seguimiento-guardar-icono {
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: transform 0.2s;
}
.seguimiento-guardar-icono:hover svg {
    transform: scale(1.2);
    filter: drop-shadow(0 0 2px #28a745);
}

.seguimiento-icono svg {
    cursor: pointer;
    display: inline-block;
    transition: transform 0.2s;
    vertical-align: middle;
}
.seguimiento-icono:hover svg {
    transform: scale(1.2);
    filter: drop-shadow(0 0 2px #808080);
}

/* Estilos para la tabla de seguimientos con scroll */
.seguimiento-tabla-container {
    margin-top: 18px;
}
.seguimiento-tabla-scroll {
    max-height: 220px;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    /* Para que la tabla ocupe todo el ancho y el scroll sea visible */
    width: 100%;
    display: block;
}
.seguimiento-tabla {
    margin-bottom: 0;
    width: 100%;
    table-layout: fixed;
}
.seguimiento-tabla th, .seguimiento-tabla td {
    word-break: break-word;
}

/* Modal de error con z-index alto para superponerse */
#errorModal {
    z-index: 12000 !important;
}
</style>
