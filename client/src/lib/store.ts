import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockUsers, mockLeads, mockActivities, mockTasks, User, Lead, Activity, Task } from './mock-data';

interface AppState {
  currentUser: User | null;
  currentTeamId: string;
  simulatedRole: 'manager' | 'executive' | null;
  users: User[];
  leads: Lead[];
  activities: Activity[];
  tasks: Task[];
  
  setCurrentUser: (user: User | null) => void;
  setCurrentTeamId: (teamId: string) => void;
  setSimulatedRole: (role: 'manager' | 'executive' | null) => void;
  setRole: (role: User['role']) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateLeadStage: (leadId: string, newStage: Lead['stage']) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentTeamId: 'travel-sales',
      simulatedRole: null,
      users: mockUsers,
      leads: mockLeads,
      activities: mockActivities,
      tasks: mockTasks,

      setCurrentUser: (user) => set({ currentUser: user }),
      setCurrentTeamId: (teamId) => set({ currentTeamId: teamId }),
      setSimulatedRole: (role) => set({ simulatedRole: role }),
      setRole: (role) => set((state) => ({ 
        currentUser: state.currentUser ? { ...state.currentUser, role } : null 
      })),
      
      addLead: (leadData) => set((state) => ({
        leads: [...state.leads, {
          ...leadData,
          id: `l${Date.now()}`,
          createdAt: new Date().toISOString()
        }]
      })),
      
      updateLead: (id, updates) => set((state) => ({
        leads: state.leads.map(lead => 
          lead.id === id ? { ...lead, ...updates } : lead
        )
      })),

      deleteLead: (id) => set((state) => ({
        leads: state.leads.filter(lead => lead.id !== id)
      })),
      
      addActivity: (activityData) => set((state) => ({
        activities: [...state.activities, {
          ...activityData,
          id: `a${Date.now()}`,
          createdAt: new Date().toISOString()
        }]
      })),

      updateLeadStage: (leadId, newStage) => {
        const { updateLead, addActivity, currentUser } = get();
        const lead = get().leads.find(l => l.id === leadId);
        
        if (lead && lead.stage !== newStage && currentUser) {
          updateLead(leadId, { stage: newStage });
          addActivity({
            leadId,
            userId: currentUser.id,
            type: 'stage_change',
            notes: `Stage changed from ${lead.stage} to ${newStage}`,
            fromStage: lead.stage,
            toStage: newStage
          });
        }
      },

      addUser: (userData) => set((state) => ({
        users: [...state.users, {
          ...userData,
          id: `u${Date.now()}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
        }]
      })),

      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...updates } : user
        )
      })),

      deleteUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),

      updateTaskStatus: (taskId, newStatus) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      })),

      addTask: (taskData) => set((state) => ({
        tasks: [...state.tasks, {
          ...taskData,
          id: `t${Date.now()}`
        }]
      }))
    }),
    {
      name: 'suprans-store',
      partialize: (state) => ({ currentTeamId: state.currentTeamId, simulatedRole: state.simulatedRole }),
    }
  )
);
