import { useState } from 'react';
import { cn } from '@/utils/helpers';

interface SkillsDisplayProps {
  skills: string[];
  variant?: 'default' | 'compact' | 'large';
  maxDisplay?: number;
  highlightedSkills?: string[];
  onSkillClick?: (skill: string) => void;
  showCount?: boolean;
}

export default function SkillsDisplay({ 
  skills, 
  variant = 'default',
  maxDisplay,
  highlightedSkills = [],
  onSkillClick,
  showCount = true
}: SkillsDisplayProps) {
  const displaySkills = maxDisplay ? skills.slice(0, maxDisplay) : skills;
  const remainingCount = maxDisplay ? Math.max(0, skills.length - maxDisplay) : 0;

  const getSkillClasses = (skill: string) => {
    const isHighlighted = highlightedSkills.includes(skill.toLowerCase());
    const isClickable = !!onSkillClick;
    
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors';
    
    const variantClasses = {
      default: 'px-3 py-1 text-sm',
      compact: 'px-2 py-0.5 text-xs',
      large: 'px-4 py-2 text-base'
    };

    const colorClasses = isHighlighted
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-blue-100 text-blue-800 border border-blue-200';

    const interactiveClasses = isClickable
      ? 'hover:bg-blue-200 cursor-pointer'
      : '';

    return cn(
      baseClasses,
      variantClasses[variant],
      colorClasses,
      interactiveClasses
    );
  };

  const handleSkillClick = (skill: string) => {
    if (onSkillClick) {
      onSkillClick(skill);
    }
  };

  if (skills.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No skills specified
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {displaySkills.map((skill, index) => (
        <span
          key={index}
          className={getSkillClasses(skill)}
          onClick={() => handleSkillClick(skill)}
          title={highlightedSkills.includes(skill.toLowerCase()) ? 'Matching skill' : skill}
        >
          {skill}
          {highlightedSkills.includes(skill.toLowerCase()) && (
            <span className="ml-1 text-green-600">✓</span>
          )}
        </span>
      ))}
      
      {remainingCount > 0 && showCount && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}

// Specialized component for skill matching visualization
interface SkillMatchDisplayProps {
  userSkills: string[];
  jobSkills: string[];
  variant?: 'default' | 'compact' | 'large';
  showLegend?: boolean;
}

export function SkillMatchDisplay({ 
  userSkills, 
  jobSkills, 
  variant = 'default',
  showLegend = true 
}: SkillMatchDisplayProps) {
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase());
  const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());
  
  const matchingSkills = jobSkills.filter(skill => 
    normalizedUserSkills.includes(skill.toLowerCase())
  );
  
  const missingSkills = jobSkills.filter(skill => 
    !normalizedUserSkills.includes(skill.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {showLegend && (
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-gray-600">You have this skill</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-gray-600">Missing skill</span>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {matchingSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">
              Matching Skills ({matchingSkills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                >
                  {skill}
                  <span className="ml-1 text-green-600">✓</span>
                </span>
              ))}
            </div>
          </div>
        )}
        
        {missingSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2">
              Skills to Develop ({missingSkills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                >
                  {skill}
                  <span className="ml-1 text-red-600">×</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-600">
        <strong>Match Rate:</strong> {matchingSkills.length} of {jobSkills.length} skills 
        ({Math.round((matchingSkills.length / jobSkills.length) * 100)}%)
      </div>
    </div>
  );
}

// Component for skill cloud/trending skills
interface TrendingSkillsProps {
  skills: { name: string; count: number; trend: 'up' | 'down' | 'stable' }[];
  title?: string;
}

export function TrendingSkills({ skills, title = "Trending Skills" }: TrendingSkillsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">{skill.name}</span>
              <span className={cn('text-sm', getTrendColor(skill.trend))}>
                {getTrendIcon(skill.trend)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {skill.count} jobs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skills input component for forms
interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxSkills?: number;
}

export function SkillsInput({ 
  value, 
  onChange, 
  suggestions = [], 
  placeholder = "Add a skill...",
  maxSkills 
}: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.includes(suggestion)
  );

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !value.includes(trimmedSkill)) {
      if (!maxSkills || value.length < maxSkills) {
        onChange([...value, trimmedSkill]);
        setInputValue('');
        setShowSuggestions(false);
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Current skills */}
      {value.length > 0 && (
        <SkillsDisplay 
          skills={value} 
          variant="default"
          onSkillClick={removeSkill}
        />
      )}
      
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={maxSkills && value.length >= maxSkills 
            ? `Maximum ${maxSkills} skills reached` 
            : placeholder}
          disabled={Boolean(maxSkills && value.length >= maxSkills)}
          className="input w-full"
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addSkill(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {maxSkills && (
        <div className="text-xs text-gray-500">
          {value.length} of {maxSkills} skills
        </div>
      )}
    </div>
  );
}