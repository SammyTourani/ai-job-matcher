# API Reference

This document describes the API endpoints and data structures for the AI Job Matcher platform. The application uses Next.js API routes for backend functionality.

## 🔧 Base URL

```
Local Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

The API uses Supabase JWT tokens for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📋 Data Types

### Job
```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements: string[];
  skills: string[];
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote_option: boolean;
  created_at: string;
  updated_at: string;
}
```

### Resume
```typescript
interface Resume {
  id: string;
  user_id: string;
  filename: string;
  file_url: string;
  extracted_text: string;
  parsed_data: ParsedResumeData;
  created_at: string;
  updated_at: string;
}

interface ParsedResumeData {
  skills: string[];
  experience_years: number;
  education: Education[];
  job_titles: string[];
  summary?: string;
}
```

### Job Match
```typescript
interface JobMatch {
  id: string;
  user_id: string;
  job_id: string;
  resume_id: string;
  match_score: number;
  skills_match: number;
  experience_match: number;
  location_match: number;
  title_match: number;
  explanation: string;
  created_at: string;
}
```

## 🎯 Jobs API

### GET /api/jobs

Retrieve job listings with optional filters.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `query` (string, optional): Search query
- `location` (string, optional): Location filter
- `experience_level` (string, optional): Experience level filter
- `job_type` (string, optional): Job type filter
- `remote_only` (boolean, optional): Remote jobs only
- `salary_min` (number, optional): Minimum salary
- `salary_max` (number, optional): Maximum salary

**Example Request:**
```http
GET /api/jobs?page=1&limit=10&query=react&location=san%20francisco&remote_only=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Senior React Developer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA",
        "salary_min": 120000,
        "salary_max": 180000,
        "description": "Build amazing user interfaces...",
        "requirements": ["5+ years React experience", "..."],
        "skills": ["React", "TypeScript", "Node.js"],
        "experience_level": "senior",
        "job_type": "full-time",
        "remote_option": true,
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "total_pages": 5
    }
  }
}
```

### GET /api/jobs/[id]

Get a specific job by ID.

**Parameters:**
- `id` (string): Job ID

**Example Request:**
```http
GET /api/jobs/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Senior React Developer",
    "company": "TechCorp Inc.",
    "location": "San Francisco, CA",
    "salary_min": 120000,
    "salary_max": 180000,
    "description": "Build amazing user interfaces...",
    "requirements": ["5+ years React experience", "..."],
    "skills": ["React", "TypeScript", "Node.js"],
    "experience_level": "senior",
    "job_type": "full-time",
    "remote_option": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

## 📄 Resumes API

### POST /api/resumes/upload

Upload and parse a resume file.

**Headers:**
```http
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Form Data:**
- `file` (File): Resume file (PDF or DOC)

**Example Request:**
```javascript
const formData = new FormData();
formData.append('file', resumeFile);

fetch('/api/resumes/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "resume-uuid",
    "user_id": "user-uuid",
    "filename": "john_doe_resume.pdf",
    "file_url": "https://storage.url/resumes/john_doe_resume.pdf",
    "extracted_text": "John Doe\nSenior Developer...",
    "parsed_data": {
      "skills": ["React", "Node.js", "TypeScript"],
      "experience_years": 5,
      "education": [
        {
          "degree": "Bachelor of Science in Computer Science",
          "school": "University of Technology",
          "year": 2018
        }
      ],
      "job_titles": ["Senior Developer", "Full Stack Engineer"],
      "summary": "Experienced developer with expertise in..."
    },
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

### GET /api/resumes

Get user's resumes.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "resume-uuid",
      "user_id": "user-uuid",
      "filename": "john_doe_resume.pdf",
      "file_url": "https://storage.url/resumes/john_doe_resume.pdf",
      "parsed_data": {
        "skills": ["React", "Node.js"],
        "experience_years": 5,
        "education": [...],
        "job_titles": [...],
        "summary": "..."
      },
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### DELETE /api/resumes/[id]

Delete a resume.

**Headers:**
```http
Authorization: Bearer <token>
```

**Parameters:**
- `id` (string): Resume ID

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

## 🎯 Matching API

### POST /api/matches/generate

Generate job matches for a user's resume.

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "resume_id": "resume-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "match-uuid",
        "user_id": "user-uuid",
        "job_id": "job-uuid",
        "resume_id": "resume-uuid",
        "match_score": 0.92,
        "skills_match": 0.95,
        "experience_match": 0.85,
        "location_match": 0.90,
        "title_match": 0.98,
        "explanation": "Excellent match! Your React and TypeScript skills...",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 15
  }
}
```

### GET /api/matches

Get user's job matches.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `min_score` (number, optional): Minimum match score (0-1)

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "total_pages": 2
    }
  }
}
```

