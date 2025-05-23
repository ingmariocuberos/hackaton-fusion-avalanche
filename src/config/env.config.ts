interface EnvConfig {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  privyAppId: string;
  encryptionKey: string;
  apiBaseUrl: string;
}

const validateEnv = (): EnvConfig => {
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_PRIVY_APP_ID',
    'REACT_APP_ENCRYPTION_KEY',
    'REACT_APP_API_BASE_URL'
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Faltan las siguientes variables de entorno: ${missingVars.join(', ')}`
    );
  }

  return {
    firebaseApiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
    firebaseAuthDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
    firebaseProjectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
    privyAppId: process.env.REACT_APP_PRIVY_APP_ID!,
    encryptionKey: process.env.REACT_APP_ENCRYPTION_KEY!,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL!
  };
};

const envs = validateEnv();

export default envs;
