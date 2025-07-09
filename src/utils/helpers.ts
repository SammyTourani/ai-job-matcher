import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatSalary(min?: number, max?: number) {
  if (!min && !max) return 'Salary not specified';
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  } else if (min) {
    return `${formatNumber(min)}+`;
  } else if (max) {
    return `Up to ${formatNumber(max)}`;
  }
  return 'Salary not specified';
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTimeAgo(date: string) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diffMs < minute) {
    return 'Just now';
  } else if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffMs / year);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function capitalizeWords(text: string) {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getExperienceLabel(level: string) {
  const labels = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior Level',
    executive: 'Executive Level',
  };
  return labels[level as keyof typeof labels] || level;
}

export function getJobTypeLabel(type: string) {
  const labels = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    contract: 'Contract',
    internship: 'Internship',
  };
  return labels[type as keyof typeof labels] || type;
}

export function calculateMatchPercentage(score: number) {
  return Math.round(score * 100);
}

export function getMatchColor(score: number) {
  const percentage = calculateMatchPercentage(score);
  
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  if (percentage >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getMatchBgColor(score: number) {
  const percentage = calculateMatchPercentage(score);
  
  if (percentage >= 80) return 'bg-green-100 text-green-800';
  if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
  if (percentage >= 40) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string) {
  return password.length >= 8;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => arr2.includes(item));
}

export function difference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => !arr2.includes(item));
}