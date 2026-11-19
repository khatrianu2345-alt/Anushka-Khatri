import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { OrderRecord } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return signOut(auth);
}

export async function syncUserProfile(user: User): Promise<void> {
  if (!user.uid || !user.email) return;
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);

  const displayName = (user.displayName || user.email.split('@')[0] || 'BloomBox Member').slice(0, 100);
  const email = user.email.slice(0, 200);
  const photoURL = user.photoURL ? user.photoURL.slice(0, 500) : undefined;

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const createPayload: Record<string, unknown> = {
        uid: user.uid,
        displayName,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (photoURL) {
        createPayload.photoURL = photoURL;
      }
      await setDoc(userRef, createPayload);
    } else {
      const updatePayload: Record<string, unknown> = {
        displayName,
        email,
        updatedAt: serverTimestamp(),
      };
      if (photoURL) {
        updatePayload.photoURL = photoURL;
      }
      await updateDoc(userRef, updatePayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export interface SavedFirestoreOrder {
  orderId: string;
  userId: string;
  recipientName: string;
  phone: string;
  address: string;
  pincode: string;
  slotLabel: string;
  paymentMethod: string;
  total: number;
  itemCount: number;
  status: 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  createdAtMs: number;
}

export async function saveUserOrder(
  user: User,
  order: OrderRecord
): Promise<void> {
  const orderPath = `users/${user.uid}/orders/${order.orderId}`;
  const orderRef = doc(db, 'users', user.uid, 'orders', order.orderId);

  try {
    await syncUserProfile(user);
    await setDoc(orderRef, {
      orderId: order.orderId.slice(0, 32),
      userId: user.uid,
      recipientName: order.recipientName.slice(0, 100),
      phone: order.phone.slice(0, 25),
      address: order.address.slice(0, 300),
      pincode: order.pincode.slice(0, 10),
      slotLabel: order.slot.label.slice(0, 80),
      paymentMethod: order.paymentMethod.slice(0, 60),
      total: order.total,
      itemCount: Math.max(1, order.itemCount),
      status: 'confirmed',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, orderPath);
  }
}

export function subscribeToUserOrders(
  userId: string,
  onOrders: (orders: SavedFirestoreOrder[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const ordersPath = `users/${userId}/orders`;
  const q = query(
    collection(db, 'users', userId, 'orders'),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: SavedFirestoreOrder[] = snapshot.docs.map((d) => {
        const data = d.data();
        const ts = data.createdAt as Timestamp | null | undefined;
        return {
          orderId: String(data.orderId || d.id),
          userId: String(data.userId || userId),
          recipientName: String(data.recipientName || ''),
          phone: String(data.phone || ''),
          address: String(data.address || ''),
          pincode: String(data.pincode || ''),
          slotLabel: String(data.slotLabel || ''),
          paymentMethod: String(data.paymentMethod || ''),
          total: Number(data.total || 0),
          itemCount: Number(data.itemCount || 1),
          status:
            (data.status as SavedFirestoreOrder['status']) || 'confirmed',
          createdAtMs: ts ? ts.toMillis() : Date.now(),
        };
      });
      list.sort((a, b) => b.createdAtMs - a.createdAtMs);
      onOrders(list);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, ordersPath);
      }
    }
  );
}
