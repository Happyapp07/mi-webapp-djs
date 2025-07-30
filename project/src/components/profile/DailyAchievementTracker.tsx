import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Check, Clock, Gift, Star } from 'lucide-react';
import { useAchievementStore } from '../../stores/achievementStore';
import { useAuthStore } from '../../stores/authStore';

interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  icon: React.ReactNode;
}

const DailyAchievementTracker: React.FC = () => {
  const { user } = useAuthStore();
  const { updateAchievementProgress } = useAchievementStore();
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  useEffect(() => {
    // Generate daily tasks
    const tasks: DailyTask[] = [
      {
        id: 'daily_vote',
        title: 'Vota una sesión',
        description: 'Envía tu pulso de energía a un DJ',
        reward: 5,
        completed: Math.random() > 0.5,
        icon: <Star size={20} className="text-yellow-400" />
      },
      {
        id: 'daily_scan',
        title: 'Escanea un QR',
        description: 'Visita un club y escanea su código QR',
        reward: 10,
        completed: Math.random() > 0.7,
        icon: <Award size={20} className="text-indigo-400" />
      },
      {
        id: 'daily_match',
        title: 'Haz un match',
        description: 'Conecta con otro tripulante',
        reward: 5,
        completed: Math.random() > 0.6,
        icon: <Gift size={20} className="text-purple-400" />
      }
    ];
    
    // Add DJ-specific task
    if (user?.userType === 'dj') {
      tasks.push({
        id: 'daily_session',
        title: 'Sube una sesión',
        description: 'Comparte tu música con la galaxia',
        reward: 15,
        completed: Math.random() > 0.8,
        icon: <Star size={20} className="text-cyan-400" />
      });
    }
    
    setDailyTasks(tasks);
    
    // Calculate completion percentage
    const completedCount = tasks.filter(task => task.completed).length;
    setCompletionPercentage(Math.round((completedCount / tasks.length) * 100));
    
    // Calculate time remaining until reset
    const updateTimeRemaining = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    };
    
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [user]);
  
  const handleCompleteTask = async (taskId: string) => {
    // Update task completion
    setDailyTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    
    // Update completion percentage
    const updatedTasks = dailyTasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    const completedCount = updatedTasks.filter(task => task.completed).length;
    setCompletionPercentage(Math.round((completedCount / updatedTasks.length) * 100));
    
    // Update achievement progress
    // In a real app, this would update the appropriate achievement
    // For demo, we'll just log it
    console.log(`Completed daily task: ${taskId}`);
    
    // Map daily tasks to achievements
    const achievementMap: Record<string, string> = {
      'daily_vote': 'votes_received',
      'daily_scan': 'club_attendance',
      'daily_match': 'matches_made',
      'daily_session': 'sessions_uploaded'
    };
    
    if (achievementMap[taskId]) {
      await updateAchievementProgress(achievementMap[taskId], 1);
    }
  };
  
  return (
    <div className="glass-card p-4 rounded-xl mb-6 relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium flex items-center">
            <Calendar size={18} className="mr-2 text-indigo-400" />
            Misiones Diarias
          </h3>
          
          <div className="flex items-center text-sm text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>Reinicio en {timeRemaining}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Daily Tasks */}
        <div className="space-y-3">
          {dailyTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg relative overflow-hidden ${
                task.completed 
                  ? 'border border-green-500/30' 
                  : 'border border-gray-700'
              }`}
            >
              {/* Background effect */}
              {task.completed ? (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10"></div>
              ) : (
                <div className="absolute inset-0 bg-gray-800/50"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                      <div className="relative z-10">
                        {task.icon}
                      </div>
                      {!task.completed && (
                        <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-400">{task.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-green-400 font-medium mr-3">+{task.reward} BC</div>
                    
                    {task.completed ? (
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check size={14} className="text-green-500" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs hover:bg-indigo-500/30 transition-colors"
                      >
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Completion Bonus */}
        {completionPercentage === 100 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/30 flex items-center"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <Check size={16} className="text-green-500" />
            </div>
            <div>
              <div className="font-medium">¡Todas las misiones completadas!</div>
              <div className="text-sm text-gray-300">Has ganado un bonus de +10 Beatcoins</div>
            </div>
          </motion.div>
        ) : (
          <div className="mt-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
            <div className="flex items-center">
              <Gift size={18} className="text-indigo-400 mr-2" />
              <div className="text-sm">
                Completa todas las misiones diarias para ganar un bonus de +10 Beatcoins
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyAchievementTracker;