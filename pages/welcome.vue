<template>
  <v-container
    fluid
    class="welcome-screen fill-height d-flex align-center justify-center"
  >
    <v-card class="text-center pa-8 elevation-10 rounded-xl welcome-card">
      <!-- Icon -->
      <v-icon size="64" color="red darken-1" class="mb-4">
        mdi-video-outline
      </v-icon>

      <!-- Title -->
      <h1 class="text-h4 font-weight-bold mb-2">Welcome to Video Recorder</h1>

      <!-- Subtitle -->
      <p class="subtitle mb-6">
        Easily record videos using your device's camera. Tap below to get started.
      </p>

      <!-- Start Button -->
      <v-btn
        color="red darken-1"
        dark
        large
        rounded
        elevation="3"
        @click="login"
      >
        🎥 Start Recording
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  methods: {
    login() {
      this.$auth.loginWith('auth0')
    }
  }
}
</script>

<style scoped>
.welcome-screen {
  background: linear-gradient(145deg, #e0e0e0, #fafafa);
}

.welcome-card {
  max-width: 480px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
}
</style>
