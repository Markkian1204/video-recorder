<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar flat app color="white" class="elevation-1">
      <v-container class="d-flex align-center justify-space-between px-2">
        <!-- Show menu only if logged in and on /home -->
        <v-btn v-if="$auth.loggedIn && $route.path === '/home'" icon @click="drawer = !drawer">
          <v-icon color="primary">mdi-menu</v-icon>
        </v-btn>

        <!-- Title -->
        <div class="app-title">
          <v-icon color="primary" class="mr-2">mdi-video</v-icon>
          <span>Video Recorder</span>
        </div>

        <!-- Spacer -->
        <div style="width: 40px;"></div>
      </v-container>
    </v-app-bar>

    <!-- Side Drawer -->
    <v-navigation-drawer v-model="drawer" app right temporary dark color="primary">
      <v-list dense>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container class="py-6">
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer color="grey lighten-3" app inset height="50" class="justify-center">
      <span class="text-caption text--secondary">© {{ new Date().getFullYear() }} Video Recorder</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: false
    }
  },
  methods: {
    logout() {
      this.drawer = false
      this.$auth.logout()
    }
  }
}
</script>

<style scoped>
.app-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  color: #3f3f3f;
  margin: auto;
}
</style>
