import { ParsedResumeData, Education } from '@/types';
import { COMMON_SKILLS } from '@/utils/constants';

/**
 * AI-powered resume parser that extracts structured data from resume text
 * In production, this would use actual ML models for text analysis
 */
export class ResumeParser {
  /**
   * Parse resume text and extract structured data
   */
  static async parseResumeText(text: string): Promise<ParsedResumeData> {
    const cleanText = text.toLowerCase().trim();
    
    return {
      skills: this.extractSkills(cleanText),
      experience_years: this.extractExperienceYears(cleanText),
      education: this.extractEducation(cleanText),
      job_titles: this.extractJobTitles(cleanText),
      summary: this.extractSummary(text) // Use original case for summary
    };
  }

  /**
   * Extract skills from resume text using pattern matching and keyword detection
   */
  private static extractSkills(text: string): string[] {
    const foundSkills: string[] = [];
    
    // Check for each common skill
    for (const skill of COMMON_SKILLS) {
      const skillLower = skill.toLowerCase();
      
      // Direct match
      if (text.includes(skillLower)) {
        foundSkills.push(skill);
        continue;
      }
      
      // Handle variations and common misspellings
      const variations = this.getSkillVariations(skillLower);
      for (const variation of variations) {
        if (text.includes(variation)) {
          foundSkills.push(skill);
          break;
        }
      }
    }

    // Extract skills from common sections
    const skillsSections = this.extractSkillsSections(text);
    for (const section of skillsSections) {
      const sectionSkills = this.parseSkillsFromSection(section);
      foundSkills.push(...sectionSkills);
    }

    // Remove duplicates and return
    return [...new Set(foundSkills)];
  }

  /**
   * Get common variations for a skill
   */
  private static getSkillVariations(skill: string): string[] {
    const variations: { [key: string]: string[] } = {
      'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'node.js'],
      'typescript': ['ts'],
      'react': ['reactjs', 'react.js'],
      'node.js': ['nodejs', 'node js', 'javascript', 'js'],
      'vue.js': ['vuejs', 'vue js'],
      'angular': ['angularjs', 'angular.js'],
      'python': ['py'],
      'c#': ['csharp', 'c sharp', 'dotnet', '.net'],
      'c++': ['cpp', 'cplusplus'],
      'postgresql': ['postgres', 'psql'],
      'mongodb': ['mongo'],
      'react native': ['reactnative'],
      'machine learning': ['ml', 'ai', 'artificial intelligence'],
      'tensorflow': ['tf'],
      'scikit-learn': ['sklearn'],
      'github': ['git hub'],
      'gitlab': ['git lab']
    };

    return variations[skill] || [];
  }

  /**
   * Extract skills sections from resume text
   */
  private static extractSkillsSections(text: string): string[] {
    const sections: string[] = [];
    
    // Common section headers
    const skillHeaders = [
      'skills',
      'technical skills',
      'core competencies',
      'technologies',
      'programming languages',
      'tools and technologies',
      'expertise',
      'proficiencies'
    ];

    for (const header of skillHeaders) {
      const regex = new RegExp(`${header}:?([^\\n]*(?:\\n(?!\\w+:)[^\\n]*)*)`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        sections.push(...matches);
      }
    }

    return sections;
  }

  /**
   * Parse skills from a specific section
   */
  private static parseSkillsFromSection(section: string): string[] {
    const skills: string[] = [];
    
    // Remove the header
    const content = section.replace(/^[^:]*:/, '').trim();
    
    // Split by common delimiters
    const items = content.split(/[,;•·\n]/).map(item => item.trim()).filter(Boolean);
    
    for (const item of items) {
      // Check if it matches any known skill
      const matchedSkill = COMMON_SKILLS.find(skill => 
        skill.toLowerCase() === item.toLowerCase()
      );
      
      if (matchedSkill) {
        skills.push(matchedSkill);
      }
    }

    return skills;
  }

  /**
   * Extract years of experience from resume text
   */
  private static extractExperienceYears(text: string): number {
    // Look for explicit experience statements
    const experiencePatterns = [
      /(\d+)\+?\s*years?\s+(?:of\s+)?experience/gi,
      /(\d+)\+?\s*years?\s+(?:in|with)/gi,
      /experience:?\s*(\d+)\+?\s*years?/gi,
      /(\d+)\+?\s*yr[s]?\s+exp/gi
    ];

    for (const pattern of experiencePatterns) {
      const match = text.match(pattern);
      if (match) {
        const years = parseInt(match[1]);
        if (years && years <= 50) { // Sanity check
          return years;
        }
      }
    }

    // Calculate from work history dates
    const workYears = this.calculateWorkHistoryYears(text);
    if (workYears > 0) {
      return workYears;
    }

    // Default estimation based on education and content
    return this.estimateExperienceFromContent(text);
  }

