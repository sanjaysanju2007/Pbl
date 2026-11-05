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
   * Remove undefined values recursively to ensure Firestore safety
   */
  _cleanData(obj) {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') return obj;
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map(item => this._cleanData(item));

    const clean = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        clean[key] = this._cleanData(value);
      }
    }
    return clean;
  }

  /**
   * Normalize Firestore DocumentSnapshot to plain object with string timestamps
   */
  _normalizeDoc(doc) {
    if (!doc || !doc.exists) return null;
    const data = doc.data() || {};

    // Normalize Timestamps to ISO strings
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      data.createdAt = data.createdAt.toDate().toISOString();
    }
    if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
      data.updatedAt = data.updatedAt.toDate().toISOString();
    }
    if (data.publishDate && typeof data.publishDate.toDate === 'function') {
      data.publishDate = data.publishDate.toDate().toISOString();
    }
    if (data.date && typeof data.date.toDate === 'function') {
      data.date = data.date.toDate().toISOString();
    }

    if (Array.isArray(data.statusHistory)) {
      data.statusHistory = data.statusHistory.map(entry => {
        if (entry && entry.changedAt && typeof entry.changedAt.toDate === 'function') {
          return { ...entry, changedAt: entry.changedAt.toDate().toISOString() };
        }
        return entry;
      });
    }

    return {
      id: doc.id,
      _id: data._id || doc.id,
      ...data
    };
  }

  /**
   * Create document with auto-generated or custom ID
   */
  async create(data, customId = null) {
    const col = this.col;
    if (!col) {
      throw new Error(`Firestore not connected. Cannot write to collection '${this.collectionName}'.`);
    }

    const timestamp = new Date().toISOString();
    const cleaned = this._cleanData(data);
    const docData = {
      ...cleaned,
      createdAt: cleaned.createdAt || timestamp,
      updatedAt: timestamp
    };

    if (customId) {
      const docId = String(customId).trim();
      await col.doc(docId).set(docData);
      return { id: docId, _id: docId, ...docData };
    } else {
      const docRef = await col.add(docData);
      return { id: docRef.id, _id: docRef.id, ...docData };
    }
  }

  /**
   * Find document by ID (supports doc ID, applicationNumber, or _id)
   */
  async findById(id) {
    const col = this.col;
    if (!col || !id) return null;
    const stringId = String(id).trim();

    // 1. Direct doc lookup (Supports phone number or custom ID as doc key)
    const doc = await col.doc(stringId).get();
    if (doc.exists) {
      return this._normalizeDoc(doc);
    }

    // 2. Direct lookup by guardianPhone / phone number field
    const phoneDigits = stringId.replace(/\D/g, '');
    if (phoneDigits.length >= 10) {
      const last10 = phoneDigits.slice(-10);
      try {
        const byPhone = await col.where('guardianPhone', '==', last10).limit(1).get();
        if (!byPhone.empty) {
          return this._normalizeDoc(byPhone.docs[0]);
        }
        const byMobile = await col.where('mobile', '==', last10).limit(1).get();
        if (!byMobile.empty) {
          return this._normalizeDoc(byMobile.docs[0]);
        }
      } catch (err) {
        // non-blocking
      }
    }

    // 3. Lookup by applicationNumber if applicable
    const byAppNo = await col.where('applicationNumber', '==', stringId).limit(1).get();
    if (!byAppNo.empty) {
      return this._normalizeDoc(byAppNo.docs[0]);
    }

    // 3. Lookup by _id field
    const byIdField = await col.where('_id', '==', stringId).limit(1).get();
    if (!byIdField.empty) {
      return this._normalizeDoc(byIdField.docs[0]);
    }

    return null;
  }

  /**
   * Find a single document matching key/value
   */
  async findOne(field, value) {
    const col = this.col;
    if (!col) return null;

    const snapshot = await col.where(field, '==', value).limit(1).get();
    if (snapshot.empty) return null;

    return this._normalizeDoc(snapshot.docs[0]);
  }

  /**
   * Update document by ID (supports doc ID or applicationNumber)
   */
  async findByIdAndUpdate(id, updates) {
    const col = this.col;
    if (!col || !id) return null;
    const stringId = String(id).trim();

    let docRef = col.doc(stringId);
    let doc = await docRef.get();

    if (!doc.exists) {
      const byAppNo = await col.where('applicationNumber', '==', stringId).limit(1).get();
      if (!byAppNo.empty) {
        docRef = byAppNo.docs[0].ref;
        doc = byAppNo.docs[0];
      } else {
        const byId = await col.where('_id', '==', stringId).limit(1).get();
        if (!byId.empty) {
          docRef = byId.docs[0].ref;
          doc = byId.docs[0];
        }
      }
    }

    if (!doc.exists) return null;

    const cleanedUpdates = this._cleanData(updates);
    const updateData = {
      ...cleanedUpdates,
      updatedAt: new Date().toISOString()
    };

    await docRef.set(updateData, { merge: true });
    const updated = await docRef.get();
    return this._normalizeDoc(updated);
  }

  /**
   * Delete document by ID
   */
  async findByIdAndDelete(id) {
    const col = this.col;
    if (!col || !id) return null;
    const stringId = String(id).trim();

    let docRef = col.doc(stringId);
    let doc = await docRef.get();

    if (!doc.exists) {
      const byAppNo = await col.where('applicationNumber', '==', stringId).limit(1).get();
      if (!byAppNo.empty) {
        docRef = byAppNo.docs[0].ref;
        doc = byAppNo.docs[0];
      }
    }

    if (!doc.exists) return null;

    const docData = this._normalizeDoc(doc);
    await docRef.delete();
    return docData;
  }

  /**
   * Query collection with filters, in-memory search, pagination, and sorting
   */
  async find({ filter = {}, search = null, searchFields = [], sortField = 'createdAt', sortDirection = 'desc', page = 1, limit = 50 } = {}) {
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
    let items = snapshot.docs.map(doc => this._normalizeDoc(doc));

    // Deduplicate items to ensure each record is represented exactly once
    if (this.collectionName === 'admissions') {
      const seen = new Map();
      items.forEach(item => {
        const key = item.applicationNumber || (item.guardianPhone ? String(item.guardianPhone).replace(/\D/g, '').slice(-10) : null) || item.id || item._id;
        if (!key) return;
        if (!seen.has(key)) {
          seen.set(key, item);
        } else {
          const existing = seen.get(key);
          const isItemPreferred = (item.id && item.id.startsWith('CKP-')) || (new Date(item.updatedAt || item.createdAt || 0) > new Date(existing.updatedAt || existing.createdAt || 0));
          if (isItemPreferred) {
            seen.set(key, { ...existing, ...item });
          }
        }
      });
      items = Array.from(seen.values());
    } else {
      const seen = new Set();
      items = items.filter(item => {
        const key = item.id || item._id;
        if (!key) return true;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // In-memory text search across specified or standard fields
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(item => {
        if (searchFields && searchFields.length > 0) {
          return searchFields.some(field => String(item[field] || '').toLowerCase().includes(q));
        }
        return (
          String(item.childName || '').toLowerCase().includes(q) ||
          String(item.applicationNumber || '').toLowerCase().includes(q) ||
          String(item.name || '').toLowerCase().includes(q) ||
          String(item.guardianEmail || '').toLowerCase().includes(q) ||
          String(item.email || '').toLowerCase().includes(q) ||
          String(item.guardianPhone || '').includes(q) ||
          String(item.phone || '').includes(q) ||
          String(item.primaryContactName || '').toLowerCase().includes(q) ||
          String(item.title || '').toLowerCase().includes(q)
        );
      });
    }

    // Sort items
    if (sortField) {
      items.sort((a, b) => {
        const valA = a[sortField] ? new Date(a[sortField]).getTime() || a[sortField] : 0;
        const valB = b[sortField] ? new Date(b[sortField]).getTime() || b[sortField] : 0;
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
    const result = await this.find({ filter, limit: 10000 });
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
