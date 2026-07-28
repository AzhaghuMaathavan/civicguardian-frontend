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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusUpdateTask, setStatusUpdateTask] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const API = 'https://cgapi.shyxon.com/api/v1';
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

      let currentVolunteers = volunteers || [];

      if (currentVolunteers.length === 0) {
        // Auto-register a mock volunteer for simulation purposes
        try {
          const volRes = await fetch(`${API}/volunteers`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              name: 'Mock Volunteer ' + Math.floor(Math.random() * 100),
              phoneNumber: '+886-900-' + Math.floor(100000 + Math.random() * 900000),
              latitude: 25.0450,
              longitude: 121.5750,
              medicalTraining: true,
              rescueTrainingLevel: 'INTERMEDIATE',
              vehicleAvailable: true,
              vehicleType: '4X4_RESCUE_VEHICLE',
              maxRescueCapacity: 5
            })
          });
          if (volRes.ok) {
            const volData = await volRes.json();
            if (volData?.data) {
              currentVolunteers = [volData.data];
            }
          }
        } catch (e) {
          console.error("Failed to auto-register volunteer", e);
        }
      }

      if (currentVolunteers.length === 0) {
        alert("Failed to auto-register a mock volunteer. Please register a volunteer via the Mobile App first.");
        setIsSimulating(false);
        return;
      }

      const sosRes = await fetch(`${API}/sos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          citizenId: 'MOCK-CITIZEN-002',
          citizenName: 'Jane Smith',
          contactNumber: '+19876543211',
          latitude: 25.0450,
          longitude: 121.5750,
          disasterType: 'FIRE',
          emergencyPriority: 'HIGH',
          description: 'Simulated Web Emergency'
        })
      });
      const sosData = await sosRes.json();
      const sosId = sosData?.data?.id;

      if (sosId) {
        await Promise.allSettled(
          currentVolunteers.map((vol: any) =>
            fetch(`${API}/rescue/assign`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ sosRequestId: sosId, volunteerId: vol.id })
            })
          )
        );
      }
      
      alert(`Simulated Emergency created and assigned to ${currentVolunteers.length} volunteer(s) successfully!`);
      refetchRescue();
    } catch (e: any) {
      alert("Simulation failed: " + e.message);
    }
    setIsSimulating(false);
  };

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

  const handleUpdateStatus = async () => {
    if (!statusUpdateTask || !newStatus) return;
    const assignmentId = statusUpdateTask.assignments?.[0]?.id;
    if (!assignmentId) {
      alert('No assignment found for this task. Assign a volunteer first.');
      return;
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const res = await fetch('https://cgapi.shyxon.com/api/v1/rescue/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rescueAssignmentId: assignmentId, newStatus, updatedBy: 'DASHBOARD_OPERATOR' })
      });
      if (!res.ok) throw new Error('Update failed');
      setIsStatusModalOpen(false);
      setStatusUpdateTask(null);
      setNewStatus('');
      refetchRescue();
    } catch (err) {
      alert('Failed to update status: ' + err);
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
          <Button onClick={handleSimulate} disabled={isSimulating} variant="secondary" className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50">
            <AlertTriangle size={18} /> {isSimulating ? "Simulating..." : "Simulate SOS"}
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
              tasks.map((task: any) => {
                const assignmentStatus = task.assignments?.[0]?.assignmentStatus || task.status || 'SOS_CREATED';
                const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
                  SOS_CREATED:                { label: '🆘 New SOS',       color: 'text-red-700',    bg: 'bg-red-100' },
                  VOLUNTEER_ASSIGNED:         { label: '👤 Assigned',      color: 'text-amber-700',  bg: 'bg-amber-100' },
                  VOLUNTEER_ACCEPTED:         { label: '🚗 En Route',      color: 'text-blue-700',   bg: 'bg-blue-100' },
                  VOLUNTEER_REACHED_CITIZEN:  { label: '📍 At Citizen',    color: 'text-purple-700', bg: 'bg-purple-100' },
                  CITIZEN_RESCUED:            { label: '🚑 Transporting',  color: 'text-cyan-700',   bg: 'bg-cyan-100' },
                  REACHED_SHELTER_HOSPITAL:   { label: '🏥 At Facility',   color: 'text-green-700',  bg: 'bg-green-100' },
                  COMPLETED:                  { label: '✅ Complete',      color: 'text-emerald-700',bg: 'bg-emerald-100' },
                  CANCELLED:                  { label: '❌ Cancelled',     color: 'text-gray-600',   bg: 'bg-gray-100' },
                };
                const sc = statusConfig[assignmentStatus] || { label: assignmentStatus, color: 'text-gray-600', bg: 'bg-gray-100' };
                return (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <LifeBuoy size={16} className="text-blue-500" />
                        {task.citizenName || 'Unknown Citizen'}
                      </h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        task.priority?.toUpperCase() === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        task.priority?.toUpperCase() === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {task.priority || 'UNKNOWN'} Priority
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                      <p><span className="font-medium text-gray-700">Issue:</span> {task.title}</p>
                      {task.medicalConditions && (
                        <p><span className="font-medium text-gray-700">Medical:</span> {task.medicalConditions}</p>
                      )}
                      <p className="flex items-center gap-1">
                        <Map size={14} className="text-gray-400" />
                        {task.latitude?.toFixed(4)}, {task.longitude?.toFixed(4)}
                      </p>
                    </div>

                    {task.assignments && task.assignments.length > 0 && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded-md">
                        <p className="text-xs font-semibold text-green-700">
                          Volunteer: {task.assignments[0].volunteerName || task.assignments[0].volunteerId}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                      <Button
                        variant="secondary"
                        className="px-3 py-1 text-xs h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          setStatusUpdateTask(task);
                          setNewStatus(assignmentStatus);
                          setIsStatusModalOpen(true);
                        }}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                );
              })
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

      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title={`Update Mission Status — ${statusUpdateTask?.citizenName}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select the new mission status:</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'VOLUNTEER_ACCEPTED',       label: '🚗 En Route to Citizen' },
              { value: 'VOLUNTEER_REACHED_CITIZEN', label: '📍 Arrived at Citizen' },
              { value: 'CITIZEN_RESCUED',          label: '🚑 Transporting to Facility' },
              { value: 'REACHED_SHELTER_HOSPITAL', label: '🏥 Reached Facility' },
              { value: 'COMPLETED',               label: '✅ Mission Complete' },
              { value: 'CANCELLED',              label: '❌ Cancel Mission' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setNewStatus(opt.value)}
                className={`text-left px-4 py-3 rounded-lg border-2 transition-colors font-medium ${
                  newStatus === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={!newStatus}>Update Status</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
