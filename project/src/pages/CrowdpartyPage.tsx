import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Building2, ChevronRight, Calendar, Users, ThumbsUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// This is a placeholder page - in a full implementation, it would fetch data from an API
const CrowdpartyPage: React.FC = () => {
  const [activePolls, setActivePolls] = useState([]);
  
  const [pastPolls, setPastPolls] = useState([]);
  
  const handleVote = (pollId: string, optionId: string) => {
    setActivePolls(polls => 
      polls.map(poll => {
        if (poll.id === pollId) {
          // Update vote counts
          const updatedOptions = poll.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });
          
          return {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1,
            hasVoted: true,
            votedFor: optionId
          };
        }
        return poll;
      })
    );
  };
  
  // Format time remaining
  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    
    return `${minutes}m remaining`;
  };
  
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display flex items-center">
          <Radio size={24} className="mr-2 text-indigo-500" />
          CrowdParty
        </h1>
        <p className="text-gray-400 mt-1">
          Vote for your favorite DJs and help clubs decide who to book next
        </p>
      </div>
      
      {/* Active Polls */}
      <div className="mb-8">
        <h2 className="text-xl font-display mb-4">Active Polls</h2>
        
        {activePolls.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <Radio size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium mb-2">No Active Polls</h3>
            <p className="text-gray-400">
              Polls will appear here when clubs create them for their events.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active polls will be rendered here when available */}
          </div>
        )}
      </div>
      
      {/* Past Polls */}
      <div>
        <h2 className="text-xl font-display mb-4">Past Results</h2>
        
        {pastPolls.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <Star size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium mb-2">No Past Results</h3>
            <p className="text-gray-400">
              Past poll results will appear here once clubs start creating polls.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Past polls will be rendered here when available */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrowdpartyPage;