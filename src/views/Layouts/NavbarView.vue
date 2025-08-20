<template>
  <nav class="navbar">
    <div class="navbar-left navbar-links">
      <router-link to="/" class="nav-link">Control de estados ordenes de compra</router-link>
      <router-link to="/anular" class="nav-link">Anular ordenes de compra</router-link>
      <!-- <router-link to="/oc_nacional" class="nav-link">Ordenes de compra nacional</router-link> -->
      <!-- <router-link to="/generico" class="nav-link">Creación de Genéricos</router-link> -->
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: #fff7dd;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.navbar-left {
  display: flex;
  align-items: center;
}
.navbar-logo {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}
.navbar-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2778bf;
}
.navbar-links {
  display: flex;
  gap: 24px;
}
.nav-link {
  position: relative;
  color: #2778bf;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: 
    background 0.3s,
    color 0.3s,
    box-shadow 0.3s;
  overflow: hidden;
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #2778bf 0%, #679b3a 100%);
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  border-radius: 2px;
  transform: translateX(-50%);
}
.nav-link:hover {
  background: #eaf6ff;
  color: #679b3a;
  box-shadow: 0 2px 12px rgba(39,120,191,0.08);
  transform: translateY(-2px) scale(1.04);
}
.nav-link:hover::after {
  width: 80%;
}
.router-link-exact-active {
  background: #2778bf;
  color: #fff !important;
  box-shadow: 0 2px 12px rgba(39,120,191,0.12);
}
</style>