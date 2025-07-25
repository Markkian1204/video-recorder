<template>
  <v-container class="fill-height d-flex justify-center align-center text-center">
    <v-row justify="center">
      <v-col cols="12" sm="8" class="d-flex align-center">
        <v-progress-circular indeterminate color="primary" size="50" />
        <div class="ml-4">Logging in, please wait...</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async mounted() {
    try {
      // Process the Auth0 redirect and get the token
      await this.$auth.handleCallback()

      // Optional: redirect to home or wherever
      this.$router.push('/home')
    } catch (err) {
      console.error('Auth0 callback error:', err)
      this.$router.push('/welcome')
    }
  }
}
</script>
