const { getDb, isFirebaseConnected } = require('./firebase');

/**
 * Universal Firestore Repository
 * Provides clean CRUD, filtering, pagination, and sorting for all collections.
 */
class FirestoreRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get col() {
    const db = getDb();
    if (!db) return null;
    return db.collection(this.collectionName);
  }

  /**
   * Create document with auto-generated or custom ID
   */
  async create(data, customId = null) {
    const col = this.col;
    if (!col) return null;

    const timestamp = new Date();
    const docData = {
      ...data,
      createdAt: data.createdAt || timestamp,
      updatedAt: timestamp
    };

    if (customId) {
      await col.doc(customId).set(docData);
      return { id: customId, _id: customId, ...docData };
    } else {
      const docRef = await col.add(docData);
      return { id: docRef.id, _id: docRef.id, ...docData };
    }
  }

  /**
   * Find document by ID
   */
  async findById(id) {
    const col = this.col;
    if (!col || !id) return null;

    const doc = await col.doc(id).get();
    if (!doc.exists) return null;

    return { id: doc.id, _id: doc.id, ...doc.data() };
  }

  /**
   * Find a single document matching key/value
   */
  async findOne(field, value) {
    const col = this.col;
    if (!col) return null;

    const snapshot = await col.where(field, '==', value).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, _id: doc.id, ...doc.data() };
  }

  /**
   * Update document by ID
   */
  async findByIdAndUpdate(id, updates) {
    const col = this.col;
    if (!col || !id) return null;

    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;

    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    await docRef.update(updateData);
    const updated = await docRef.get();
    return { id: updated.id, _id: updated.id, ...updated.data() };
  }

  /**
   * Delete document by ID
   */
  async findByIdAndDelete(id) {
    const col = this.col;
    if (!col || !id) return null;

    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;

    await docRef.delete();
    return { id: doc.id, _id: doc.id, ...doc.data() };
  }

  /**
   * Query collection with filters, pagination, and sorting
   */
  async find({ filter = {}, sortField = 'createdAt', sortDirection = 'desc', page = 1, limit = 50 } = {}) {
    const col = this.col;
    if (!col) return { data: [], total: 0, pages: 1, page: 1 };

    let query = col;

    // Apply equality filters
    Object.keys(filter).forEach(key => {
      if (filter[key] !== undefined && filter[key] !== null && filter[key] !== '') {
        query = query.where(key, '==', filter[key]);
      }
    });

    const snapshot = await query.get();
    let items = snapshot.docs.map(doc => ({
      id: doc.id,
      _id: doc.id,
      ...doc.data()
    }));

    // In-memory sort to avoid requiring composite indexes in Firestore for every combination
    if (sortField) {
      items.sort((a, b) => {
        const valA = a[sortField] || 0;
        const valB = b[sortField] || 0;
        if (sortDirection === 'desc') {
          return valB > valA ? 1 : valB < valA ? -1 : 0;
        }
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      });
    }

    const total = items.length;
    const pages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = items.slice(offset, offset + limit);

    return { data: paginated, total, pages, page };
  }

  /**
   * Count documents matching filter
   */
  async countDocuments(filter = {}) {
    const result = await this.find({ filter });
    return result.total;
  }
}

// Pre-configured collection repositories
const admissionsRepo = new FirestoreRepository('admissions');
const enquiriesRepo = new FirestoreRepository('enquiries');
const announcementsRepo = new FirestoreRepository('announcements');
const eventsRepo = new FirestoreRepository('events');
const faqsRepo = new FirestoreRepository('faqs');
const galleryRepo = new FirestoreRepository('gallery');
const testimonialsRepo = new FirestoreRepository('testimonials');
const pageContentRepo = new FirestoreRepository('pageContent');
const adminUsersRepo = new FirestoreRepository('adminUsers');

module.exports = {
  FirestoreRepository,
  admissionsRepo,
  enquiriesRepo,
  announcementsRepo,
  eventsRepo,
  faqsRepo,
  galleryRepo,
  testimonialsRepo,
  pageContentRepo,
  adminUsersRepo,
  isFirebaseConnected
};
