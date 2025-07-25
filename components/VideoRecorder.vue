<template>
  <v-container class="text-center py-10">
    <h2 class="text-h5 mb-4">🎥 Simple Video Recorder</h2>

    <!-- INITIAL STATE: Ask user to click to begin -->
    <div v-if="!setupStarted">
      <v-btn color="primary" @click="startSetup">Start Camera</v-btn>
    </div>

    <!-- ERROR MESSAGE -->
    <div v-else-if="!devicesReady">
      <v-alert type="error" color="error" outlined>
        ❌ No camera or microphone detected. Please connect a device to start recording.
      </v-alert>
    </div>

    <!-- RECORDER UI -->
    <div v-else>
      <!-- Live Camera Preview -->
      <video ref="preview" autoplay playsinline muted width="320" height="240" />

      <!-- Playback after recording -->
      <video
        v-if="recordedVideoUrl"
        :src="recordedVideoUrl"
        controls
        class="my-4"
        width="320"
        height="240"
      ></video>

      <!-- Recorder Buttons -->
      <div class="mt-4">
        <v-btn class="ma-2" color="primary" @click="startRecording">Start</v-btn>
        <v-btn class="ma-2" color="error" @click="stopRecording">Stop</v-btn>
      </div>

      <!-- Download -->
      <div v-if="recordedVideoUrl" class="mt-4">
        <a
          :href="recordedVideoUrl"
          download="recording.webm"
          class="v-btn primary white--text"
        >
          ⬇️ Download Video
        </a>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'VideoRecorder',
  data() {
    return {
      setupStarted: false,
      devicesReady: false,
      stream: null,
      mediaRecorder: null,
      chunks: [],
      recordedVideoUrl: null
    }
  },
  methods: {
    async startSetup() {
      this.setupStarted = true

      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasCamera = devices.some((d) => d.kind === 'videoinput')
        const hasMic = devices.some((d) => d.kind === 'audioinput')

        if (!hasCamera || !hasMic) {
          console.warn('No camera or microphone found')
          this.devicesReady = false
          return
        }

        // Request permission only after user clicks
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })

        this.$refs.preview.srcObject = this.stream
        this.devicesReady = true
      } catch (err) {
        console.error('Camera access error:', err)
        this.devicesReady = false
      }
    },
    startRecording() {
      if (!this.stream) {
        alert('⚠️ Camera is not ready.')
        return
      }

      this.chunks = []
      this.recordedVideoUrl = null

      this.mediaRecorder = new MediaRecorder(this.stream)

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.chunks.push(e.data)
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' })
        this.recordedVideoUrl = URL.createObjectURL(blob)
      }

      this.mediaRecorder.start()
    },
    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
    }
  },
  beforeDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
    }
  }
}
</script>
