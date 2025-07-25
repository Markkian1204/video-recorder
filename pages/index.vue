<template>
  <div style="padding: 2rem; text-align: center;">
    <h2>📷 Camera Test Page</h2>

    <!-- Start button -->
    <button @click="startCamera" style="padding: 10px 20px; font-size: 16px;">
      Start Camera
    </button>

    <!-- Error display -->
    <div v-if="error" style="color: red; margin-top: 1rem;">{{ error }}</div>

    <!-- Live video -->
    <video
      v-show="streamReady"
      ref="video"
      autoplay
      playsinline
      muted
      width="100%"
      style="max-width: 320px; height: auto; border: 2px solid #333; margin-top: 1rem;"
    ></video>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      streamReady: false,
      error: null,
    }
  },
  methods: {
    async startCamera() {
      this.error = null
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        })
        console.log('✅ Got media stream:', stream)

        if (this.$refs.video) {
          this.$refs.video.srcObject = stream
          this.streamReady = true
          console.log('🎥 Stream attached to video element')
        } else {
          console.warn('⚠️ Video ref is missing')
        }
      } catch (err) {
        this.error = `❌ ${err.name}: ${err.message}`
        console.error('Camera error:', err)
      }
    }
  },
  beforeDestroy() {
    if (this.$refs.video && this.$refs.video.srcObject) {
      this.$refs.video.srcObject.getTracks().forEach(track => track.stop())
    }
  }
}
</script>
