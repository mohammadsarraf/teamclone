import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

export const signInUser = async (username: string, password: string) => {
  // Implement sign-in logic here
  return { success: true }; // Placeholder
};

export const signOutUser = async () => {
  // Implement sign-out logic here
  return { success: true }; // Placeholder
};

export const handleGoogleLogin = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // @ts-ignore
    const token = credential.accessToken;
    const user = result.user;
    // Handle successful login
  } catch (error) {
    // @ts-ignore
    const errorMessage = error.message;
    // Handle Errors here.
    throw new Error(errorMessage);
  }
};

export const handleGithubLogin = async () => {
  const auth = getAuth();
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    // @ts-ignore
    const token = credential.accessToken;
    const user = result.user;
    // Handle successful login
  } catch (error) {
    // @ts-ignore
    const errorMessage = error.message;
    // Handle Errors here.
    throw new Error(errorMessage);
  }
};
