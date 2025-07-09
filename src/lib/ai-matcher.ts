import { Job, ParsedResumeData, SimilarityScore } from '@/types';
import { 
  intersection, 
  unique, 
  calculateMatchPercentage 
} from '@/utils/helpers';
import { MATCH_WEIGHTS } from '@/utils/constants';

/**
 * AI-powered job matching engine that calculates similarity scores
 * between user profiles and job postings using multiple algorithms
 */
export class AIJobMatcher {
  /**
   * Calculate comprehensive match score between resume and job
   */
  static calculateMatch(resumeData: ParsedResumeData, job: Job): SimilarityScore {
    const skillsScore = this.calculateSkillsMatch(resumeData.skills, job.skills);
    const experienceScore = this.calculateExperienceMatch(resumeData.experience_years, job.experience_level);
    const locationScore = this.calculateLocationMatch(resumeData, job);
    const titleScore = this.calculateTitleMatch(resumeData.job_titles, job.title);

    // Weighted overall score
    const overallScore = 
      (skillsScore * MATCH_WEIGHTS.skills) +
      (experienceScore * MATCH_WEIGHTS.experience) +
      (locationScore * MATCH_WEIGHTS.location) +
      (titleScore * MATCH_WEIGHTS.title);

    return {
      score: Math.min(overallScore, 1.0), // Cap at 100%
      details: {
        skills: skillsScore,
        experience: experienceScore,
        location: locationScore,
        title: titleScore
      }
    };
  }

  /**
   * Calculate skills match using Jaccard similarity coefficient
   */
  private static calculateSkillsMatch(resumeSkills: string[], jobSkills: string[]): number {
    if (resumeSkills.length === 0 || jobSkills.length === 0) return 0;

    // Normalize skills to lowercase for comparison
    const normalizedResumeSkills = resumeSkills.map(skill => skill.toLowerCase());
    const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());

    // Calculate Jaccard similarity: intersection / union
    const intersectionSize = intersection(normalizedResumeSkills, normalizedJobSkills).length;
    const unionSize = unique([...normalizedResumeSkills, ...normalizedJobSkills]).length;

    const jaccardSimilarity = intersectionSize / unionSize;

    // Apply semantic similarity boost for related skills
    const semanticBoost = this.calculateSemanticSkillsBoost(normalizedResumeSkills, normalizedJobSkills);
    
