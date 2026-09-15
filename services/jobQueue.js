/**
 * Task 8 Background Job Queue & Asynchronous Task Worker
 * Simulates asynchronous email dispatch, report generation, and background activity logging.
 */

class BackgroundJobQueue {
  constructor() {
    this.jobs = new Map();
    this.nextJobId = 1;
  }

  // Create & Enqueue a job
  enqueue(jobType, payload) {
    const id = `job_${this.nextJobId++}_${Date.now()}`;
    const job = {
      id,
      jobType,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    this.jobs.set(id, job);

    // Process job asynchronously in background without blocking response
    setImmediate(() => this.processJob(id));

    return job;
  }

  // Worker processor
  async processJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'processing';
    job.attempts += 1;

    try {
      // Simulate asynchronous IO processing (e.g. sending email, generating PDF)
      await new Promise(resolve => setTimeout(resolve, 2000));

      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.result = `Successfully processed ${job.jobType} for user ${job.payload.email || 'N/A'}`;
      console.log(`⚡ Background Worker: Job ${jobId} [${job.jobType}] COMPLETED.`);
    } catch (err) {
      job.status = 'failed';
      job.error = err.message;
      console.error(`❌ Background Worker: Job ${jobId} FAILED.`);
    }
  }

  // Check Job Status
  getJobStatus(jobId) {
    return this.jobs.get(jobId) || null;
  }
}

const jobQueue = new BackgroundJobQueue();
module.exports = jobQueue;
