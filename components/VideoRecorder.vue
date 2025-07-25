<template>
  <v-container class="text-center py-10">
    <h2 class="text-h5 mb-4">🎥 Simple Video Recorder</h2>

    <!-- INITIAL STATE -->
    <div v-if="!setupStarted">
      <v-btn color="primary" @click="startSetup">Start Camera</v-btn>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="!devicesReady">
      <v-alert type="error" color="error" outlined>
        ❌ No camera or microphone detected. Please connect a device to start recording.
      </v-alert>
    </div>

    <!-- MAIN RECORDER UI -->
    <div v-else>
      <!-- Live Preview -->
      <video
        ref="preview"
        autoplay
        playsinline
        muted
        width="320"
        height="240"
        class="mb-4"
      ></video>

      <!-- Recorded Video -->
      <video
        v-if="recordedVideoUrl"
        :src="recordedVideoUrl"
        controls
        class="my-4"
        width="320"
        height="240"
      ></video>

      <!-- Buttons -->
      <div class="mt-4">
        <v-btn class="ma-2" color="primary" @click="startRecording">Start</v-btn>
        <v-btn class="ma-2" color="error" @click="stopRecording">Stop</v-btn>
      </div>

      <!-- Download Button -->
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

    <!-- Debug Log -->
    <v-alert
      v-if="debugLogs.length"
      class="mt-6 text-left"
      type="info"
      border="left"
      colored-border
      elevation="1"
    >
      <div v-for="(log, i) in debugLogs" :key="i">
        {{ log }}
      </div>
    </v-alert>
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
      recordedVideoUrl: null,
      debugLogs: []
    }
  },
  methods: {
    log(message) {
      console.log(message)
      this.debugLogs.push(message)
    },

    async startSetup() {
      this.setupStarted = true

      try {
        const devices = await navigator.mediaDevices.enumerateDevices()

        const videoInputs = devices.filter((d) => d.kind === 'videoinput')
        const audioInputs = devices.filter((d) => d.kind === 'audioinput')

        this.log(`📷 Video inputs: ${videoInputs.length}`)
        this.log(`🎙 Audio inputs: ${audioInputs.length}`)

        if (videoInputs.length === 0 || audioInputs.length === 0) {
          this.log('❌ Missing camera or microphone.')
          this.devicesReady = false
          return
        }

        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })

        this.log(`🎥 Tracks: ${this.stream.getTracks().length}`)
        this.log(`🎧 Audio Tracks: ${this.stream.getAudioTracks().length}`)

        this.stream.getAudioTracks().forEach((track, i) =>
          this.log(`🔊 Mic ${i + 1}: ${track.label}`)
        )

        this.$refs.preview.srcObject = this.stream
        this.devicesReady = true
      } catch (err) {
        this.log(`🚫 Camera access error: ${err.message}`)
        this.devicesReady = false
      }
    },

    startRecording() {
      if (!this.stream) {
        alert('⚠️ Camera is not ready.')
        return
      }

      this.log('🔴 Recording started.')
      this.chunks = []
      this.recordedVideoUrl = null

      try {
        this.mediaRecorder = new MediaRecorder(this.stream)

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.chunks.push(e.data)
        }

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { type: 'video/webm' })
          this.recordedVideoUrl = URL.createObjectURL(blob)
          this.log('✅ Recording finished.')
        }

        this.mediaRecorder.start()
      } catch (err) {
        this.log(`❌ MediaRecorder error: ${err.message}`)
      }
    },

    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.log('⏹ Recording stopped.')
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
