import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Check, X, HelpCircle, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReviewItem {
  vocab_id: string;
  stage: number;
  vocab_items: {
    content: string;
    definition: string;
    type: string;
  };
}

export const SrsPage: React.FC = () => {
  const [dueItems, setDueItems] = useState<ReviewItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDue = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/srs/due');
      setDueItems(res.data);
      setCurrentItemIndex(0);
      setShowAnswer(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDue();
  }, []);

  const handleReview = async (quality: number) => {
    const item = dueItems[currentItemIndex];
    try {
      await api.post('/srs/review', {
        vocabId: item.vocab_id,
        quality
      });
      
      // Move to next
      if (currentItemIndex < dueItems.length - 1) {
        setCurrentItemIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        // Finished batch
        setDueItems([]); // Clear to show finished screen
      }
    } catch (error) {
      alert('Error submitting review');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading reviews...</div>;

  if (dueItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-green-100 text-green-800 p-4 rounded-full inline-block mb-4">
          <Check className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
        <p className="text-gray-600 mb-8">You have no cards due for review right now.</p>
        <div className="space-x-4">
          <Link to="/vocab" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Go to Vocabulary
          </Link>
        </div>
      </div>
    );
  }

  const currentItem = dueItems[currentItemIndex];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-between text-sm text-gray-500">
        <span>Review Session</span>
        <span>{currentItemIndex + 1} / {dueItems.length}</span>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden min-h-[400px] flex flex-col relative">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-indigo-600 h-1 transition-all duration-300" 
            style={{ width: `${((currentItemIndex) / dueItems.length) * 100}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-4">
            {currentItem.vocab_items.type}
          </span>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            {currentItem.vocab_items.content}
          </h2>

          {showAnswer ? (
            <div className="animate-fade-in">
              <div className="w-full border-t border-gray-200 my-6"></div>
              <p className="text-xl text-gray-700">{currentItem.vocab_items.definition}</p>
            </div>
          ) : (
            <button 
              onClick={() => setShowAnswer(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Show Answer
            </button>
          )}
        </div>

        {showAnswer && (
          <div className="bg-gray-50 p-4 grid grid-cols-4 gap-4 border-t border-gray-200">
            <button
              onClick={() => handleReview(0)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">Forgot</span>
            </button>
            <button
              onClick={() => handleReview(1)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
            >
              <span className="text-lg font-bold mb-1">😬</span>
              <span className="text-xs font-bold">Hard</span>
            </button>
            <button
              onClick={() => handleReview(2)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              <span className="text-lg font-bold mb-1">🙂</span>
              <span className="text-xs font-bold">Good</span>
            </button>
            <button
              onClick={() => handleReview(3)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
            >
              <span className="text-lg font-bold mb-1">😎</span>
              <span className="text-xs font-bold">Easy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
