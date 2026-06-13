import uuid
from enum import Enum
from typing import Optional


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"


# In-memory job store (use Redis/DB for production)
jobs: dict = {}


def create_job() -> str:
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "status": JobStatus.PENDING,
        "step": "queued",
        "result": None,
        "error": None,
    }
    return job_id


def update_job(job_id: str, **kwargs):
    if job_id in jobs:
        jobs[job_id].update(kwargs)


def get_job(job_id: str) -> Optional[dict]:
    return jobs.get(job_id)