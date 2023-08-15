import { FirebaseError } from "firebase/app";
import { DocumentReference, getDoc, increment, updateDoc } from "firebase/firestore";

const firebaseErrorMessage = (e: FirebaseError): string => {
    switch (e.code) {
      case 'auth/email-already-in-use':
          return '指定されたメールアドレスは既に使用されています';
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません';
      case 'auth/user-disabled':
        return 'サービスの利用が停止されています';
      case 'auth/user-not-found':
        return 'メールアドレスまたはパスワードが違います';
      case 'auth/weak-password':
        return 'パスワードは6文字以上にしてください';
      case 'auth/wrong-password':
        return 'メールアドレスまたはパスワードが違います';
      case 'auth/operation-not-allowed':
        return "指定されたユーザはこの操作を許可していません";
      case 'auth/unauthorized-domain':
        return '現在この認証方法はご利用頂けません';
      case 'auth/requires-recent-login':
        return '認証の有効期限が切れています';
      default:
        return "不明なエラーが発生しました";
    }
};

// インクリメント
const incrementCounter = async (docRef: DocumentReference) => {
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const currentCounter = data?.counter ?? 0; // 既存のカウンター値を取得、または0を設定
      console.log(data?.counter)
      await updateDoc(docRef, { counter: currentCounter + 1 });
    }
  } catch (error) {
    console.error("Error incrementing counter:", error); // エラーハンドリング
  }
};


// デクリメント
const decrementCounter = async (docRef: DocumentReference) => {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, { counter: increment(-1) });
  }
};

export { firebaseErrorMessage, incrementCounter, decrementCounter };