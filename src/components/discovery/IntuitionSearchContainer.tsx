'use client';

import React, { useState } from 'react';
import { IntuitionSearchResult } from '@/lib/validations/intuition';
import { performIntuitionSearch } from '@/app/actions/intuition-actions';
import { IntuitionInputView } from './IntuitionInputView';

export const IntuitionSearchContainer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<IntuitionSearchResult[]>([
    {
      id: 'default1',
      movieTitle: 'בלאד ראנר 2049',
      metaphorMatch: 'הרגשת בדידות אורבנית ניאונית בסביבה עתידנית',
      sentimentGradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(147, 51, 234, 0.3))',
      confidence: 0.95,
    },
    {
      id: 'default2',
      movieTitle: 'בינכוכבי',
      metaphorMatch: 'תחושת געגוע אינסופית על פני מרחבי החלל',
      sentimentGradient: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(245, 158, 11, 0.3))',
      confidence: 0.91,
    },
  ]);

  const handleSubmitSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    const res = await performIntuitionSearch({ query });
    if (res.success && res.data) {
      setResults(res.data);
    }
    setIsSearching(false);
  };

  return (
    <IntuitionInputView
      query={query}
      isSearching={isSearching}
      results={results}
      onQueryChange={setQuery}
      onSubmitSearch={handleSubmitSearch}
    />
  );
};
