/**
 * Temporary In-Memory Storage for Task 2 & Fallback Storage
 * Stores submissions in server memory prior to database insertion.
 */

class TempSubmissionsStore {
  constructor() {
    this.submissions = [];
    this.nextId = 1;
  }

  // Add submission
  add(data) {
    const record = {
      id: this.nextId++,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      address: data.address,
      city: data.city,
      termsAccepted: Boolean(data.termsAccepted),
      submittedAt: new Date().toISOString()
    };
    this.submissions.push(record);
    return record;
  }

  // Get all submissions
  getAll() {
    return [...this.submissions];
  }

  // Find by email
  findByEmail(email) {
    return this.submissions.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  // Clear store (for testing)
  clear() {
    this.submissions = [];
    this.nextId = 1;
  }
}

const tempStore = new TempSubmissionsStore();
module.exports = tempStore;
