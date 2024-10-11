<script setup lang="ts">
import SubmitButton from '@/basic//Login/SubmitButton.vue'
import Label from '@/basic/Label.vue'
import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  getAdditionalUserInfo
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import ErrorMessage from '@/basic/ErrorMessage.vue'
import { firebaseErrorMessage } from '@/function'
import { firebaseAuth } from '@/config/firebase'
import { watch, computed } from 'vue'
import { rules } from '@/validation'
import { initBookshelf } from '@/function'

interface Emits {
  (event: 'submitButton'): void
  (event: 'updateLoading', flag: boolean): void
}

const emit = defineEmits<Emits>()

const email = ref('')
const emailError = ref('')
const password = ref('')
const passwordError = ref('')
const errorMessage = ref('')

const submitButton = async () => {
  emit('updateLoading', true)

  try {
    const providers = await fetchSignInMethodsForEmail(firebaseAuth, email.value)

    if (providers.findIndex((p) => p === EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) !== -1) {
      errorMessage.value = 'すでに登録されています'
      return
    }
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email.value, password.value)
    const actionCodeSettings = {
      url: 'http://shelfmate.hzmintech.com/login', // replace this with the URL of your top page
      //url: 'http://localhost/login',
      handleCodeInApp: true
    }

    const isNewUser = getAdditionalUserInfo(cred)?.isNewUser //新しく登録された？

    if (isNewUser) await initBookshelf(cred.user) //始まりの本棚を作成

    await sendEmailVerification(cred.user, actionCodeSettings)
    emit('updateLoading', false)
    emit('submitButton')
  } catch (e) {
    if (e instanceof FirebaseError) {
      errorMessage.value = firebaseErrorMessage(e)
    }
    emit('updateLoading', false)
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
  const validationResult = rules.password(newVal)
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
  <v-form>
    <v-row class="mx-1">
      <v-col cols="12">
        <ErrorMessage :errorMessage="errorMessage"></ErrorMessage>
      </v-col>
      <v-col cols="12" class="pb-2">
        <p>ユーザIDとして登録するメールアドレスを入力してください。</p>
      </v-col>
      <v-col cols="12" class="pt-0">
        <p>入力したメールアドレスに確認メールを送信します。</p>
      </v-col>
    </v-row>
    <v-row class="mx-1">
      <v-col cols="12">
        <Label text="メールアドレス" class="mb-3"></Label>
        <input type="text" class="input-form ps-2 py-1" v-model="email" />
        <div v-if="emailError" class="error-message">{{ emailError }}</div>
      </v-col>
      <v-col cols="12" class="mt-3">
        <Label text="パスワード" class="mb-3"></Label>
        <input type="password" class="input-form ps-2 py-1" v-model="password" />
        <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
      </v-col>
      <v-col cols="12" class="mb-3">
        <SubmitButton
          @submitButton="submitButton"
          text="アカウントを作成する"
          color="red"
          :disabled="isButtonDisabled"
        ></SubmitButton>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped lang="scss">
.input-form {
  background-color: white;
  border: 1px solid rgb(206, 205, 205);
  width: 100%;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