    return Math.min(jaccardSimilarity + semanticBoost, 1.0);
  }

  /**
   * Calculate experience match with exponential decay
   */
  private static calculateExperienceMatch(resumeYears: number, jobLevel: string): number {
    const levelRequirements = {
      'entry': { min: 0, ideal: 1 },
      'mid': { min: 2, ideal: 4 },
      'senior': { min: 5, ideal: 8 },
      'executive': { min: 10, ideal: 15 }
    };

    const requirement = levelRequirements[jobLevel as keyof typeof levelRequirements] || 
                       levelRequirements.mid;

    // Perfect match at ideal years
    if (resumeYears >= requirement.ideal) {
      // Diminishing returns for overqualification
      const excess = resumeYears - requirement.ideal;
      return Math.max(0.9, 1.0 - (excess * 0.02));
    }

    // Linear scaling from minimum to ideal
    if (resumeYears >= requirement.min) {
      return 0.6 + (0.4 * (resumeYears - requirement.min) / (requirement.ideal - requirement.min));
    }

    // Penalty for under-qualification with exponential decay
    const deficit = requirement.min - resumeYears;
    return Math.max(0.1, 0.6 * Math.exp(-deficit * 0.5));
  }

  /**
   * Calculate location match with fuzzy matching
   */
  private static calculateLocationMatch(resumeData: ParsedResumeData, job: Job): number {
    // For now, return a high score if remote is available
    if (job.remote_option) return 0.9;

    // Extract location info (simplified implementation)
    // In real implementation, would use geocoding and distance calculation
    const jobLocation = job.location.toLowerCase();
    
    // Check for common location indicators
    if (jobLocation.includes('remote') || jobLocation.includes('anywhere')) {
      return 1.0;
    }

    // Default location match (would be enhanced with actual location data)
    return 0.7;
  }

  /**
   * Calculate title match using Levenshtein distance and semantic similarity
   */
  private static calculateTitleMatch(resumeTitles: string[], jobTitle: string): number {
    if (resumeTitles.length === 0) return 0;

    const normalizedJobTitle = jobTitle.toLowerCase();
    let bestMatch = 0;

    for (const title of resumeTitles) {
      const normalizedTitle = title.toLowerCase();
      
      // Direct substring match
      if (normalizedJobTitle.includes(normalizedTitle) || 
          normalizedTitle.includes(normalizedJobTitle)) {
        bestMatch = Math.max(bestMatch, 0.9);
        continue;
      }

      // Levenshtein distance similarity
      const distance = this.levenshteinDistance(normalizedTitle, normalizedJobTitle);
      const maxLength = Math.max(normalizedTitle.length, normalizedJobTitle.length);
      const similarity = 1 - (distance / maxLength);
      
      // Semantic similarity for common tech roles
      const semanticSimilarity = this.calculateTitleSemanticSimilarity(normalizedTitle, normalizedJobTitle);
      
      const titleScore = Math.max(similarity, semanticSimilarity);
      bestMatch = Math.max(bestMatch, titleScore);
    }

    return bestMatch;
  }

  /**
   * Calculate semantic similarity boost for related skills
   */
  private static calculateSemanticSkillsBoost(resumeSkills: string[], jobSkills: string[]): number {
    const skillGroups = {
      frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'jsx'],
      backend: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'php', 'python', 'java'],
      database: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible'],
      mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'],
      ml: ['tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'machine learning', 'ai'],
      devops: ['ci/cd', 'jenkins', 'github actions', 'docker', 'kubernetes', 'terraform']
    };

    let boost = 0;
    
    for (const [group, skills] of Object.entries(skillGroups)) {
      const resumeGroupSkills = resumeSkills.filter(skill => 
        skills.some(groupSkill => skill.includes(groupSkill) || groupSkill.includes(skill))
      );
      const jobGroupSkills = jobSkills.filter(skill => 
        skills.some(groupSkill => skill.includes(groupSkill) || groupSkill.includes(skill))
      );

      if (resumeGroupSkills.length > 0 && jobGroupSkills.length > 0) {
        boost += 0.1; // 10% boost for each matching skill group
      }
    }

    return Math.min(boost, 0.3); // Cap semantic boost at 30%
  }

  /**
   * Calculate semantic similarity between job titles
   */
  private static calculateTitleSemanticSimilarity(title1: string, title2: string): number {
    const titleSynonyms = {
      developer: ['engineer', 'programmer', 'coder'],
      senior: ['lead', 'principal', 'staff'],
      junior: ['entry', 'associate', 'jr'],
      fullstack: ['full stack', 'full-stack'],
      frontend: ['front end', 'front-end', 'ui', 'client'],
      backend: ['back end', 'back-end', 'server', 'api'],
      mobile: ['ios', 'android', 'app'],
      data: ['analytics', 'scientist', 'analyst'],
      devops: ['sre', 'infrastructure', 'platform', 'reliability'],
      manager: ['lead', 'director', 'head', 'vp']
    };

    let similarity = 0;

    for (const [term, synonyms] of Object.entries(titleSynonyms)) {
      const title1HasTerm = title1.includes(term) || synonyms.some(syn => title1.includes(syn));
      const title2HasTerm = title2.includes(term) || synonyms.some(syn => title2.includes(syn));

      if (title1HasTerm && title2HasTerm) {
        similarity += 0.2; // 20% boost for each matching term group
      }
    }

    return Math.min(similarity, 0.8); // Cap at 80%
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Generate human-readable explanation for a match
   */
  static generateMatchExplanation(
    score: SimilarityScore, 
    resumeData: ParsedResumeData, 
    job: Job
  ): string {
    const percentage = calculateMatchPercentage(score.score);
    const skillsPercentage = calculateMatchPercentage(score.details.skills);
    const expPercentage = calculateMatchPercentage(score.details.experience);

    let explanation = '';

    // Overall assessment
    if (percentage >= 85) {
      explanation += 'Excellent match! ';
    } else if (percentage >= 70) {
      explanation += 'Strong match! ';
    } else if (percentage >= 55) {
      explanation += 'Good match! ';
    } else if (percentage >= 40) {
      explanation += 'Fair match! ';
    } else {
      explanation += 'Limited match. ';
    }

    // Skills assessment
    const matchingSkills = intersection(
      resumeData.skills.map(s => s.toLowerCase()), 
      job.skills.map(s => s.toLowerCase())
    );

    if (skillsPercentage >= 80) {
      explanation += `Your skills in ${matchingSkills.slice(0, 3).join(', ')} align perfectly with this role. `;
    } else if (skillsPercentage >= 60) {
      explanation += `Your ${matchingSkills.slice(0, 2).join(' and ')} skills are valuable for this position. `;
    } else if (matchingSkills.length > 0) {
      explanation += `Your ${matchingSkills[0]} experience is relevant. `;
    } else {
      explanation += 'Consider developing skills in the required technologies. ';
    }

    // Experience assessment
    if (expPercentage >= 80) {
      explanation += `Your ${resumeData.experience_years} years of experience meets their requirements perfectly.`;
    } else if (expPercentage >= 60) {
      explanation += `Your ${resumeData.experience_years} years of experience is well-suited for this level.`;
    } else if (expPercentage >= 40) {
      explanation += `Your experience level is approaching their requirements.`;
    } else {
      explanation += `Consider gaining more experience in this field.`;
    }

    return explanation;
  }

  /**
   * Get color coding for match score
   */
  static getMatchColor(score: number): string {
    const percentage = calculateMatchPercentage(score);
    
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'blue';
    if (percentage >= 40) return 'yellow';
    return 'red';
  }

  /**
   * Get match label for score
   */
  static getMatchLabel(score: number): string {
    const percentage = calculateMatchPercentage(score);
    
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Poor Match';
  }
}