"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, Send, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { getIncomingRequests, getSentRequests, acceptRequest, rejectRequest } from '@/api/request.api';
import { RequestCard } from '@/components/RequestCard';
import { toast } from 'react-hot-toast';

type Tab = 'incoming' | 'sent';

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('incoming');
  const [incoming, setIncoming] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [incomingData, sentData] = await Promise.all([
        getIncomingRequests(),
        getSentRequests()
      ]);
      setIncoming(incomingData);
      setSent(sentData);
    } catch (error) {
      console.error('Failed to fetch requests', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      setActionLoading(id);
      await acceptRequest(id);
      toast.success('Promotion request accepted!');
      fetchRequests(); // Refresh data
    } catch (error) {
      toast.error('Failed to accept request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(id);
      await rejectRequest(id);
      toast.success('Promotion request rejected');
      fetchRequests(); // Refresh data
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const currentRequests = activeTab === 'incoming' ? incoming : sent;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Promotion Requests</h1>
          <p className="text-slate-500">Manage your partnerships and cross-promotion invites.</p>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 bg-slate-200/50 rounded-2xl mb-8 w-full sm:w-80">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'incoming' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Incoming
            {incoming.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">
                {incoming.filter(r => r.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'sent' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Send className="w-4 h-4" />
            Sent
          </button>
        </div>

        {/* Requests List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))
          ) : currentRequests.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {currentRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <RequestCard
                    request={request}
                    type={activeTab}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    isLoading={actionLoading === request.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'incoming' ? <Inbox className="text-slate-300" /> : <Send className="text-slate-300" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">No {activeTab} requests</h3>
              <p className="text-slate-500">Your {activeTab} requests will appear here once they start coming in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
