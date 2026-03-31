import { db } from '../firebase.js';

class WatchlistRepository {
  constructor() {
    // Вказуємо назву колекції в базі даних
    this.collection = db.collection('watchlists');
  }

  // Отримати всі фільми конкретного користувача
  async getByUserId(userId) {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    if (snapshot.empty) {
      return [];
    }
    
    // Перетворюємо дані з формату Firebase у звичайний масив
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Зберегти новий фільм у список
  async addMovie(movieData) {
    const newDocRef = this.collection.doc(); // Створюємо новий документ
    await newDocRef.set({
      ...movieData,
      addedAt: new Date().toISOString()
    });
    return { id: newDocRef.id, ...movieData };
  }

  // Видалити фільм зі списку
  async deleteMovie(docId) {
    await this.collection.doc(docId).delete();
    return true;
  }
}

// Експортуємо готовий об'єкт репозиторію
export const watchlistRepository = new WatchlistRepository();