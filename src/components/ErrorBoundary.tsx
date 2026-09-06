/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    isChunkError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorStr = String(error?.message || '');
    const isChunk = 
      errorStr.includes('Failed to fetch dynamically imported module') ||
      errorStr.includes('Loading chunk') ||
      errorStr.includes('ChunkLoadError') ||
      errorStr.includes('import() failed') ||
      errorStr.includes('is not executable');

    return {
      hasError: true,
      error,
      isChunkError: isChunk
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);

    // If it's a chunk load error (usually happens when a new version was deployed on Vercel),
    // automatically reload once with cache busting to get fresh assets!
    const isChunk = this.state.isChunkError;
    if (isChunk && typeof window !== 'undefined') {
      const reloadKey = 'naqla_chunk_reload_attempt';
      const lastAttempt = sessionStorage.getItem(reloadKey);
      const now = Date.now();

      // Only auto-reload if we haven't reloaded in the last 10 seconds
      if (!lastAttempt || now - Number(lastAttempt) > 10000) {
        sessionStorage.setItem(reloadKey, String(now));
        // Clear caches if Service Worker exists
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
          });
        }
        window.location.reload();
      }
    }
  }

  private handleHardReload = () => {
    if (typeof window === 'undefined') return;
    const loc = window.location;
    if ('caches' in window) {
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      }).catch(() => {}).finally(() => {
        loc.href = loc.pathname + '?t=' + Date.now();
      });
    } else {
      loc.reload();
    }
  };

  private handleClearData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    this.handleHardReload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4"
          dir="rtl"
          style={{ fontFamily: "'Tajawal', 'Readex Pro', sans-serif" }}
        >
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-[0_8px_0_0_#D1B02B] text-center space-y-5 animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-amber-100 rounded-3xl flex items-center justify-center border-3 border-amber-300 shadow-inner">
              <span className="text-4xl select-none">🎮</span>
            </div>

            <div>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                أكاديمية نقلة التعليمية
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                عذراً يا بطل! جاري تحديث الألعاب 🚀
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm font-bold mt-1.5 leading-relaxed">
                حدث تحديث في المنصة أو انقطاع بسيط في الاتصال. انقر على الزر بالأسفل للتحميل الفوري السلس!
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={this.handleHardReload}
                className="w-full bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-black py-3.5 px-6 rounded-2xl border-3 border-[#4834D4] shadow-[0_5px_0_0_#4834D4] hover:translate-y-1 hover:shadow-[0_2px_0_0_#4834D4] transition flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل وتحديث المنصة الآن</span>
              </button>

              <button
                onClick={this.handleClearData}
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-black py-2.5 px-4 rounded-xl border-2 border-amber-200 transition flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-700" />
                <span>مسح الذاكرة المؤقتة القديمة</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-400 font-bold pt-2 border-t border-gray-100">
              منصة ألعاب نقلة التفاعلية • تعمل دائماً بكفاءة عالية على جميع الهواتف
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
