"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LifeBuoy, AlertTriangle, ListTodo, Map } from "lucide-react";
import { useGetRescueTasksQuery, useGetVolunteersQuery, useAssignVolunteerMutation } from "@/services/rescueApi";
import { useGetFloodPredictionsQuery } from "@/services/predictionApi";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function RescuePage() {
  const { data: rescueData, isLoading: rescueLoading, isError: rescueError, refetch: refetchRescue } = useGetRescueTasksQuery(undefined, { pollingInterval: 5000 });
  const { data: floodData, isLoading: floodLoading } = useGetFloodPredictionsQuery(undefined, { pollingInterval: 5000 });
  const { data: volunteersData } = useGetVolunteersQuery(undefined, { pollingInterval: 5000 });
  const [assignVolunteer, { isLoading: isAssigning }] = useAssignVolunteerMutation();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedSos, setSelectedSos] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [priority, setPriority] = useState("HIGH");
  const [description, setDescription] = useState("");

  const handleCreateTask = async () => {
    if (!selectedSos) return;
    try {
      await assignVolunteer({
        sosRequestId: selectedSos,
        volunteerId: selectedVolunteer || null
      }).unwrap();
      setIsTaskModalOpen(false);
      setSelectedSos("");
      setSelectedVolunteer("");
      setDescription("");
      refetchRescue();
    } catch (err) {
      console.error("Failed to assign volunteer:", err);
      alert("Failed to assign volunteer. Please try again.");
    }
  };

  if (rescueLoading || floodLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (rescueError) {
    return <ErrorState onRetry={refetchRescue} />;
  }

  const tasks = rescueData || [];
  const floods = floodData || [];
  const volunteers = volunteersData || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Rescue Monitoring</h1>
          <p className="text-gray-500 mt-1">Live tracking of ongoing emergency responses and predictive risks.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => alert("To test live SOS, press the SOS button in your Expo Go Mobile App. The alert will appear here instantly.")} variant="secondary" className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50">
            <AlertTriangle size={18} /> Simulate SOS
          </Button>
          <Button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-2">
            <LifeBuoy size={18} /> New Rescue Task
          </Button>
        </div>
      </div>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create Rescue Task">
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No active SOS requests available.</p>
              <p className="text-xs text-gray-500 mt-1">Generate an SOS from the mobile application to create a rescue task.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Citizen in Need (Active SOS)</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedSos}
                  onChange={(e) => setSelectedSos(e.target.value)}
                >
                  <option value="" disabled>Select an active SOS</option>
                  {tasks.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.title} - Priority: {t.priority}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Volunteer</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedVolunteer}
                  onChange={(e) => setSelectedVolunteer(e.target.value)}
                >
                  <option value="">Auto-assign Nearest Available...</option>
                  {volunteers.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Emergency context..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button 
              disabled={tasks.length === 0 || !selectedSos || isAssigning} 
              className={tasks.length === 0 || !selectedSos || isAssigning ? "opacity-50 cursor-not-allowed" : ""}
              onClick={handleCreateTask}
            >
              {isAssigning ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rescue Tasks */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-blue-50/30">
            <ListTodo size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Active Rescue Tasks</h3>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-gray-50/20">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active tasks.</p>
            ) : (
              tasks.map((task: any) => (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{task.title}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      task.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className={`text-sm font-medium ${
                      task.status === 'In Progress' ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {task.status}
                    </span>
                    <Button variant="secondary" className="px-3 py-1 text-xs h-8">Update Status</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Flood Predictions / AI Alerts */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-indigo-50/30">
            <AlertTriangle size={20} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">AI Predictive Alerts (Flood Risk)</h3>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-gray-50/20">
            {floods.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No AI alerts.</p>
            ) : (
              floods.map((flood: any) => (
                <div key={flood.id} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${flood.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                  <div className="flex justify-between items-start mb-3 ml-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Map size={16} className="text-gray-400" /> {flood.region}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">Est. Impact: {flood.estimatedTime}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-gray-800">{flood.probability}</span>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Probability</span>
                    </div>
                  </div>
                  <div className="ml-2 mt-2 pt-3 border-t border-gray-50 flex gap-2">
                    <Button variant="secondary" className="flex-1 text-xs py-1.5 h-8 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                      Issue Evacuation Warning
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
