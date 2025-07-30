import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Star, ChevronRight, X } from 'lucide-react';
import { useMatchingStore } from '../stores/matchingStore';
import { MatchingProfile, QuestionType } from '../types/matching';
import { useAuthStore } from '../stores/authStore';

const MatchingPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    categories,
    userProfile,
    potentialMatches,
    isLoading,
    error,
    fetchCategories,
    saveAnswers,
    findMatches
  } = useMatchingStore();

  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState<MatchingProfile>({
    userId: user?.id || '',
    answers: [],
    preferences: {
      intentionTypes: [],
      dealbreakers: []
    },
    completionPercentage: 0,
    lastUpdated: new Date()
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      answers: [
        ...prev.answers.filter(a => a.questionId !== questionId),
        {
          questionId,
          categoryId: categories[currentCategory].id,
          value,
          weight: categories[currentCategory].questions.find(q => q.id === questionId)?.weight || 1
        }
      ]
    }));
  };

  const calculateCompletion = () => {
    const totalQuestions = categories.reduce((acc, cat) => acc + cat.questions.length, 0);
    const answeredQuestions = answers.answers.length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const handleNext = async () => {
    const completion = calculateCompletion();
    setAnswers(prev => ({
      ...prev,
      completionPercentage: completion
    }));

    if (currentCategory < categories.length - 1) {
      setCurrentCategory(prev => prev + 1);
    } else {
      await saveAnswers(answers);
      await findMatches();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  const currentCat = categories[currentCategory];
  if (!currentCat) return null;

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
          Find Your Cosmic Match
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Answer a few questions to help us find your perfect party companions
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>Profile Completion</span>
          <span>{calculateCompletion()}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${calculateCompletion()}%` }}
          />
        </div>
      </div>

      {/* Question form */}
      <motion.div 
        key={currentCat.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center mr-4">
              <Users className="text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentCat.name}</h2>
              <p className="text-gray-400">{currentCat.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            {currentCat.questions.map(question => (
              <div key={question.id} className="space-y-4">
                <label className="block font-medium">
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {question.type === QuestionType.SINGLE_CHOICE && (
                  <div className="grid grid-cols-2 gap-3">
                    {question.options?.map(option => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(question.id, option)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          answers.answers.find(a => a.questionId === question.id)?.value === option
                            ? 'border-indigo-500 bg-indigo-500/20'
                            : 'border-gray-700 hover:border-indigo-500/50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === QuestionType.MULTIPLE_CHOICE && (
                  <div className="grid grid-cols-2 gap-3">
                    {question.options?.map(option => {
                      const isSelected = (answers.answers.find(a => a.questionId === question.id)?.value as string[] || []).includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            const currentValues = (answers.answers.find(a => a.questionId === question.id)?.value as string[]) || [];
                            const newValues = isSelected
                              ? currentValues.filter(v => v !== option)
                              : [...currentValues, option];
                            handleAnswer(question.id, newValues);
                          }}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/20'
                              : 'border-gray-700 hover:border-indigo-500/50'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleNext}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              {currentCategory < categories.length - 1 ? (
                <>
                  Next Section
                  <ChevronRight size={16} className="ml-2" />
                </>
              ) : (
                <>
                  Find Matches
                  <Heart size={16} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MatchingPage;