import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase - only once
let firebaseApp: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
} else {
  firebaseApp = getApps()[0];
  auth = getAuth(firebaseApp);
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const firebaseAuth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Get current user token
  getIdToken: async (forceRefresh: boolean = false) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { token: null, error: 'No user logged in' };
      }
      const token = await currentUser.getIdToken(forceRefresh);
      return { token, error: null };
    } catch (error: any) {
      return { token: null, error: error.message };
    }
  },

  // Auth state change listener
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser: () => auth.currentUser,

  // Send email verification
  sendVerificationEmail: async (user: User) => {
    try {
      await sendEmailVerification(user);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Update user profile
  updateUserProfile: async (user: User, displayName: string, photoURL?: string) => {
    try {
      await updateProfile(user, { displayName, photoURL });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Phone authentication setup (requires recaptcha)
  setupRecaptcha: (containerId: string) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'normal',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired
        }
      });
      return { verifier: recaptchaVerifier, error: null };
    } catch (error: any) {
      return { verifier: null, error: error.message };
    }
  },

  // Send OTP to phone number
  sendPhoneOTP: async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return { confirmationResult, error: null };
    } catch (error: any) {
      return { confirmationResult: null, error: error.message };
    }
  },

  // Verify phone OTP
  verifyPhoneOTP: async (confirmationResult: ConfirmationResult, otp: string) => {
    try {
      const result = await confirmationResult.confirm(otp);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Check if email link is valid
  isValidEmailLink: (emailLink: string) => {
    return isSignInWithEmailLink(auth, emailLink);
  },

  // Sign in with email link
  signInWithLink: async (email: string, emailLink: string) => {
    try {
      const result = await signInWithEmailLink(auth, email, emailLink);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },
};

export { auth, firebaseApp };
