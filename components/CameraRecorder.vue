<template>
  <v-container class="camera-container text-center py-8">
    <h2 class="text-h5 mb-6 font-weight-bold">🎥 Camera Recorder</h2>

    <!-- Start Button -->
    <div v-if="!cameraStarted">
      <v-btn color="primary" @click="startCamera">
        ▶️ Start Camera
      </v-btn>
    </div>

    <!-- Video Preview -->
    <div v-else>
      <video ref="video" autoplay muted playsinline class="video-preview" />

      <!-- Controls -->
      <div class="record-buttons mt-4">
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
        class="playback mt-6"
      />

      <!-- Actions -->
      <div v-if="recordedVideoUrl" class="mt-4">
        <v-btn
          class="ma-2"
          color="primary"
          :href="recordedVideoUrl"
          download="recording.webm"
        >
          ⬇️ Download
        </v-btn>
        <v-btn class="ma-2" color="grey darken-1" @click="deleteRecording">
          🗑️ Delete
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      cameraStarted: false,
      stream: null,
      mediaRecorder: null,
      recordedChunks: [],
      recordedVideoUrl: null,
      isRecording: false,
      isPaused: false,
      useFrontCamera: false
    }
  },
  methods: {
    async startCamera() {
      this.cameraStarted = true

      if (this.stream) {
        this.stream.getTracks().forEach((t) => t.stop())
      }

      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: this.useFrontCamera ? 'user' : 'environment' },
          audio: true
        })
        this.$refs.video.srcObject = this.stream
      } catch (err) {
        alert('❌ Could not access camera/mic: ' + err.message)
        console.error(err)
      }
    },
    flipCamera() {
      this.useFrontCamera = !this.useFrontCamera
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
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.pause()
        this.isPaused = true
      }
    },
    resumeRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
        this.mediaRecorder.resume()
        this.isPaused = false
      }
    },
    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
        this.isRecording = false
        this.isPaused = false
      }
    },
    deleteRecording() {
      this.recordedVideoUrl = null
      this.recordedChunks = []
    }
  },
  beforeDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
    }
  }
}
</script>

<style scoped>
.camera-container {
  max-width: 640px;
  margin: auto;
}
.video-preview,
.playback {
  width: 100%;
  height: auto;
  border-radius: 8px;
  background: black;
}
.record-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
