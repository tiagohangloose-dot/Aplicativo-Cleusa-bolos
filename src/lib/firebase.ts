import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, setDoc, updateDoc, addDoc, deleteDoc, getDocFromServer } from 'firebase/firestore';
import { Pedido, BoloSabor, BoloTamanho, AdicionalExtra, BoloSalgadoTamanho, BoloPiscinaSabor } from '../types';
import {
  INITIAL_FLAVORS,
  INITIAL_SIZES,
  INITIAL_EXTRAS,
  INITIAL_SALGADO_SIZES,
  INITIAL_PISCINA_SABORES,
  INITIAL_PISCINA_PRECO
} from '../initialData';
import firebaseConfigJson from '../../firebase-applet-config.json';

// 1. Load Firebase configuration securely from environment variables, fallback to applet configuration
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

const databaseId = (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId || "ai-studio-81d5fac5-1ec7-403d-895a-5a9a25add614";

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the database ID
export const db = getFirestore(app, databaseId);

// Error Handling Infrastructure
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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  console.error('[Firebase Error Detail]:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

// 2. Validate connection on app startup
async function testConnection() {
  try {
    const testDocRef = doc(db, 'settings', 'cleusa_config');
    await getDocFromServer(testDocRef);
    console.log("🔥 [Firebase] Conexão com o Firestore estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ [Firebase] Erro de Conexão/Permissão na inicialização do Firestore:", error);
  }
}
testConnection();

// Dynamic cover image fallbacks to preserve visual presets
const defaultImgDoce = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgm8Ww9FF4UuIIV4mS5CCF1rzWZ-TpARtIhG-Q5ZoiqvPuZ3W2BatsiIeYhoq1LrFPjUqDo5eSLxClwZ2RpmjXLkcHNPkEdYwBIMfod0OKPIhC_7bOnVqRCMp3yF-sLGdAYwqpHfQUChex6La0BHwWe642yGrol6f7Ivq95C9UrNm-D7sDjSXgkJDLrXmf8o4zAMVxdchfs2Y1FK7Xk6hr4y2ODbctk93w0SNa35rHexu3VB-km660W5gljd1HxBd37tUZRYUW7rye';
const defaultImgSalgado = 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=800&auto=format&fit=crop&q=80';
const defaultImgPiscina = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80';

export interface AppSettings {
  sabores: BoloSabor[];
  tamanhos: BoloTamanho[];
  extras: AdicionalExtra[];
  tamanhosSalgado: BoloSalgadoTamanho[];
  saboresPiscina: BoloPiscinaSabor[];
  precoPiscina: number;
  taxaDoisRecheios: number;
  taxaSaborEspecial: number;
  taxaEntrega: number;
  imagemBoloDoce: string;
  imagemBoloSalgado: string;
  imagemBoloPiscina: string;
}

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'cleusa_config';
const PEDIDOS_COLLECTION = 'pedidos';

/**
 * Sync App settings from Firestore. If document doesn't exist, it seeds it automatically with INITIAL data.
 */
export function listenToSettings(onSync: (settings: AppSettings) => void) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

  return onSnapshot(docRef, async (snapshot) => {
    try {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onSync({
          sabores: data.sabores || INITIAL_FLAVORS,
          tamanhos: data.tamanhos || INITIAL_SIZES,
          extras: data.extras || INITIAL_EXTRAS,
          tamanhosSalgado: data.tamanhosSalgado || INITIAL_SALGADO_SIZES,
          saboresPiscina: data.saboresPiscina || INITIAL_PISCINA_SABORES,
          precoPiscina: typeof data.precoPiscina === 'number' ? data.precoPiscina : INITIAL_PISCINA_PRECO,
          taxaDoisRecheios: typeof data.taxaDoisRecheios === 'number' ? data.taxaDoisRecheios : 25.00,
          taxaSaborEspecial: typeof data.taxaSaborEspecial === 'number' ? data.taxaSaborEspecial : 20.00,
          taxaEntrega: typeof data.taxaEntrega === 'number' ? data.taxaEntrega : 20.00,
          imagemBoloDoce: data.imagemBoloDoce || defaultImgDoce,
          imagemBoloSalgado: data.imagemBoloSalgado || defaultImgSalgado,
          imagemBoloPiscina: data.imagemBoloPiscina || defaultImgPiscina
        });
      } else {
        // Seed initial settings document safely
        const initialSettings: AppSettings = {
          sabores: INITIAL_FLAVORS,
          tamanhos: INITIAL_SIZES,
          extras: INITIAL_EXTRAS,
          tamanhosSalgado: INITIAL_SALGADO_SIZES,
          saboresPiscina: INITIAL_PISCINA_SABORES,
          precoPiscina: INITIAL_PISCINA_PRECO,
          taxaDoisRecheios: 25.0,
          taxaSaborEspecial: 20.0,
          taxaEntrega: 20.0,
          imagemBoloDoce: defaultImgDoce,
          imagemBoloSalgado: defaultImgSalgado,
          imagemBoloPiscina: defaultImgPiscina
        };
        await setDoc(docRef, initialSettings);
        onSync(initialSettings);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`);
    }
  }, (err) => {
    console.error('Error listening to Settings:', err);
    handleFirestoreError(err, OperationType.GET, `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`);
  });
}

/**
 * Update app settings in Firestore
 */
export async function saveSettingsToCloud(updatedSettings: Partial<AppSettings>) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  try {
    await setDoc(docRef, updatedSettings, { merge: true });
  } catch (err) {
    console.error('Error updating app settings:', err);
    handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`);
  }
}

/**
 * Real-time orders synchronization from Cloud
 */
export function listenToOrders(onSync: (orders: Pedido[]) => void) {
  const colRef = collection(db, PEDIDOS_COLLECTION);

  return onSnapshot(colRef, (snapshot) => {
    const list: Pedido[] = [];
    snapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as Pedido);
    });
    // Sort orders by creation date (descending) so latest orders appear first
    list.sort((a, b) => {
      const timeA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
      const timeB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
      return timeB - timeA;
    });
    onSync(list);
  }, (err) => {
    console.error('Error listening to Orders collection:', err);
    handleFirestoreError(err, OperationType.LIST, PEDIDOS_COLLECTION);
  });
}

/**
 * Add a new order to Firebase Cloud
 */
export async function saveOrderToCloud(pedido: Omit<Pedido, 'id'>) {
  const colRef = collection(db, PEDIDOS_COLLECTION);
  try {
    const docRef = await addDoc(colRef, {
      ...pedido,
      dataCriacao: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    console.error('Error saving order to Cloud Firestore:', err);
    handleFirestoreError(err, OperationType.CREATE, PEDIDOS_COLLECTION);
    throw err;
  }
}

/**
 * Update an existing order status or values
 */
export async function updateOrderInCloud(pedidoId: string, updatedFields: Partial<Pedido>) {
  const docRef = doc(db, PEDIDOS_COLLECTION, pedidoId);
  try {
    await updateDoc(docRef, updatedFields);
  } catch (err) {
    console.error('Error updating order:', err);
    handleFirestoreError(err, OperationType.UPDATE, `${PEDIDOS_COLLECTION}/${pedidoId}`);
  }
}

/**
 * Delete an order from Firebase Cloud
 */
export async function deleteOrderFromCloud(pedidoId: string) {
  const docRef = doc(db, PEDIDOS_COLLECTION, pedidoId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting order:', err);
    handleFirestoreError(err, OperationType.DELETE, `${PEDIDOS_COLLECTION}/${pedidoId}`);
  }
}
