import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { initializeFirestore, persistentMultipleTabManager, persistentLocalCache } from 'firebase/firestore'

// Your web app's Firebase configuration
//本番
const firebaseConfig = {
  apiKey: "AIzaSyBkdOHDVcVg466hPT2pke-KyQKwQxHnyv0",
  authDomain: "shelfmate-c3c2e.firebaseapp.com",
  projectId: "shelfmate-c3c2e",
  storageBucket: "shelfmate-c3c2e.appspot.com",
  messagingSenderId: "500770876001",
  appId: "1:500770876001:web:a8161d35d07593cf701820"
};

//デバッグ用
// const firebaseConfig = {
//   apiKey: 'AIzaSyD7UUbArL8l6FHaX62kHDwkY-SwJVAiyCo',
//   authDomain: 'bookshelfy-fce34.firebaseapp.com',
//   projectId: 'bookshelfy-fce34',
//   storageBucket: 'bookshelfy-fce34.appspot.com',
//   messagingSenderId: '505546332743',
//   appId: '1:505546332743:web:1ce31e7dd423809d9aaf62'
// }

const app = initializeApp(firebaseConfig)
// Use multi-tab IndexedDb persistence.

  
export const firebaseAuth = getAuth(app)
export const firestore = initializeFirestore(app,
  {localCache:
    persistentLocalCache(/*settings*/{tabManager: persistentMultipleTabManager()})
  });
export const getCurrentUser = async (): Promise<User> => {
  return new Promise<User>((resolve) => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user && user.emailVerified) {
        resolve(user)
      }
    })
  })
}
