export const mockCitizens = [
  { id: "CIT-001", name: "Wang Wei-chen", phone: "0912-345-678", role: "CITIZEN", riskLevel: "LOW", location: { lat: 25.0330, lng: 121.5654 }, address: "Xinyi District, Taipei" },
  { id: "CIT-002", name: "Lin Mei-hui", phone: "0987-654-321", role: "CITIZEN", riskLevel: "HIGH", notes: "Elderly, mobility issues", location: { lat: 25.0320, lng: 121.5644 }, address: "Xinyi District, Taipei" },
  { id: "CIT-003", name: "Chen Yi-jun", phone: "0933-222-111", role: "VOLUNTEER", riskLevel: "LOW", location: { lat: 25.0400, lng: 121.5400 }, address: "Da'an District, Taipei" },
];

export const mockShelters = [
  { id: "SHEL-01", name: "Taipei Civic Center", capacity: 500, currentOccupancy: 340, resources: "Adequate", location: { lat: 25.0350, lng: 121.5600 } },
  { id: "SHEL-02", name: "Zhongzheng High School", capacity: 800, currentOccupancy: 790, resources: "Low on Water", location: { lat: 25.0420, lng: 121.5200 } },
  { id: "SHEL-03", name: "Da'an Sports Park", capacity: 1200, currentOccupancy: 400, resources: "Adequate", location: { lat: 25.0250, lng: 121.5350 } },
];

export const mockAlerts = [
  { id: "ALT-01", type: "CRITICAL", title: "Typhoon Gaemi Approaching", message: "Category 4 Typhoon expected to make landfall in 12 hours. Evacuate low-lying areas.", timestamp: "2026-07-16T08:00:00Z" },
  { id: "ALT-02", type: "WARNING", title: "Flash Flood Warning", message: "Water levels rising in Keelung River. Avoid underground parking.", timestamp: "2026-07-16T09:30:00Z" },
];

export const mockStats = {
  totalCitizens: 125430,
  evacuated: 1530,
  highRiskTotal: 4200,
  activeVolunteers: 342,
  ongoingRescues: 5,
};
