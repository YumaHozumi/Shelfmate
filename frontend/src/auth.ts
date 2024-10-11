import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { firebaseAuth } from '@/config/firebase'

/**
 * Google認証を行う関数
 * @returns Promise<UserCredential> Firebaseのユーザー情報
 */
const googleLogin = async () => {
  const provider = new GoogleAuthProvider()
  return await signInWithPopup(firebaseAuth, provider);
};

export { googleLogin }