<template>
  <div>
    <q-page class="flex flex-center">
      <q-card class="my-card">
        <q-card-section class="form">
          <div class="text-h6">INICIAR SESIÓN</div>

          <q-input v-model="email" label="Email" />
          <q-input v-model="password" type="password" label="Clave" />

          <q-btn label="Ingresar" color="primary" @click="login" />

          <div v-if="error" class="text-negative">{{ error }}</div>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router"; // Importa useRouter

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref(null);

async function login() {
  error.value = null; // Limpiar mensaje de error anterior

  try {
    const response = await axios.post("http://localhost:3000/login", {
      email: email.value, // Usa "email"
      password: password.value,
    });

    // Almacena el token en localStorage o un almacén de estado (Pinia, Vuex, etc.)
    console.log(response.data.token);
    localStorage.setItem("token", response.data.token);

    router.push("/dashboard"); // Redirige a una ruta protegida
  } catch (err) {
    if (err.response) {
      error.value = err.response.data.message; // Muestra el mensaje de error del servidor
    } else {
      error.value = "Error al iniciar sesión"; // Mensaje genérico en caso de error desconocido
    }
  }
}
</script>

<style>
.form {
  padding: 1.4rem 7.5rem 1.4rem 7.5rem;
}
template {
  background-image: "/images/main.png";
}
.my-card {
  background: rgba(255, 255, 255, 0.5) !important;
}

.my-card .q-card-section {
  background-color: transparent !important;
}
</style>
