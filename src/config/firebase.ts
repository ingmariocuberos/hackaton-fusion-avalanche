import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import envs from './env.config';

const firebaseConfig = {
  apiKey: envs.firebaseApiKey,
  authDomain: envs.firebaseAuthDomain,
  projectId: envs.firebaseProjectId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
