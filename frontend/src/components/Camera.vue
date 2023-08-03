<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';


const captureStream = ref<MediaStream | undefined>();
const constraints: MediaStreamConstraints = {
    video: true,
}

const stopVideo = () => {
    if (captureStream.value) {
        
        captureStream.value.getTracks().forEach(track => {
            track.stop()
        })
    }
    captureStream.value = undefined;
}

const gotStream = (stream: MediaStream) => {
    captureStream.value = stream;
}

const handleError = (error: Error) => {
    console.error(error.name, error.message);
}

const startVideo = () => {
    navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .catch(handleError);
}

startVideo(); // Initially start the video

//コンポーネントが消えたらカメラ停止
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
    </v-row>
    <v-row>
        <video :srcObject.prop="captureStream" v-if="captureStream" id="video" autoplay playsinlin muted></video>

    </v-row>
</template>