# AI-Powered Job Matching Platform

A modern, full-stack job matching platform that uses artificial intelligence to connect job seekers with relevant opportunities. Built with Next.js 14, TypeScript, and Tailwind CSS, featuring sophisticated AI-powered resume analysis and job matching algorithms.

![Main Interface](https://github.com/user-attachments/assets/f27a7260-ba00-475a-b6ef-79b02cdaf2b5)

## 🚀 Features

### Core Functionality
- **Smart Job Search**: Real-time search with advanced filtering by location, salary, experience level, and skills
- **AI Resume Analysis**: Upload resumes (PDF/DOC) with automatic skill extraction and experience parsing
- **Intelligent Matching**: Sophisticated AI algorithm that scores job compatibility based on multiple factors
- **Personalized Recommendations**: Curated job suggestions with detailed match explanations
- **User Profiles**: Complete profile management with resume storage and application tracking

### AI-Powered Features
- **Semantic Matching**: Uses advanced similarity algorithms including Jaccard similarity and Levenshtein distance
- **Weighted Scoring**: Multi-factor scoring system (Skills: 40%, Experience: 30%, Location: 20%, Title: 10%)
- **Match Explanations**: Human-readable explanations for why jobs match your profile
- **Skill Recognition**: Automatically identifies and categorizes technical skills from resumes

### User Experience
- **Modern Design**: Clean, professional interface built with Tailwind CSS
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Components**: Drag-and-drop resume upload, real-time search, visual match breakdowns
- **Performance Optimized**: Fast loading with efficient pagination and client-side caching

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Dropzone** - File upload handling

### Backend (Ready for Integration)
- **Supabase** - PostgreSQL database and authentication
- **Hugging Face** - AI/ML models for semantic analysis
- **Supabase Storage** - File storage for resumes

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📋 Prerequisites

- Node.js 18+ and npm
- (Optional) Supabase account for database
- (Optional) Hugging Face API key for AI features

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/SammyTourani/ai-job-matcher.git
cd ai-job-matcher
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hugging Face Configuration (Optional)
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### 5. Build for Production
```bash
npm run build
npm start
```

## 📱 Application Screens

### Job Listings
![Job Listings](https://github.com/user-attachments/assets/f27a7260-ba00-475a-b6ef-79b02cdaf2b5)
- Browse and search through available positions
- Filter by location, salary, experience level, and job type
- Real-time search with pagination

### Job Details
![Job Details](https://github.com/user-attachments/assets/65d51183-ddfc-4613-8ab3-be15466247b9)
- Comprehensive job information
- Requirements and skills breakdown
- Apply and save functionality

### Resume Upload
![Resume Upload](https://github.com/user-attachments/assets/95ed5d04-f81b-48ae-a127-a69ce7a9b8b2)
- Drag-and-drop file upload
- Support for PDF and Word documents
- AI-powered text extraction and analysis

### AI Job Matches
![Job Matches](https://github.com/user-attachments/assets/9c5684ae-821d-45f1-b43d-2d542b01884c)
- Personalized job recommendations
- Detailed match scoring and explanations
- Visual match breakdown with statistics

### User Profile
![User Profile](https://github.com/user-attachments/assets/32509bb1-b807-4727-91f1-80e7ea985009)
- Complete profile management
- Resume history and analytics
- Account settings and preferences

## 🔧 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main job listings
│   ├── job/[id]/page.tsx  # Job detail pages
│   ├── upload/page.tsx    # Resume upload
│   ├── matches/page.tsx   # AI matches
│   ├── profile/page.tsx   # User profile
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── JobCard.tsx        # Job display component
│   ├── SearchBar.tsx      # Search and filters
│   ├── ResumeUpload.tsx   # File upload component
│   ├── MatchScore.tsx     # Match analysis display
│   ├── Navigation.tsx     # Site navigation
│   └── LoadingSpinner.tsx # Loading states
├── lib/                   # Core business logic
│   ├── supabase.ts        # Database client
│   ├── ai-matcher.ts      # AI matching algorithms
│   ├── resume-parser.ts   # Resume text analysis
│   └── job-generator.ts   # Sample data generation
├── types/                 # TypeScript definitions
│   └── index.ts
├── utils/                 # Utility functions
│   ├── helpers.ts         # Common utilities
│   └── constants.ts       # Application constants
└── hooks/                 # Custom React hooks
    ├── useJobs.ts         # Job data management
    ├── useAuth.ts         # Authentication
    └── useMatching.ts     # AI matching
```

## 🤖 AI Matching Algorithm

The platform uses a sophisticated multi-factor matching algorithm:

### Scoring Components
1. **Skills Match (40% weight)**
   - Jaccard similarity coefficient for skill overlap
   - Semantic similarity for related technologies
   - Bonus for skill group matches (frontend, backend, cloud, etc.)

2. **Experience Match (30% weight)**
   - Experience level alignment with job requirements
   - Exponential decay for over/under-qualification
   - Dynamic scaling based on career progression

3. **Location Match (20% weight)**
   - Geographic proximity (when location data available)
   - Remote work preference alignment
   - Fuzzy matching for location variations

4. **Title Match (10% weight)**
   - Levenshtein distance for title similarity
   - Semantic analysis of job role equivalents
   - Career progression indicators

### Match Explanations
The AI generates human-readable explanations for each match, highlighting:
- Relevant skills and experience
- Areas for improvement
- Career growth opportunities
- Specific recommendations

## 🗄 Database Schema

The application is designed to work with Supabase PostgreSQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  skills TEXT[] NOT NULL,
  experience_level TEXT NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  job_type TEXT NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  remote_option BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Resumes table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  extracted_text TEXT NOT NULL,
  parsed_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job matches table
CREATE TABLE job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  match_score DECIMAL(3,2) NOT NULL,
  skills_match DECIMAL(3,2) NOT NULL,
  experience_match DECIMAL(3,2) NOT NULL,
  location_match DECIMAL(3,2) NOT NULL,
  title_match DECIMAL(3,2) NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📈 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Strategic caching for API responses and static assets
- **Lazy Loading**: Components and routes loaded on demand
- **Bundle Analysis**: Webpack bundle analyzer integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Hugging Face](https://huggingface.co/) for AI/ML capabilities
- [Lucide](https://lucide.dev/) for the beautiful icons

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@aijobmatcher.com
- Documentation: [Wiki](https://github.com/SammyTourani/ai-job-matcher/wiki)

---

**AI Job Matcher** - Connecting talent with opportunity through artificial intelligence. 🚀