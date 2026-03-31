import { db } from '../firebase.js';

class UserRepository {
    constructor() {
        // Створює нову колекцію 'users' у твоїй базі даних
        this.collection = db.collection('users');
    }

    // Метод для пошуку користувача за email
    async findByEmail(email) {
        const snapshot = await this.collection.where('email', '==', email).get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }


    async createUser(userData) {
        const docRef = await db.collection('users').add(userData);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    }


    // Метод для збереження нового користувача
    async create(userData) {
        const docRef = await db.collection('users').add(userData);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() };
    }
}

export const userRepository = new UserRepository();