  /**
   * Calculate experience years from work history dates
   */
  private static calculateWorkHistoryYears(text: string): number {
    // Look for date ranges in work history
    const datePatterns = [
      /(\d{4})\s*[-–—]\s*(?:(\d{4})|present|current)/gi,
      /(\w+)\s+(\d{4})\s*[-–—]\s*(?:(\w+)\s+(\d{4})|present|current)/gi
    ];

    const experiences: number[] = [];
    
    for (const pattern of datePatterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        const startYear = parseInt(match[1] || match[2]);
        const endYear = match[2] && match[2] !== 'present' && match[2] !== 'current' 
          ? parseInt(match[2]) 
          : new Date().getFullYear();
        
        if (startYear && endYear && startYear <= endYear && startYear >= 1980) {
          experiences.push(endYear - startYear);
        }
      }
    }

    if (experiences.length > 0) {
      // Return the sum of all experiences (handling overlaps would be more complex)
      return Math.min(Math.max(...experiences), 30); // Cap at 30 years
    }

    return 0;
  }

  /**
   * Estimate experience based on resume content and complexity
   */
  private static estimateExperienceFromContent(text: string): number {
    let score = 0;
    
    // Senior-level indicators
    const seniorIndicators = [
      'senior', 'lead', 'principal', 'architect', 'manager', 'director',
      'team lead', 'technical lead', 'staff engineer'
    ];
    
    // Mid-level indicators
    const midIndicators = [
      'software engineer', 'developer', 'programmer', 'analyst'
    ];
    
    // Junior-level indicators
    const juniorIndicators = [
      'junior', 'entry', 'intern', 'trainee', 'associate', 'graduate'
    ];

    // Count indicators
    let seniorCount = 0;
    let midCount = 0;
    let juniorCount = 0;

    for (const indicator of seniorIndicators) {
      if (text.includes(indicator)) seniorCount++;
    }
    
    for (const indicator of midIndicators) {
      if (text.includes(indicator)) midCount++;
    }
    
    for (const indicator of juniorIndicators) {
      if (text.includes(indicator)) juniorCount++;
    }

    // Estimate based on indicators
    if (seniorCount > 0) {
      score += 7; // Senior level
    } else if (midCount > 0) {
      score += 4; // Mid level
    } else if (juniorCount > 0) {
      score += 1; // Junior level
    } else {
      score += 3; // Default mid-level
    }

    // Adjust based on content complexity
    const complexityIndicators = [
      'architecture', 'scalability', 'microservices', 'distributed',
      'performance', 'optimization', 'mentoring', 'leadership'
    ];

    for (const indicator of complexityIndicators) {
      if (text.includes(indicator)) {
        score += 0.5;
      }
    }

    return Math.min(Math.round(score), 15); // Cap at 15 years
  }

  /**
   * Extract education information from resume text
   */
  private static extractEducation(text: string): Education[] {
    const education: Education[] = [];
    
    // Common degree patterns
    const degreePatterns = [
      /(bachelor[']?s?|b\.?[as]\.?|undergraduate)\s+(?:of\s+)?(?:science\s+)?(?:in\s+)?([^,\n]+)/gi,
      /(master[']?s?|m\.?[as]\.?|graduate)\s+(?:of\s+)?(?:science\s+)?(?:in\s+)?([^,\n]+)/gi,
      /(phd|ph\.?d\.?|doctorate|doctoral)\s+(?:in\s+)?([^,\n]+)/gi,
      /(associate[']?s?|a\.?[as]\.?)\s+(?:of\s+)?(?:science\s+)?(?:in\s+)?([^,\n]+)/gi
    ];

    for (const pattern of degreePatterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        const degree = this.normalizeDegree(match[1]);
        const field = match[2]?.trim();
        
        // Look for school and year near the match
        const context = this.getContextAroundMatch(text, match.index || 0, 200);
        const school = this.extractSchoolFromContext(context);
        const year = this.extractYearFromContext(context);

        education.push({
          degree: `${degree} ${field || ''}`.trim(),
          school: school || 'Not specified',
          year,
          field
        });
      }
    }

    // If no structured education found, look for school names
    if (education.length === 0) {
      const schools = this.extractSchoolNames(text);
      for (const school of schools) {
        education.push({
          degree: 'Not specified',
          school,
        });
      }
    }

    return education;
  }

  /**
   * Normalize degree names
   */
  private static normalizeDegree(degree: string): string {
    const normalizations: { [key: string]: string } = {
      'bachelor': 'Bachelor of Science',
      'bachelors': 'Bachelor of Science',
      'b.s.': 'Bachelor of Science',
      'b.a.': 'Bachelor of Arts',
      'bs': 'Bachelor of Science',
      'ba': 'Bachelor of Arts',
      'master': 'Master of Science',
      'masters': 'Master of Science',
      'm.s.': 'Master of Science',
      'm.a.': 'Master of Arts',
      'ms': 'Master of Science',
      'ma': 'Master of Arts',
      'phd': 'PhD',
      'ph.d.': 'PhD',
      'doctorate': 'PhD',
      'doctoral': 'PhD',
      'associate': 'Associate Degree',
      'associates': 'Associate Degree',
      'a.s.': 'Associate of Science',
      'a.a.': 'Associate of Arts'
    };

    return normalizations[degree.toLowerCase()] || degree;
  }

  /**
   * Get context around a match
   */
  private static getContextAroundMatch(text: string, index: number, length: number): string {
    const start = Math.max(0, index - length / 2);
    const end = Math.min(text.length, index + length / 2);
    return text.substring(start, end);
  }

  /**
   * Extract school name from context
   */
  private static extractSchoolFromContext(context: string): string | undefined {
    // Common university/college indicators
    const schoolPatterns = [
      /([A-Z][^,\n]*(?:university|college|institute|school))/gi,
      /(university|college|institute)\s+of\s+([^,\n]+)/gi
    ];

    for (const pattern of schoolPatterns) {
      const match = context.match(pattern);
      if (match) {
        return match[1] || `${match[1]} of ${match[2]}`;
      }
    }

    return undefined;
  }

  /**
   * Extract year from context
   */
  private static extractYearFromContext(context: string): number | undefined {
    const yearPattern = /\b(19|20)\d{2}\b/g;
    const matches = context.match(yearPattern);
    
    if (matches) {
      // Return the most recent year
      const years = matches.map(y => parseInt(y)).filter(y => y >= 1980 && y <= new Date().getFullYear() + 10);
      return Math.max(...years);
    }

    return undefined;
  }

  /**
   * Extract school names from text
   */
  private static extractSchoolNames(text: string): string[] {
    const schools: string[] = [];
    const schoolPattern = /\b([A-Z][^,\n]*(?:University|College|Institute|School))\b/gi;
    const matches = [...text.matchAll(schoolPattern)];
    
    for (const match of matches) {
      schools.push(match[1]);
    }

    return [...new Set(schools)]; // Remove duplicates
  }

  /**
   * Extract job titles from work experience
   */
  private static extractJobTitles(text: string): string[] {
    const titles: string[] = [];
    
    // Common title patterns
    const titlePatterns = [
      /(?:^|\n)\s*([A-Z][^,\n]*(?:engineer|developer|analyst|manager|director|lead|architect|consultant|specialist|coordinator))/gim,
      /position:\s*([^,\n]+)/gi,
      /title:\s*([^,\n]+)/gi,
      /role:\s*([^,\n]+)/gi
    ];

    for (const pattern of titlePatterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        const title = match[1].trim();
        if (title.length > 3 && title.length < 100) { // Sanity check
          titles.push(title);
        }
      }
    }

    return [...new Set(titles)]; // Remove duplicates
  }

  /**
   * Extract a summary from the resume
   */
  private static extractSummary(text: string): string {
    // Look for summary sections
    const summaryPatterns = [
      /(?:summary|profile|overview|objective):\s*([^]+?)(?:\n\s*\n|\n[A-Z])/gi,
      /(?:professional\s+summary|career\s+summary):\s*([^]+?)(?:\n\s*\n|\n[A-Z])/gi
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let summary = match[1].trim();
        // Limit length and clean up
        if (summary.length > 500) {
          summary = summary.substring(0, 500) + '...';
        }
        return summary;
      }
    }

    // Generate a basic summary based on extracted data
    return 'Professional with expertise in software development and technology solutions.';
  }

  /**
   * Extract text from PDF file (mock implementation)
   */
  static async extractTextFromPDF(file: File): Promise<string> {
    // In production, this would use pdf-parse or similar library
    // For now, return mock text
    return `
      John Doe
      Senior Full Stack Developer
      
      PROFESSIONAL SUMMARY
      Experienced full-stack developer with 5+ years of experience building scalable web applications using modern technologies. Expertise in React, Node.js, TypeScript, and cloud platforms.
      
      EXPERIENCE
      Senior Full Stack Developer | TechCorp Inc. | 2020 - Present
      - Developed and maintained web applications using React and Node.js
      - Implemented CI/CD pipelines and deployed to AWS
      - Led a team of 3 developers
      
      Full Stack Developer | StartupXYZ | 2018 - 2020
      - Built responsive web applications using React and Express.js
      - Worked with PostgreSQL and MongoDB databases
      - Collaborated with design and product teams
      
      EDUCATION
      Bachelor of Science in Computer Science
      University of Technology | 2018
      
      SKILLS
      JavaScript, TypeScript, React, Node.js, Express.js, PostgreSQL, MongoDB, AWS, Docker, Git, HTML, CSS, Python, REST APIs, GraphQL
    `;
  }

  /**
   * Extract text from Word document (mock implementation)
   */
  static async extractTextFromWord(file: File): Promise<string> {
    // In production, this would use mammoth.js or similar library
    // For now, return mock text
    return this.extractTextFromPDF(file);
  }
}