<template>
  <FormMain>
    <!-- <div class="bg-gradient-to-r from-rose-50 to-violet-300 flex h-screen justify-center items-center"> -->
    <div class="flex flex-col justify-center p-6 sm:p-8 rounded-xl backdrop-blur-[2px] bg-white/55
    w-[90%] max-w-[500px] h-auto sm:h-[600px]
    xl:mx-auto
    xl:absolute xl:top-1/2 xl:left-3/4 xl:transform xl:-translate-x-1/2 xl:-translate-y-1/2">
      <div>
      </div>
      <h2 class="text-black font-bold text-lg mt-8">Login</h2>
      <p class="text-zinc-600 text-sm mt-0.5">Haloo selamat datang
        <!-- <router-link to="/register">
            <span class="font-bold text-violet-400 underline">Sing up</span>
          </router-link> -->
      </p>
      <form @submit.prevent="handleLogin" class="mt-16">
        <div>
          <label for="email" class="block text-zinc-600 text-sm border-[#3F3F46]">Email</label>
          <input v-model="email" type="email" placeholder="Email"
            class="block w-full bg-rose-50 border border-rose-50 rounded text-black px-2 py-1 placeholder:text-zinc-600 text-sm" />

        </div>
        <div>
          <div class="flex items-end  justify-between">
            <label for="password" class="block text-zinc-600 text-sm border-[#3F3F46] mt-10">Password</label>
            <router-link to="/forgot-password" class="text-zinc-600 hover:text-primary mb-0.1  text-sm "> Lupa
              Password?</router-link>

          </div>

          <input v-model="password" type="password" placeholder="Password"
            class="block w-full bg-rose-50 border border-rose-50 rounded text-black px-2 py-1 placeholder:text-zinc-600 text-sm" />

        </div>
        <div v-if="loginError" class="text-red-500 text-sm mt-4">
          Email or password is wrong
        </div>
        <button
          class="mt-10 w-full bg-orange-400 text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-80 transition"
          :class="{ 'opacity-80 cursor-not-allowed': loading || !email || !password }"
          :disabled="loading || !email || !password">
          {{ loading ? 'Please wait...' : 'Login' }}
        </button>

      </form>
    </div>


    <!-- </div> -->
  </FormMain>
</template>

<script setup>
import FormMain from "../view/FormMain.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthProvider } from "@/stores/auth-provider";
import { useNotifyStore } from "@/stores/notifikasi-toast";

const notifyStore = useNotifyStore();
const email = ref("");
const password = ref("");
const authStore = useAuthProvider();
const router = useRouter();
const loading = ref(false);
const loginError = ref(false);

const showSuccess = () => {
  notifyStore.notify("success", "Berhasil Login");
};


const showError = () => {
  notifyStore.notify("error", "Login Gagal ada kesalahan");
};

const showWarning = () => {
  notifyStore.notify("warn", "Email atau Password Salah");
};

const handleLogin = async () => {
  loginError.value = false;
  loading.value = true;
  try {
    const success = await authStore.login(email.value, password.value);

    if (success) {
      showSuccess()
      setTimeout(() => {
        router.push("/admin/home");
      }, 1000);
    } else {
      loginError.value = true;
      showWarning()
    }
  } catch (error) {
    console.error("Login failed:", error);
    loginError.value = true;
    showError()
  } finally {
    loading.value = false;
  }
};
</script>