## 👤 User API

### GET /api/user/profile

Get user profile.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://avatar.url",
    "location": "San Francisco, CA",
    "bio": "Experienced developer...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

### PUT /api/user/profile

Update user profile.

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "location": "San Francisco, CA",
  "bio": "Experienced full-stack developer..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "location": "San Francisco, CA",
    "bio": "Experienced full-stack developer...",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

## 📝 Applications API

### POST /api/applications

Apply for a job.

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "job_id": "job-uuid",
  "resume_id": "resume-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "application-uuid",
    "user_id": "user-uuid",
    "job_id": "job-uuid",
    "resume_id": "resume-uuid",
    "status": "applied",
    "applied_at": "2024-01-15T10:00:00Z"
  }
}
```

### GET /api/applications

Get user's job applications.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string, optional): Filter by status
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "application-uuid",
        "user_id": "user-uuid",
        "job_id": "job-uuid",
        "resume_id": "resume-uuid",
        "status": "applied",
        "applied_at": "2024-01-15T10:00:00Z",
        "job": {
          "title": "Senior React Developer",
          "company": "TechCorp Inc."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "total_pages": 1
    }
  }
}
```

## 📊 Analytics API

### GET /api/analytics/dashboard

Get user dashboard analytics.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_applications": 12,
    "total_matches": 45,
    "avg_match_score": 0.78,
    "applications_by_status": {
      "pending": 3,
      "applied": 7,
      "interview": 1,
      "rejected": 1,
      "accepted": 0
    },
    "recent_activity": [
      {
        "type": "application",
        "description": "Applied to Senior Developer at TechCorp",
        "timestamp": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

## ⚠️ Error Responses

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "reason": "Must be a valid email address"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input parameters |
| `AUTHENTICATION_ERROR` | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_ERROR` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## 🔄 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authenticated requests**: 1000 requests per hour
- **Upload endpoints**: 10 requests per hour
- **Anonymous requests**: 100 requests per hour

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

## 📡 Webhooks

Configure webhooks to receive real-time updates:

### Supported Events

- `application.created` - New job application
- `match.generated` - New job match
- `resume.uploaded` - Resume uploaded and processed

### Webhook Payload

```json
{
  "event": "application.created",
  "data": {
    "id": "application-uuid",
    "user_id": "user-uuid",
    "job_id": "job-uuid",
    "created_at": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## 🧪 Testing

### API Testing with cURL

```bash
# Get jobs
curl -X GET "https://api.aijobmatcher.com/api/jobs?limit=5" \
  -H "Authorization: Bearer <token>"

# Upload resume
curl -X POST "https://api.aijobmatcher.com/api/resumes/upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"

# Generate matches
curl -X POST "https://api.aijobmatcher.com/api/matches/generate" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"resume_id": "resume-uuid"}'
```

### JavaScript SDK

```javascript
// Initialize client
const client = new AIJobMatcherAPI({
  baseURL: 'https://api.aijobmatcher.com',
  apiKey: 'your-api-key'
});

// Get jobs
const jobs = await client.jobs.list({
  query: 'react',
  remote_only: true
});

// Upload resume
const resume = await client.resumes.upload(file);

// Generate matches
const matches = await client.matches.generate(resume.id);
```

## 📞 Support

For API support:
- Documentation: [Full API Docs](https://docs.aijobmatcher.com)
- Support Email: api-support@aijobmatcher.com
- Status Page: [Status](https://status.aijobmatcher.com)

---

This API reference provides comprehensive documentation for integrating with the AI Job Matcher platform. For additional examples and use cases, check the [GitHub repository](https://github.com/SammyTourani/ai-job-matcher).