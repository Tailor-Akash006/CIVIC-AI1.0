import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Complaint, 
  UserRole, 
  NewComplaintPayload, 
  ComplaintStatus, 
  AuthorityKPIs,
  HotspotZone,
  AIActionBrief
} from '../types';
import { CivicApiService } from '../services/api';

interface CivicContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  complaints: Complaint[];
  loading: boolean;
  kpis: AuthorityKPIs | null;
  hotspots: HotspotZone[];
  actionBriefs: AIActionBrief[];
  refreshData: () => Promise<void>;
  submitComplaint: (payload: NewComplaintPayload) => Promise<Complaint>;
  updateStatus: (id: string, status: ComplaintStatus, note?: string, officer?: string, dept?: string) => Promise<Complaint>;
  mergeDuplicateReport: (primaryId: string, duplicateId: string) => Promise<Complaint>;
  resetAllDemoData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('citizen');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [kpis, setKpis] = useState<AuthorityKPIs | null>(null);
  const [hotspots, setHotspots] = useState<HotspotZone[]>([]);
  const [actionBriefs, setActionBriefs] = useState<AIActionBrief[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [complaintList, kpiData, hotspotData, briefs] = await Promise.all([
        CivicApiService.getComplaints(),
        CivicApiService.getKPIs(),
        CivicApiService.getHotspotZones(),
        CivicApiService.getActionBriefs()
      ]);
      setComplaints(complaintList);
      setKpis(kpiData);
      setHotspots(hotspotData);
      setActionBriefs(briefs);
    } catch (err) {
      console.error('Error refreshing civic data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    showToast(`Switched view to ${newRole === 'authority' ? 'Municipal Authority Console' : 'Citizen Portal'}`);
  };

  const submitComplaint = async (payload: NewComplaintPayload): Promise<Complaint> => {
    const created = await CivicApiService.createComplaint(payload);
    await refreshData();
    showToast(`Complaint filed successfully! Tracking Code: ${created.trackingNumber}`);
    return created;
  };

  const updateStatus = async (
    id: string, 
    status: ComplaintStatus, 
    note?: string, 
    officer?: string,
    dept?: string
  ): Promise<Complaint> => {
    const updated = await CivicApiService.updateComplaintStatus(id, status, note, officer, dept);
    await refreshData();
    showToast(`Status updated to ${status.replace('_', ' ').toUpperCase()} for ${updated.trackingNumber}`);
    return updated;
  };

  const mergeDuplicateReport = async (primaryId: string, duplicateId: string): Promise<Complaint> => {
    const merged = await CivicApiService.mergeDuplicate(primaryId, duplicateId);
    await refreshData();
    showToast(`Merged duplicate report into ${merged.trackingNumber}`);
    return merged;
  };

  const resetAllDemoData = () => {
    CivicApiService.resetDemoData();
    refreshData();
    showToast('Demo data reset to initial baseline values');
  };

  return (
    <CivicContext.Provider
      value={{
        role,
        setRole,
        complaints,
        loading,
        kpis,
        hotspots,
        actionBriefs,
        refreshData,
        submitComplaint,
        updateStatus,
        mergeDuplicateReport,
        resetAllDemoData,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = (): CivicContextType => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
