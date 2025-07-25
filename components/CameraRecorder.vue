<template>
  <v-container class="camera-container text-center py-6">
    <!-- Start button before permission -->
    <div v-if="!cameraStarted">
      <v-btn color="primary" @click="startCamera">🎥 Start Camera</v-btn>
    </div>

    <!-- Live camera preview -->
    <video
      v-if="cameraStarted"
      ref="video"
      autoplay
      muted
      playsinline
      class="camera-preview"
    />

    <!-- Recording controls -->
    <div v-if="cameraStarted" class="record-buttons mt-4">
      <v-btn color="blue" @click="flipCamera" :disabled="isRecording">
        🔄 Flip Camera
      </v-btn>

      <v-btn
        v-if="!isRecording && !isPaused"
        color="red"
        fab
        @click="startRecording"
      >
        <v-icon>mdi-record</v-icon>
      </v-btn>

      <v-btn
        v-if="isRecording && !isPaused"
        color="orange"
        fab
        @click="pauseRecording"
      >
        <v-icon>mdi-pause</v-icon>
      </v-btn>

      <v-btn
        v-if="isPaused"
        color="green"
        fab
        @click="resumeRecording"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>

      <v-btn
        v-if="isRecording"
        color="error"
        fab
        @click="stopRecording"
      >
        <v-icon>mdi-stop</v-icon>
      </v-btn>
    </div>

    <!-- Playback -->
    <video
      v-if="recordedVideoUrl"
      :src="recordedVideoUrl"
      controls
      class="playback mt-4"
    ></video>

    <!-- Download -->
    <div v-if="recordedVideoUrl" class="mt-2">
      <a :href="recordedVideoUrl" download="recording.webm" class="v-btn primary white--text">
        ⬇️ Download Recording
      </a>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      stream: null,
      mediaRecorder: null,
      recordedChunks: [],
      recordedVideoUrl: null,
      isRecording: false,
      isPaused: false,
      usingFrontCamera: false,
      cameraStarted: false
    }
  },
  methods: {
    async startCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(d => d.kind === 'videoinput')

        let selectedDeviceId = null

        if (this.usingFrontCamera) {
          selectedDeviceId = videoDevices.find(d =>
            d.label.toLowerCase().includes('front')
          )?.deviceId || videoDevices[0]?.deviceId
        } else {
          selectedDeviceId = videoDevices.find(d =>
            d.label.toLowerCase().includes('back')
          )?.deviceId || videoDevices[0]?.deviceId
        }

        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
          },
          audio: true
        })

        this.$refs.video.srcObject = this.stream
        this.cameraStarted = true
      } catch (err) {
        alert('❌ Could not access camera or microphone: ' + err.message)
        console.error(err)
      }
    },
    flipCamera() {
      this.usingFrontCamera = !this.usingFrontCamera
      this.startCamera()
    },
    startRecording() {
      if (!this.stream) return

      this.recordedChunks = []
      this.recordedVideoUrl = null

      this.mediaRecorder = new MediaRecorder(this.stream)

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data)
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' })
        this.recordedVideoUrl = URL.createObjectURL(blob)
      }

      this.mediaRecorder.start()
      this.isRecording = true
      this.isPaused = false
    },
    pauseRecording() {
      if (this.mediaRecorder?.state === 'recording') {
        this.mediaRecorder.pause()
        this.isPaused = true
      }
    },
    resumeRecording() {
      if (this.mediaRecorder?.state === 'paused') {
        this.mediaRecorder.resume()
        this.isPaused = false
      }
    },
    stopRecording() {
      if (this.mediaRecorder?.state !== 'inactive') {
        this.mediaRecorder.stop()
        this.isRecording = false
        this.isPaused = false
      }
    }
  },
  beforeDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }
}
</script>

<style scoped>
.camera-preview {
  width: 100%;
  max-width: 640px;
  height: auto;
  border-radius: 10px;
  background: black;
}

.playback {
  width: 100%;
  max-width: 640px;
  border-radius: 10px;
  background: #000;
}

.record-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}
</style>

