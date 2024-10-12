import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo} from 'firebase/auth'
import { firebaseAuth } from '@/config/firebase'
import {type User} from 'firebase/auth';

/**
 * Google認証を行う関数
 * @returns Promise<UserCredential> Firebaseのユーザー情報
 */
const googleLogin = async () => {
  const provider = new GoogleAuthProvider()
  return await signInWithPopup(firebaseAuth, provider);
};

/**
 * 初回認証時の処理も含めてログイン処理を行う関数
 * @param loginMethod ログインの種類(例: google認証，メール認証)
 * @param onFirstLogin 初回認証の際に行う処理
 * @param onLogin ログイン時に行う処理
 */
const handleLogin = async (
  loginMethod: () => Promise<any>,
  onFirstLogin: (user: User) => Promise<void>,
  onLogin?: () => Promise<void> | void
) => {
  const cred = await loginMethod()
  if (cred?.user) {
    const isNewUser = getAdditionalUserInfo(cred)?.isNewUser
    if (isNewUser) await onFirstLogin(cred.user)
    if (onLogin) await onLogin()
  }

  return cred
}

export { googleLogin, handleLogin }