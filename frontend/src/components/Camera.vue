<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const constraints: MediaStreamConstraints = {
  video: true
}

onMounted(() => {
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    if (videoRef.value && videoRef.value != null) {
      videoRef.value.srcObject = stream
      videoRef.value.play()
    }
  })
})

const stopVideo = () => {
  if (videoRef.value && videoRef.value.srcObject) {
    const tracks = (videoRef.value.srcObject as MediaStream).getTracks()
    tracks.forEach((track: MediaStreamTrack) => {
      track.stop()
    })
    videoRef.value.srcObject = null
  }
}

const captureImage = async () => {
  if (videoRef.value && canvasRef.value) {
    const canvas = canvasRef.value
    const video = videoRef.value

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)

    // それからcanvasを画像として取得します
    const dataUrl = canvas.toDataURL()
    const blob = dataURLtoBlob(dataUrl)

    await uploadFile(blob)
  }
}

const uploadFile = async (file: Blob) => {
  const formData = new FormData()
  formData.append('file', new File([file], 'canvasImage.png'))
  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

const dataURLtoBlob = (dataurl: string) => {
  const arr = dataurl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  if (!mimeMatch) {
    throw new Error('Invalid data URL')
  }
  const mime = mimeMatch[1]
  const bstr = atob(arr[1])
  let n = bstr.length // 'const' を 'let' に変更
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// startVideo(); // Initially start the video

onBeforeUnmount(() => {
  stopVideo()
})
</script>

<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-btn @click="stopVideo">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-btn @click="captureImage">test</v-btn>
  </v-row>
  <v-row>
    <video ref="videoRef" id="video" autoplay playsinlin muted></video>
    <canvas ref="canvasRef" style="display: none" id="canvas"></canvas>
  </v-row>
</template>
