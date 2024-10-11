<script setup lang="ts">
import SubmitButton from '@/basic//Login/SubmitButton.vue'
import GoogleButton from '@/basic/Login/GoogleButton.vue'
import Link from '@/basic/Login/Link.vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ref, watch, computed } from 'vue'
import { FirebaseError } from 'firebase/app'
import ErrorMessage from '@/basic/ErrorMessage.vue'
import { firebaseErrorMessage } from '@/function'
import { firebaseAuth } from '@/config/firebase'
import { rules } from '@/validation'
import { googleLogin } from '@/auth' 

interface Emits {
  (event: 'navigate', name: string): void
}

const emit = defineEmits<Emits>()

const email = ref('')
const emailError = ref('')
const password = ref('')
const passwordError = ref('')
const errorMessage = ref('')

const onClickLogin = () => {
  emit('navigate', 'AppTop')
}

const submitButton = async () => {
  try {
    const cred = await signInWithEmailAndPassword(firebaseAuth, email.value, password.value)
    if (!cred.user.emailVerified) errorMessage.value = 'メール認証が終了していません'
    else onClickLogin()
  } catch (e) {
    if (e instanceof FirebaseError) {
      errorMessage.value = firebaseErrorMessage(e)
    }
  }
}

const clickGoogleButton = async () => {
  try {
    await googleLogin()
  } catch (e) {
    if (e instanceof FirebaseError) {
      errorMessage.value = firebaseErrorMessage(e)
    }
  }
}

watch(email, (newVal) => {
  const validationResult = rules.email(newVal)
  if (typeof validationResult === 'string') {
    emailError.value = validationResult
  } else {
    emailError.value = ''
  }
})

watch(password, (newVal) => {
  const validationResult = rules.required(newVal)
  if (typeof validationResult === 'string') {
    passwordError.value = validationResult
  } else {
    passwordError.value = ''
  }
})

const isButtonDisabled = computed(() => {
  return emailError.value !== '' || passwordError.value !== '' || !email.value || !password.value
})
</script>

<template>
  <v-container>
    <v-row>
      <v-sheet width="450" class="mx-auto px-6 py-6 form mt-3">
        <v-form>
          <v-row>
            <v-col cols="12">
              <ErrorMessage :errorMessage="errorMessage"></ErrorMessage>
            </v-col>
            <v-col cols="12" class="pb-0">
              <p>ログインIDとパスワードを入力してください</p>
            </v-col>
            <v-col cols="12">
              <input type="text" class="input-form ps-2" v-model="email" />
              <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </v-col>
            <v-col cols="12">
              <input type="password" class="input-form ps-2" v-model="password" />
              <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            </v-col>
            <v-col cols="12">
              <SubmitButton
                @submitButton="submitButton"
                text="ログイン"
                color="blue"
                :disabled="isButtonDisabled"
              ></SubmitButton>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-row>
    <v-row>
      <v-sheet width="450" class="form mx-auto">
        <v-divider></v-divider>
        <v-row class="px-6 pb-6 pt-3">
          <v-col cols="12">
            <p>他サービスでログイン</p>
          </v-col>
          <v-col cols="12">
            <GoogleButton
              @clickGoogleButton="clickGoogleButton"
              text="Googleでログイン"
            ></GoogleButton>
          </v-col>
        </v-row>
      </v-sheet>
    </v-row>
    <v-row>
      <v-sheet width="450" class="mx-auto text-center pt-3">
        <Link text="アカウントをお持ちでない方はこちらから" name="Register"></Link>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.form {
  background-color: #f5f5f5;

  .input-form {
    background-color: white;
    border: 1px solid grey;
    width: 100%;
  }

  .error-message {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
}
</style>
