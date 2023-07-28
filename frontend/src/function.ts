import { FirebaseError } from "firebase/app";

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

export { firebaseErrorMessage };