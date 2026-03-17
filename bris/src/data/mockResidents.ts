import { Resident } from '../types';

export const mockResidents: Resident[] = [
  {
    id: "1",
    name: "Juan Dela Cruz",
    birthday: "1985-04-12",
    address: "123 Mabuhay St, Barangay San Antonio",
    telephone: "0917-123-4567",
    isVoter: true,
    occupation: "Carpenter",
    transactions: [
      { id: "t1", type: "Brgy Clearance", date: "2023-10-15", purpose: "Employment" },
      { id: "t2", type: "Indigency", date: "2023-11-02", purpose: "Medical Assistance" }
    ],
    imageUrl: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: "2",
    name: "Maria Santos",
    birthday: "1990-08-25",
    address: "456 Rizal Ave, Barangay San Antonio",
    telephone: "0918-987-6543",
    isVoter: true,
    occupation: "Teacher",
    transactions: [
      { id: "t3", type: "Special Cert", date: "2024-01-10", purpose: "Bank Requirement" },
      { id: "t4", type: "Brgy Clearance", date: "2024-02-14", purpose: "Loan Application" }
    ],
    imageUrl: "https://i.pravatar.cc/150?u=2"
  },
  {
    id: "3",
    name: "Pedro Penduko",
    birthday: "1978-12-05",
    address: "789 Bonifacio St, Barangay San Antonio",
    telephone: "0919-456-7890",
    isVoter: false,
    occupation: "Unemployed",
    transactions: [
      { id: "t5", type: "Indigency", date: "2024-03-01", purpose: "Scholarship for Child" }
    ],
    imageUrl: "https://i.pravatar.cc/150?u=3"
  },
  {
    id: "4",
    name: "Ana Macaraeg",
    birthday: "1995-11-30",
    address: "321 Quezon Blvd, Barangay San Antonio",
    telephone: "0920-321-0987",
    isVoter: true,
    occupation: "Nurse",
    transactions: [
      { id: "t6", type: "Brgy Clearance", date: "2023-09-20", purpose: "Pre-employment" },
      { id: "t7", type: "Special Cert", date: "2023-12-05", purpose: "Travel" }
    ],
    imageUrl: "https://i.pravatar.cc/150?u=4"
  },
  {
    id: "5",
    name: "Jose Rizal",
    birthday: "1982-06-19",
    address: "001 Bayani Rd, Barangay San Antonio",
    telephone: "0922-111-2222",
    isVoter: true,
    occupation: "Writer",
    transactions: [
      { id: "t8", type: "Brgy Clearance", date: "2024-01-05", purpose: "Business Permit" },
      { id: "t9", type: "Indigency", date: "2024-01-15", purpose: "Social Pension" },
      { id: "t10", type: "Special Cert", date: "2024-02-28", purpose: "Late Registration" }
    ],
    imageUrl: "https://i.pravatar.cc/150?u=5"
  }
];
