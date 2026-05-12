/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Send, Target, History, Trophy, AlertCircle } from 'lucide-react';

/**
 * 遊戲狀態型別定義
 */
type GameStatus = 'playing' | 'won';

interface GuessRecord {
  value: number;
  result: 'high' | 'low' | 'correct';
}

export default function App() {
  // 遊戲狀態
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 初始化遊戲
  const initGame = useCallback(() => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    setHistory([]);
    setUserGuess('');
    setStatus('playing');
    setMessage('請輸入 1 到 100 之間的數字開始挑戰！');
    setError(null);
  }, []);

  // 頁面加載時啟動遊戲
  useEffect(() => {
    initGame();
  }, [initGame]);

  // 處理提交猜測
  const handleGuess = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (status === 'won') return;

    const num = parseInt(userGuess);

    // 驗證輸入
    if (isNaN(num) || num < 1 || num > 100) {
      setError('請輸入有效的 1-100 數字');
      return;
    }

    setError(null);
    let result: 'high' | 'low' | 'correct';
    let newMessage: string;

    if (num > targetNumber) {
      result = 'high';
      newMessage = '太大了！再試一次。';
    } else if (num < targetNumber) {
      result = 'low';
      newMessage = '太小了！再試一次。';
    } else {
      result = 'correct';
      newMessage = '恭喜！猜對了！';
      setStatus('won');
    }

    setHistory((prev) => [{ value: num, result }, ...prev]);
    setMessage(newMessage);
    setUserGuess('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden font-sans relative">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 sm:p-12 flex flex-col items-center min-h-[550px] z-10"
      >
        {/* Header Section */}
        <header className="text-center space-y-3 mb-8 w-full">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
            Guess Number
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-pink-400 mx-auto rounded-full shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
          <p className="text-indigo-100/60 text-xs font-bold mt-4 tracking-[0.2em] uppercase">
            目標：找出 1 — 100 的神秘數字
          </p>
        </header>

        {/* Feedback Display Area */}
        <div className="flex-1 flex flex-col items-center justify-center my-6 w-full text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={message || 'initial'}
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className={`text-5xl sm:text-6xl font-black italic drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] mb-2 ${status === 'won' ? 'text-green-400' : 'text-white'}`}>
                {status === 'won' ? '猜對了！' : message?.split('！')[0] || '遊戲開始'}
              </div>
              <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
                System Feedback
              </p>
            </motion.div>
          </AnimatePresence>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-pink-400 text-xs font-bold uppercase tracking-wider bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20 flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
        </div>

        {/* Interaction Section */}
        <div className="w-full space-y-4">
          <form onSubmit={handleGuess} className="space-y-4">
            <div className="relative group">
              <input
                type="number"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                disabled={status === 'won'}
                placeholder="??"
                className={`w-full bg-black/30 border-2 rounded-3xl py-6 text-center text-5xl font-mono font-bold text-white focus:outline-none transition-all placeholder:text-white/5
                  ${error ? 'border-pink-500/50 px-bg-pink-500/10' : 'border-white/10 focus:border-indigo-400/50 focus:bg-black/40'}
                  disabled:opacity-30 disabled:cursor-not-allowed`}
              />
              <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none opacity-20 hidden sm:flex">
                <span className="text-white text-xl font-black italic">NUM</span>
              </div>
            </div>

            {status === 'won' ? (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={initGame}
                type="button"
                className="w-full py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-emerald-950 font-black text-xl rounded-3xl shadow-[0_10px_30px_rgba(52,211,153,0.3)] transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                再玩一次 PLAY AGAIN
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-5 bg-white text-indigo-950 font-black text-xl rounded-3xl shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all uppercase tracking-wider"
              >
                提交猜測 SUBMIT
              </motion.button>
            )}
          </form>
          
          {status !== 'won' && history.length > 0 && (
            <button 
              onClick={initGame}
              className="w-full py-3 bg-white/5 border border-white/10 text-white/60 font-bold text-xs rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              重新開始 RESET
            </button>
          )}
        </div>

        {/* Footer Stats Section */}
        <div className="mt-10 grid grid-cols-2 gap-4 w-full">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center text-center">
            <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
              <History size={10} />
              Attempt Count
            </div>
            <div className="text-3xl font-mono font-black text-indigo-400">
              {history.length.toString().padStart(2, '0')} 
              <span className="text-[10px] font-sans text-white/30 ml-1">次</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center text-center">
            <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
              <Target size={10} />
              Target Range
            </div>
            <div className="text-3xl font-mono font-black text-pink-400">01-100</div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Branding / Status */}
      <footer className="mt-8 flex items-center gap-6 z-10 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></div>
          <span>Game Engine Active</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10"></div>
        <span>Vite + React + TS</span>
      </footer>

      {/* History Log Overlay (Optional/Floating) */}
      {history.length > 0 && (
        <div className="fixed bottom-4 left-4 max-h-[200px] overflow-hidden hidden xl:block">
          <div className="flex flex-col gap-2 p-4">
            {history.slice(0, 5).map((record, i) => (
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                key={i}
                className={`px-4 py-2 rounded-full text-[10px] font-black border backdrop-blur-md ${
                  record.result === 'correct' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                  record.result === 'high' ? 'bg-pink-500/20 border-pink-500/30 text-pink-400' :
                  'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                }`}
              >
                {record.value.toString().padStart(3, '0')} {record.result === 'high' ? 'TOO HIGH' : record.result === 'low' ? 'TOO LOW' : 'CORRECT'}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
