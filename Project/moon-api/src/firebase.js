import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';

// Зчитуємо наш секретний ключ
const serviceAccount = JSON.parse(
    await readFile(new URL('../serviceAccountKey.json', import.meta.url))
);

// Ініціалізуємо Firebase з правами адміністратора
initializeApp({
    credential: cert(serviceAccount)
});

// Отримуємо доступ до бази даних
const db = getFirestore();

console.log(' Підключення до Firebase Firestore успішно встановлено!');

export { db };