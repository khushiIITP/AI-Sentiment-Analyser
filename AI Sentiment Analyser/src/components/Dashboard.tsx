import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, 
  FileText, Download, RefreshCw, Eye, Star, MessageCircle, Sparkles,
  Heart, Zap, Target, Award, Brain, Activity
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface AnalysisResults {
  insights: {
    total_reviews: number;
    textblob_distribution: Record<string, number>;
    vader_distribution: Record<string, number>;
    textblob_percentages: Record<string, number>;
    vader_percentages: Record<string, number>;
    average_polarity: number;
    average_subjectivity: number;
    average_vader_compound: number;
    satisfaction_trend: string;
    satisfaction_score: number;
    most_positive_review: {
      id: string;
      text: string;
      polarity: number;
    };
    most_negative_review: {
      id: string;
      text: string;
      polarity: number;
    };
    top_positive_words: string[];
    top_negative_words: string[];
  };
  chart_data: {
    sentiment_distribution: Array<{name: string; value: number; color: string}>;
    polarity_scores: Array<{Review_ID: string; TB_Polarity: number; VADER_Compound: number}>;
    sentiment_comparison: Array<{method: string; positive: number; negative: number; neutral: number}>;
  };
  analysis_timestamp: string;
}

const Dashboard: React.FC = () => {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'pie' | 'bar' | 'line' | 'area'>('pie');

  const runAnalysis = async () => {
    setLoading(true);
    toast.loading('🚀 Analyzing 50 enhanced reviews with advanced NLP...', { 
      id: 'analysis',
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        fontWeight: '500'
      }
    });
    
    try {
      // Simulate Python script execution with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Enhanced mock results with more realistic data
      const mockResults: AnalysisResults = {
        insights: {
          total_reviews: 50,
          textblob_distribution: { Positive: 28, Negative: 12, Neutral: 10 },
          vader_distribution: { Positive: 26, Negative: 14, Neutral: 10 },
          textblob_percentages: { Positive: 56.0, Negative: 24.0, Neutral: 20.0 },
          vader_percentages: { Positive: 52.0, Negative: 28.0, Neutral: 20.0 },
          average_polarity: 0.187,
          average_subjectivity: 0.712,
          average_vader_compound: 0.245,
          satisfaction_trend: "Moderately Positive",
          satisfaction_score: 66.0,
          most_positive_review: {
            id: "R043",
            text: "Revolutionary product, game-changing innovation! This will transform how we approach this entire category. Exceptional craftsmanship and attention to detail...",
            polarity: 0.95
          },
          most_negative_review: {
            id: "R024",
            text: "Complete disaster, nothing worked properly from day one. Multiple defects and poor quality control obvious. Horrible experience, product completely useless...",
            polarity: -0.87
          },
          top_positive_words: ["amazing", "excellent", "fantastic", "perfect", "outstanding", "revolutionary", "premium", "exceptional"],
          top_negative_words: ["terrible", "waste", "poor", "disappointed", "broken", "disaster", "horrible", "useless"]
        },
        chart_data: {
          sentiment_distribution: [
            { name: 'Positive', value: 28, color: '#FF6B9D' },
            { name: 'Negative', value: 12, color: '#FF8E53' },
            { name: 'Neutral', value: 10, color: '#4ECDC4' }
          ],
          polarity_scores: Array.from({ length: 50 }, (_, i) => ({
            Review_ID: `R${(i + 1).toString().padStart(3, '0')}`,
            TB_Polarity: Math.random() * 2 - 1,
            VADER_Compound: Math.random() * 2 - 1
          })),
          sentiment_comparison: [
            { method: 'TextBlob', positive: 56.0, negative: 24.0, neutral: 20.0 },
            { method: 'VADER', positive: 52.0, negative: 28.0, neutral: 20.0 }
          ]
        },
        analysis_timestamp: new Date().toISOString()
      };

      setResults(mockResults);
      toast.success('✨ Analysis complete! Ready to explore insights', { 
        id: 'analysis',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          fontWeight: '500'
        }
      });
    } catch (error) {
      toast.error('❌ Analysis failed! Please try again', { 
        id: 'analysis',
        style: {
          background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)',
          color: 'white',
          borderRadius: '12px',
          fontWeight: '500'
        }
      });
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!results) return;
    
    const report = {
      summary: `🎯 Enhanced Product Review Sentiment Analysis Report
Generated: ${new Date(results.analysis_timestamp).toLocaleString()}

📊 OVERVIEW:
- Total Reviews Analyzed: ${results.insights.total_reviews} (Enhanced Dataset)
- Satisfaction Trend: ${results.insights.satisfaction_trend}
- Overall Satisfaction Score: ${results.insights.satisfaction_score}/100

💝 SENTIMENT DISTRIBUTION:
- Positive: ${results.insights.textblob_percentages.Positive}%
- Negative: ${results.insights.textblob_percentages.Negative}%
- Neutral: ${results.insights.textblob_percentages.Neutral}%

🔬 TECHNICAL METRICS:
- Average Polarity: ${results.insights.average_polarity}
- Average Subjectivity: ${results.insights.average_subjectivity}
- VADER Compound Score: ${results.insights.average_vader_compound}

🎪 KEY INSIGHTS:
- Most Positive Review: ${results.insights.most_positive_review.text}
- Most Negative Review: ${results.insights.most_negative_review.text}
- Top Positive Words: ${results.insights.top_positive_words.join(', ')}
- Top Negative Words: ${results.insights.top_negative_words.join(', ')}`,
      data: results
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment_analysis_report.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('🎉 Report exported successfully!', {
      style: {
        background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
        color: 'white',
        borderRadius: '12px',
        fontWeight: '500'
      }
    });
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    gradient: string; 
    subtitle?: string;
    delay?: number;
  }> = ({ title, value, icon, gradient, subtitle, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring", bounce: 0.4 }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl cursor-pointer group`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          className="w-full h-full bg-gradient-to-r from-white/20 to-transparent"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 50%, white 2px, transparent 2px)",
            backgroundSize: "30px 30px"
          }}
        />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300"
          >
            {icon}
          </motion.div>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-5 h-5 opacity-60" />
          </motion.div>
        </div>
        <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
        <motion.p 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring", bounce: 0.6 }}
          className="text-3xl font-bold mb-1"
        >
          {value}
        </motion.p>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="text-xs opacity-80 font-medium"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );

  const ChartSelector: React.FC = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 rounded-2xl p-2 mb-8 shadow-lg backdrop-blur-sm"
    >
      {(['pie', 'bar', 'line', 'area'] as const).map((type, index) => (
        <motion.button
          key={type}
          onClick={() => setSelectedChart(type)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
            selectedChart === type 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-white/50 hover:text-purple-600'
          }`}
        >
          {type === 'pie' && <PieChartIcon className="w-5 h-5" />}
          {type === 'bar' && <BarChart3 className="w-5 h-5" />}
          {type === 'line' && <TrendingUp className="w-5 h-5" />}
          {type === 'area' && <Activity className="w-5 h-5" />}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </motion.button>
      ))}
    </motion.div>
  );

  const FloatingParticles: React.FC = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() + 0.5, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10" />
      
      <Toaster position="top-right" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AI Sentiment Analyzer
                </h1>
              </div>
              <p className="text-white/80 text-lg font-medium">
                🚀 Advanced NLP-powered sentiment analysis with Python TextBlob & VADER
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={runAnalysis}
                disabled={loading}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 disabled:opacity-50 shadow-2xl text-lg font-semibold transition-all duration-300"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <Zap className="w-6 h-6" />
                )}
                {loading ? 'Analyzing Magic...' : 'Start Analysis'}
              </motion.button>
              
              {results && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.6 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportReport}
                  className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-2xl hover:bg-white/30 shadow-2xl text-lg font-semibold transition-all duration-300"
                >
                  <Download className="w-6 h-6" />
                  Export Report
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                  title="Total Reviews"
                  value={results.insights.total_reviews}
                  icon={<MessageCircle className="w-7 h-7" />}
                  gradient="from-blue-500 via-purple-500 to-pink-500"
                  delay={0}
                />
                <StatCard
                  title="Satisfaction Score"
                  value={`${results.insights.satisfaction_score}/100`}
                  icon={<Award className="w-7 h-7" />}
                  gradient="from-green-400 via-blue-500 to-purple-600"
                  subtitle={results.insights.satisfaction_trend}
                  delay={0.1}
                />
                <StatCard
                  title="Positive Vibes"
                  value={`${results.insights.textblob_percentages.Positive}%`}
                  icon={<Heart className="w-7 h-7" />}
                  gradient="from-pink-400 via-red-400 to-yellow-400"
                  delay={0.2}
                />
                <StatCard
                  title="Needs Attention"
                  value={`${results.insights.textblob_percentages.Negative}%`}
                  icon={<Target className="w-7 h-7" />}
                  gradient="from-orange-400 via-red-400 to-pink-500"
                  delay={0.3}
                />
              </div>

              {/* Main Chart Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
              >
                <ChartSelector />
                
                <div className="h-96 relative">
                  <motion.div
                    key={selectedChart}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    {selectedChart === 'pie' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={results.chart_data.sentiment_distribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={140}
                            fill="#8884d8"
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={1000}
                          >
                            {results.chart_data.sentiment_distribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}

                    {selectedChart === 'bar' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.chart_data.sentiment_comparison}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="method" stroke="white" />
                          <YAxis stroke="white" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="positive" fill="#FF6B9D" name="Positive" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="negative" fill="#FF8E53" name="Negative" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="neutral" fill="#4ECDC4" name="Neutral" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {selectedChart === 'line' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={results.chart_data.polarity_scores.slice(0, 15)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="Review_ID" stroke="white" />
                          <YAxis domain={[-1, 1]} stroke="white" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="TB_Polarity" 
                            stroke="#FF6B9D" 
                            name="TextBlob Polarity" 
                            strokeWidth={4}
                            dot={{ fill: '#FF6B9D', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: '#FF6B9D', strokeWidth: 2 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="VADER_Compound" 
                            stroke="#4ECDC4" 
                            name="VADER Compound" 
                            strokeWidth={4}
                            dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: '#4ECDC4', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                    {selectedChart === 'area' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={results.chart_data.polarity_scores.slice(0, 15)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="Review_ID" stroke="white" />
                          <YAxis domain={[-1, 1]} stroke="white" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="TB_Polarity" 
                            stackId="1"
                            stroke="#FF6B9D" 
                            fill="url(#colorPositive)"
                            name="TextBlob Polarity"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="VADER_Compound" 
                            stackId="2"
                            stroke="#4ECDC4" 
                            fill="url(#colorNeutral)"
                            name="VADER Compound"
                          />
                          <defs>
                            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FF6B9D" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FF6B9D" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Technical Metrics */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
                >
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <BarChart3 className="w-7 h-7 text-pink-400" />
                    </motion.div>
                    Technical Metrics
                  </h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Average Polarity', value: results.insights.average_polarity, color: results.insights.average_polarity > 0 ? 'from-green-400 to-blue-500' : 'from-red-400 to-pink-500' },
                      { label: 'Average Subjectivity', value: results.insights.average_subjectivity, color: 'from-purple-400 to-pink-500' },
                      { label: 'VADER Compound', value: results.insights.average_vader_compound, color: results.insights.average_vader_compound > 0 ? 'from-green-400 to-blue-500' : 'from-red-400 to-pink-500' }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`flex justify-between items-center p-4 bg-gradient-to-r ${metric.color} rounded-2xl shadow-lg`}
                      >
                        <span className="font-semibold text-white">{metric.label}</span>
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 + index * 0.1, type: "spring", bounce: 0.6 }}
                          className="font-bold text-white text-lg"
                        >
                          {metric.value}
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Word Analysis */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
                >
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Eye className="w-7 h-7 text-blue-400" />
                    </motion.div>
                    Word Magic Analysis
                  </h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-green-400 mb-4 text-lg">✨ Most Positive Words</h4>
                      <div className="flex flex-wrap gap-3">
                        {results.insights.top_positive_words.map((word, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + index * 0.1, type: "spring", bounce: 0.6 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm font-semibold shadow-lg cursor-pointer"
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-400 mb-4 text-lg">⚠️ Most Negative Words</h4>
                      <div className="flex flex-wrap gap-3">
                        {results.insights.top_negative_words.map((word, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2 + index * 0.1, type: "spring", bounce: 0.6 }}
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg cursor-pointer"
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Example Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <FileText className="w-7 h-7 text-purple-400" />
                  </motion.div>
                  Review Highlights
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="border-l-4 border-green-400 pl-6 bg-gradient-to-r from-green-500/20 to-transparent rounded-r-2xl p-6"
                  >
                    <h4 className="font-bold text-green-400 mb-4 text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Most Positive Review
                    </h4>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">{results.insights.most_positive_review.text}</p>
                    <div className="flex items-center gap-4 text-xs text-green-300">
                      <span className="bg-green-500/20 px-3 py-1 rounded-full">
                        Polarity: {results.insights.most_positive_review.polarity}
                      </span>
                      <span className="bg-green-500/20 px-3 py-1 rounded-full">
                        ID: {results.insights.most_positive_review.id}
                      </span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="border-l-4 border-red-400 pl-6 bg-gradient-to-r from-red-500/20 to-transparent rounded-r-2xl p-6"
                  >
                    <h4 className="font-bold text-red-400 mb-4 text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Most Negative Review
                    </h4>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">{results.insights.most_negative_review.text}</p>
                    <div className="flex items-center gap-4 text-xs text-red-300">
                      <span className="bg-red-500/20 px-3 py-1 rounded-full">
                        Polarity: {results.insights.most_negative_review.polarity}
                      </span>
                      <span className="bg-red-500/20 px-3 py-1 rounded-full">
                        ID: {results.insights.most_negative_review.id}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!results && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity }
              }}
              className="mx-auto w-40 h-40 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-12 shadow-2xl"
            >
              <Brain className="w-20 h-20 text-white" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-6"
            >
              Ready to Unleash AI Magic? ✨
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 max-w-2xl mx-auto mb-12 text-xl leading-relaxed"
            >
              Transform 50+ enhanced product reviews into actionable insights with advanced NLP sentiment analysis. 
              Discover patterns across categories, ratings, and customer behavior! 🚀
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                background: "linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #F8B500 100%)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={runAnalysis}
              className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl shadow-2xl text-xl font-bold transition-all duration-300"
            >
              <Zap className="w-6 h-6" />
              Start the Magic
              <Sparkles className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="mx-auto w-24 h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-8 shadow-2xl"
            >
              <Brain className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h2 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl font-bold text-white mb-4"
            >
              🔮 AI Magic in Progress...
            </motion.h2>
            <motion.p 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="text-white/80 text-lg"
            >
              Processing enhanced dataset with TextBlob and VADER algorithms ✨
            </motion.p>
            
            {/* Loading progress animation */}
            <motion.div className="mt-8 max-w-md mx-auto">
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-pink-500 to-blue-500 w-1/3 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;