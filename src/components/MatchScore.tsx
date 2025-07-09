import { Info, Award, Briefcase, MapPin, FileText } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  explanation: string;
  breakdown: {
    skills: number;
    experience: number;
    location: number;
    title: number;
  };
}

export default function MatchScore({ score, explanation, breakdown }: MatchScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 0.8) return 'text-green-700';
    if (score >= 0.6) return 'text-yellow-700';
    return 'text-red-700';
  };

  const formatPercentage = (value: number) => Math.round(value * 100);

  const breakdownItems = [
    {
      icon: Award,
      label: 'Skills Match',
      value: breakdown.skills,
      weight: '40%'
    },
    {
      icon: Briefcase,
      label: 'Experience Match',
      value: breakdown.experience,
      weight: '30%'
    },
    {
      icon: MapPin,
      label: 'Location Match',
      value: breakdown.location,
      weight: '20%'
    },
    {
      icon: FileText,
      label: 'Title Match',
      value: breakdown.title,
      weight: '10%'
    }
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Match Analysis</h3>
      </div>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Match</span>
          <span className={`text-sm font-bold ${getScoreTextColor(score)}`}>
            {formatPercentage(score)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getScoreColor(score)}`}
            style={{ width: `${formatPercentage(score)}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-4 mb-6">
        {breakdownItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">({item.weight})</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPercentage(item.value)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getScoreColor(item.value)}`}
                    style={{ width: `${formatPercentage(item.value)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">AI Insights</h4>
        <p className="text-sm text-blue-800">{explanation}</p>
      </div>
    </div>
  );
}