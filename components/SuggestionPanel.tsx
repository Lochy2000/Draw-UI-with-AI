'use client';
import { useState } from 'react';
import { ComponentSuggestion, WebsiteComponent } from '@/types/components';

interface SuggestionPanelProps {
  visionAnalysis: any;
  layoutAnalysis: any;
  suggestions: ComponentSuggestion[];
  onAccept: (acceptedComponents: WebsiteComponent[]) => void;
  onReject: () => void;
  onModify: (modifiedSuggestions: ComponentSuggestion[]) => void;
}

export default function SuggestionPanel({
  visionAnalysis,
  layoutAnalysis,
  suggestions,
  onAccept,
  onReject,
  onModify,
}: SuggestionPanelProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [modifiedSuggestions, setModifiedSuggestions] = useState(suggestions);

  const handleAcceptAll = () => {
    // Convert suggestions to actual components
    const components: WebsiteComponent[] = modifiedSuggestions.map((suggestion, index) => ({
      id: `component-${index}`,
      type: suggestion.suggestedType,
      ...suggestion.properties,
      position: { x: suggestion.bounds.x, y: suggestion.bounds.y },
      size: { width: suggestion.bounds.width, height: suggestion.bounds.height },
    })) as WebsiteComponent[];

    onAccept(components);
  };

  const handleChangeType = (index: number, newType: string) => {
    const updated = [...modifiedSuggestions];
    updated[index] = {
      ...updated[index],
      suggestedType: newType as any,
    };
    setModifiedSuggestions(updated);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">AI Analysis & Suggestions</h2>
        <p className="text-sm text-gray-600 mt-1">
          Review and modify the suggested components before generating code
        </p>
      </div>

      {/* Analysis Summary */}
      <div className="p-4 bg-blue-50 border-b">
        <h3 className="font-semibold text-blue-900 mb-2">Vision Analysis</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Website Type:</span>
            <span className="ml-2 font-medium">{visionAnalysis?.websiteType || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-600">Layout:</span>
            <span className="ml-2 font-medium">{layoutAnalysis?.layoutStrategy || 'Unknown'}</span>
          </div>
        </div>
        {visionAnalysis?.sections && (
          <div className="mt-2">
            <span className="text-gray-600 text-sm">Sections: </span>
            <span className="text-sm">
              {visionAnalysis.sections.map((s: any) => s.type).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold text-gray-800 mb-3">
          Suggested Components ({modifiedSuggestions.length})
        </h3>
        <div className="space-y-3">
          {modifiedSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedSuggestion === index
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedSuggestion(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                    {suggestion.suggestedType}
                  </span>
                  <span className="text-xs text-gray-500">
                    Confidence: {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>
                {suggestion.alternatives && suggestion.alternatives.length > 0 && (
                  <select
                    className="text-xs border rounded px-2 py-1"
                    value={suggestion.suggestedType}
                    onChange={(e) => handleChangeType(index, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value={suggestion.suggestedType}>{suggestion.suggestedType}</option>
                    {suggestion.alternatives.map((alt) => (
                      <option key={alt} value={alt}>
                        {alt}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <p className="text-sm text-gray-700 mb-2">{suggestion.reasoning}</p>

              {suggestion.properties && Object.keys(suggestion.properties).length > 0 && (
                <div className="text-xs bg-gray-50 rounded p-2 mt-2">
                  <div className="font-medium text-gray-600 mb-1">Properties:</div>
                  <div className="space-y-1">
                    {Object.entries(suggestion.properties).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-gray-800">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t bg-gray-50 flex gap-3">
        <button
          onClick={onReject}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Re-analyze
        </button>
        <button
          onClick={() => onModify(modifiedSuggestions)}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Modify
        </button>
        <button
          onClick={handleAcceptAll}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          Accept & Build
        </button>
      </div>
    </div>
  );
}
