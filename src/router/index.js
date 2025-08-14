import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue';
import OcNacionalView from '@/views/OcNacionalView.vue';
import MainViewAdmin from '@/views/MainViewAdmin.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'main', component: MainView},
    {path: '/oc_nacional', name: 'oc_nacional', component: OcNacionalView},
    {path: '/control-administrativo', name: 'control-administrativo', component: MainViewAdmin}
  ]
})

// router.beforeEach((to, from, next) => {

//   const token = localStorage.getItem('token');
//   // Si no se requiere autenticación (por ejemplo, en la ruta de login), continúa
//   if (to.path === '/' || to.name === 'login') {
//     next();
//   } else {
//     // Si se requiere autenticación y no hay token, redirigir al login
//     if (!token) {
//       next({ name: 'login' }); // Redirigir a la ruta de login si no hay token
//     } else {
//       // Si hay token, permitir la navegación
//       next();
//     }
//   }
// });

export default router