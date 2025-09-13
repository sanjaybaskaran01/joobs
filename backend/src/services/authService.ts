import { getAuth } from '../config/firebase';

export const createCustomToken = async (uid: string): Promise<string> => {
  try {
    const auth = getAuth();
    const customToken = await auth.createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw new Error('Failed to create custom token');
  }
};

export const verifyIdToken = async (idToken: string) => {
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Invalid token');
  }
};

export const getUserByUid = async (uid: string) => {
  try {
    const auth = getAuth();
    const user = await auth.getUser(uid);
    return user;
  } catch (error) {
    console.error('Error getting user by UID:', error);
    throw new Error('User not found');
  }
};

