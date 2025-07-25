<template>
  <div class="camera-container">
    <!-- Live camera preview -->
    <video ref="video" autoplay muted playsinline></video>

    <!-- Recording buttons -->
    <div class="record-buttons">
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

    <!-- Playback after recording -->
    <video
      v-if="recordedVideoUrl"
      :src="recordedVideoUrl"
      controls
      class="playback"
    ></video>

    <!-- Download -->
    <div v-if="recordedVideoUrl" class="download">
      <a :href="recordedVideoUrl" download="recording.webm" class="v-btn primary white--text">
        ⬇️ Download
      </a>
    </div>
  </div>
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
      usingFrontCamera: false
    }
  },
  mounted() {
    this.startCamera()
  },
  methods: {
    async startCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
      }

      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: this.usingFrontCamera ? 'user' : 'environment' },
          audio: true
        })
        this.$refs.video.srcObject = this.stream
      } catch (err) {
        alert('❌ Camera/mic access failed: ' + err.message)
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
.camera-container {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: auto;
  text-align: center;
}

video {
  width: 100%;
  height: auto;
  background: black;
  border-radius: 8px;
}

.record-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.playback {
  margin-top: 20px;
  width: 100%;
  border-radius: 8px;
}

.download {
  margin-top: 12px;
}
</style>
