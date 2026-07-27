"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Home, AlertCircle } from "lucide-react";
import { useGetSheltersQuery, useCreateShelterMutation } from "@/services/evacuationApi";
import { Spinner } from "@/components/ui/Spinner";
import { useLanguage } from "@/contexts/ThemeLanguageContext";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function SheltersPage() {
  const { data: sheltersData, isLoading, isError, refetch } = useGetSheltersQuery(undefined, { pollingInterval: 5000 });
  const { t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createShelter, { isLoading: isCreating }] = useCreateShelterMutation();

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    latitude: '',
    longitude: '',
    wheelchair: false,
    blind: false,
    deaf: false,
    elderly: false,
    medical: false,
    oxygen: false,
    generator: false,
    pet: false
  });

  const handleCreate = async () => {
    try {
      await createShelter({
        shelterName: formData.name || 'Unnamed Shelter',
        shelterType: 'COMMUNITY_CENTER',
        address: 'Taiwan',
        latitude: parseFloat(formData.latitude) || 23.6978,
        longitude: parseFloat(formData.longitude) || 120.9605,
        maximumCapacity: parseInt(formData.capacity) || 100,
        currentOccupancy: 0,
        availableBeds: parseInt(formData.capacity) || 100,
        shelterStatus: 'ACTIVE',
        shelterFacility: {
          wheelchairAccessible: formData.wheelchair,
          blindFriendlyNavigation: formData.blind,
          hearingAssistance: formData.deaf,
          elderlyFriendly: formData.elderly,
          medicalFacilityAvailable: formData.medical,
          oxygenSupportAvailable: formData.oxygen,
          electricityAvailable: formData.generator,
          petFriendly: formData.pet,
          // Defaults for required DTO fields not in UI
          foodAvailable: true,
          drinkingWaterAvailable: true,
          ambulanceAvailable: false,
          doctorsAvailable: formData.medical,
          nursesAvailable: formData.medical,
          emergencyBedsAvailable: true,
          elevatorAvailable: formData.wheelchair,
          rampAvailable: formData.wheelchair,
          childFriendly: true,
          restroomsAvailable: true,
          internetAvailable: true,
          parkingAvailable: true
        }
      }).unwrap();
      setIsAddModalOpen(false);
      setFormData({ name: '', capacity: '', latitude: '', longitude: '', wheelchair: false, blind: false, deaf: false, elderly: false, medical: false, oxygen: false, generator: false, pet: false });
      refetch();
    } catch (e) {
      alert("Failed to create shelter.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex h-full items-center justify-center" aria-label={t("loading")}>
        <Spinner size="lg" />
      </main>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  const shelters = sheltersData || [];
  const totalEvacuees = shelters.reduce((acc: number, s: any) => acc + (s.currentOccupancy || 0), 0);
  const criticalNeeds = shelters.filter((s: any) => s.supplies === 'Low').length;

  return (
    <main className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500" aria-label={t("nav.shelter")}>
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight dark:text-gray-100">{t("nav.shelter")}</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">{t("shelter.description") || "Monitor capacity and resources of evacuation centers."}</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} aria-label={t("shelter.add") || "Add Shelter"}>
          {t("shelter.add") || "+ Add Shelter"}
        </Button>
      </header>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t("shelter.add") || "Add Shelter"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shelter Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Central High School" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
            <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
              <input type="number" step="0.0001" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="25.0330" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
              <input type="number" step="0.0001" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="121.5654" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">Accessibility & Facilities</label>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.wheelchair} onChange={e => setFormData({...formData, wheelchair: e.target.checked})} className="rounded text-blue-600" /> Wheelchair Accessible</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.blind} onChange={e => setFormData({...formData, blind: e.target.checked})} className="rounded text-blue-600" /> Blind Assistance</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.deaf} onChange={e => setFormData({...formData, deaf: e.target.checked})} className="rounded text-blue-600" /> Deaf Assistance</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.elderly} onChange={e => setFormData({...formData, elderly: e.target.checked})} className="rounded text-blue-600" /> Elderly Friendly</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.medical} onChange={e => setFormData({...formData, medical: e.target.checked})} className="rounded text-blue-600" /> Medical Support</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.oxygen} onChange={e => setFormData({...formData, oxygen: e.target.checked})} className="rounded text-blue-600" /> Oxygen Available</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.generator} onChange={e => setFormData({...formData, generator: e.target.checked})} className="rounded text-blue-600" /> Generator Backup</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.pet} onChange={e => setFormData({...formData, pet: e.target.checked})} className="rounded text-blue-600" /> Pet Friendly</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isCreating}>{isCreating ? "Adding..." : "Add Shelter"}</Button>
          </div>
        </div>
      </Modal>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Shelter Overview">
        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
            <Home size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("shelter.active") || "Active Shelters"}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{shelters.length}</p>
            {shelters.length === 0 && <p className="text-xs text-gray-400 font-normal mt-1">No shelters registered.</p>}
          </div>
        </article>

        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
            <Users size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("shelter.totalEvacuees") || "Total Evacuees"}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{totalEvacuees.toLocaleString()}</p>
            {totalEvacuees === 0 && <p className="text-xs text-gray-400 font-normal mt-1">Waiting for live events...</p>}
          </div>
        </article>

        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
            <AlertCircle size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("shelter.criticalNeeds") || "Critical Needs (Low Supplies)"}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{criticalNeeds}</p>
            {criticalNeeds === 0 && <p className="text-xs text-gray-400 font-normal mt-1">Waiting for live events...</p>}
          </div>
        </article>
      </section>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden mt-8" aria-label="Shelter Directory">
        <header className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("shelter.directory") || "Shelter Directory"}</h3>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="List of shelters">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("shelter.name") || "Shelter Name"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("shelter.location") || "Location"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("shelter.capacity") || "Capacity"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">Accessibility</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("shelter.status") || "Status"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300" scope="col">{t("shelter.supplies") || "Supplies"}</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right" scope="col">{t("shelter.actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {shelters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState 
                      title="No shelters registered" 
                      message="There are currently no evacuation centers set up in the system." 
                      icon={Home}
                    />
                  </td>
                </tr>
              ) : (
                shelters.map((shelter: any) => {
                  const percent = shelter.capacity > 0 ? (shelter.currentOccupancy || 0) / shelter.capacity : 0;
                  const isFull = percent > 0.9;
                  return (
                    <tr key={shelter.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-800 dark:text-gray-200">{shelter.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{shelter.location || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16" aria-label={`Occupancy ${shelter.currentOccupancy} out of ${shelter.capacity}`}>
                            {shelter.currentOccupancy || 0} / {shelter.capacity}
                          </span>
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={percent * 100} aria-valuemin={0} aria-valuemax={100}>
                            <div 
                              className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`} 
                              style={{ width: `${Math.min(percent * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {shelter.facility?.wheelchairAccessible && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800" title="Wheelchair Accessible">♿ WC</span>}
                          {shelter.facility?.medicalFacilityAvailable && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800" title="Medical Support">🏥 Med</span>}
                          {shelter.facility?.blindFriendlyNavigation && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800" title="Blind Support">👁️‍🗨️ Blind</span>}
                          {shelter.facility?.hearingAssistance && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800" title="Hearing Support">🦻 Deaf</span>}
                          {shelter.facility?.elderlyFriendly && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800" title="Elderly Support">👵 Eld</span>}
                          {shelter.facility?.petFriendly && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800" title="Pet Friendly">🐶 Pet</span>}
                          {shelter.facility?.electricityAvailable && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800" title="Generator Backup">⚡ Gen</span>}
                          {!shelter.facility && <span className="text-xs text-gray-400">Standard</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          shelter.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 
                          shelter.status === 'Nearing Capacity' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : 
                          'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                        }`}>
                          {shelter.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${shelter.supplies === 'Low' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                          {shelter.supplies}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button variant="secondary" className="px-4 py-1.5 text-xs font-medium rounded-lg" aria-label={`Manage shelter ${shelter.name}`} onClick={() => alert("Shelter management controls are currently locked to District Administrators.")}>{t("manage") || "Manage"}</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
