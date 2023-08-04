<script setup lang="ts">
import { ref, onBeforeUnmount} from 'vue';
import axios from 'axios';
import { onMounted } from 'vue';

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const constraints: MediaStreamConstraints = {
    video: true,
}

onMounted(() => {
    navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
        if(videoRef.value && videoRef.value != null) {
            videoRef.value.srcObject = stream;
            videoRef.value.play()
        }
    })
})

const stopVideo = () => {
    if (videoRef.value && videoRef.value.srcObject) {
        const tracks = (videoRef.value.srcObject as MediaStream).getTracks();
        tracks.forEach((track: MediaStreamTrack) => {
            track.stop();
        });
        videoRef.value.srcObject = null;
    }
};

const captureImage = async () => {
    console.log(canvasRef.value)
    if(videoRef.value && canvasRef.value){
        const canvas = canvasRef.value;
        const video = videoRef.value;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);

        const imgDataUrl = canvas.toDataURL('image/png');
        
        const blobBin = atob(imgDataUrl.split(',')[1]);
        console.log(blobBin)
        const array = [];

        for(let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }

        const file = new Blob([new Uint8Array(array)], {type: 'image/png'});
        const formData = new FormData();
        formData.append('image', file);
       

        await axios.post('/api/upload', formData)
        .then(res => console.log(res))
        .catch(e => console.log(e));
    }
}

// startVideo(); // Initially start the video

onBeforeUnmount(() => {
    stopVideo();
});
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
        <canvas ref="canvasRef" style="display: none;" id="canvas"></canvas>
    </v-row>
</template>