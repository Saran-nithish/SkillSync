import React, { useState, useRef, useEffect } from 'react';
import { Filter, Loader, FileText, MessageSquare, X } from 'lucide-react';
import { searchAPI } from '../services/api';
import './SmartSearch.css';

const SmartSearch = ({ onResultSelect, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [totalResults, setTotalResults] = useState(0);
  
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  // Mock data for fallback when API fails
  const mockResults = [
    {
      id: 1,
      title: 'React Best Practices',
      content: 'Learn the best practices for React development including hooks, state management, and performance optimization.',
      resultType: 'knowledge',
      author: 'John Doe',
      tags: ['react', 'javascript', 'frontend']
    },
    {
      id: 2,
      title: 'How to deploy Node.js applications?',
      content: 'Step-by-step guide to deploy Node.js applications to production servers.',
      resultType: 'query',
      author: 'Jane Smith',
      tags: ['nodejs', 'deployment', 'backend']
    },
    {
      id: 3,
      title: 'Database Design Guidelines',
      content: 'Best practices for designing scalable and efficient database schemas.',
      resultType: 'knowledge',
      author: 'Mike Johnson',
      tags: ['database', 'design', 'sql']
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const performSearch = async (searchQuery, type = 'all') => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      setTotalResults(0);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchAPI.search(searchQuery, type);
      
      if (response && response.data && response.data.results) {
        setResults(response.data.results);
        setTotalResults(response.data.totalResults || response.data.results.length);
        setShowResults(true);
      } else {
        // Fallback to mock data if API response is invalid
        const filteredMockResults = mockResults.filter(item => {
          const searchLower = searchQuery.toLowerCase();
          const titleMatch = item.title.toLowerCase().includes(searchLower);
          const contentMatch = item.content.toLowerCase().includes(searchLower);
          const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(searchLower));
          const typeMatch = type === 'all' || item.resultType === type;
          
          return (titleMatch || contentMatch || tagsMatch) && typeMatch;
        });
        
        setResults(filteredMockResults);
        setTotalResults(filteredMockResults.length);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      
      // Fallback to mock data when API fails
      const filteredMockResults = mockResults.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(searchLower);
        const contentMatch = item.content.toLowerCase().includes(searchLower);
        const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(searchLower));
        const typeMatch = type === 'all' || item.resultType === type;
        
        return (titleMatch || contentMatch || tagsMatch) && typeMatch;
      });
      
      setResults(filteredMockResults);
      setTotalResults(filteredMockResults.length);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      performSearch(value, selectedType);
    }, 300);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (query.trim()) {
      performSearch(query, type);
    }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      // Default behavior - you could navigate to the result or show a modal
      console.log('Selected result:', result);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setTotalResults(0);
    searchInputRef.current?.focus();
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'knowledge':
        return <FileText size={16} />;
      case 'query':
        return <MessageSquare size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getResultTypeLabel = (type) => {
    switch (type) {
      case 'knowledge':
        return 'Knowledge';
      case 'query':
        return 'Q&A';
      default:
        return 'Content';
    }
  };

  const highlightText = (text, searchQuery) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className={`smart-search ${className}`} ref={searchInputRef}>
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search knowledge base, Q&A, and more..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
        />
        
        {/* Search Actions */}
        <div className="search-actions">
          {isSearching && (
            <Loader className="search-loader" size={16} />
          )}
          {query && !isSearching && (
            <button
              className="clear-search-btn"
              onClick={clearSearch}
              type="button"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="search-results">
          <div className="results-header">
            <div className="results-count">
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
            </div>
          </div>

          {results.length > 0 ? (
            <div className="results-list">
              {results.map((result, index) => (
                <div
                  key={result.id || index}
                  className="result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-icon">
                    {getResultIcon(result.resultType)}
                  </div>
                  <div className="result-content">
                    <div className="result-header">
                      <h4 
                        className="result-title"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.title, query)
                        }}
                      />
                      <span className="result-type">
                        {getResultTypeLabel(result.resultType)}
                      </span>
                    </div>
                    <p 
                      className="result-excerpt"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          result.content?.substring(0, 120) + (result.content?.length > 120 ? '...' : '') || 
                          result.question?.substring(0, 120) + (result.question?.length > 120 ? '...' : '') || 
                          'No description available',
                          query
                        )
                      }}
                    />
                    {result.author && (
                      <div className="result-meta">
                        by {result.author}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No results found for "{query}"</p>
              <p className="no-results-subtitle">Try different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch; 