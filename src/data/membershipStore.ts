export type MembershipTier =
  "Standard Member" | "Youth Ambassador" | "Volunteer Corps" | "Executive Supporter" | "Patron";

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  state: string;
  lga: string;
  gender?: "Male" | "Female" | "Prefer not to say" | "";
  occupation?: string;
  tier: MembershipTier;
  joinedDate: string;
  status: "Active" | "Verified" | "Honorary";
  avatarSeed?: string;
  photoUrl?: string;
}

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "ARF-JG-2026-0001",
    fullName: "Hon. Usman Aminu Usman",
    email: "uameen@icloud.com",
    phone: "+234 906 666 6633",
    state: "Jigawa",
    lga: "Gumel",
    gender: "Male",
    occupation: "Founder & Civic Leader",
    tier: "Patron",
    joinedDate: "2023-01-15",
    status: "Honorary",
  },
  {
    id: "ARF-JG-2026-0014",
    fullName: "Ibrahim Sani Garba",
    email: "ibrahim.garba@arf.org.ng",
    phone: "+234 803 214 7890",
    state: "Jigawa",
    lga: "Dutse",
    gender: "Male",
    occupation: "Special Needs Educator",
    tier: "Volunteer Corps",
    joinedDate: "2024-03-10",
    status: "Verified",
  },
  {
    id: "ARF-JG-2026-0028",
    fullName: "Fatima Zahra Mohammed",
    email: "fatima.z@gmail.com",
    phone: "+234 812 555 4321",
    state: "Jigawa",
    lga: "Gumel",
    gender: "Female",
    occupation: "Youth Mobilizer",
    tier: "Youth Ambassador",
    joinedDate: "2024-05-18",
    status: "Active",
  },
  {
    id: "ARF-KN-2026-0042",
    fullName: "Aminu Abubakar Dala",
    email: "aminu.dala@gmail.com",
    phone: "+234 802 334 9912",
    state: "Kano",
    lga: "Dala",
    gender: "Male",
    occupation: "Grassroots Football Coach",
    tier: "Standard Member",
    joinedDate: "2024-06-22",
    status: "Active",
  },
  {
    id: "ARF-KN-2026-0055",
    fullName: "Hauwa Mustapha Bello",
    email: "hauwa.m@yahoo.com",
    phone: "+234 814 678 1234",
    state: "Kano",
    lga: "Fagge",
    gender: "Female",
    occupation: "Healthcare Worker",
    tier: "Volunteer Corps",
    joinedDate: "2024-08-05",
    status: "Verified",
  },
  {
    id: "ARF-KD-2026-0067",
    fullName: "Salisu Umar Zaria",
    email: "salisu.umar@outlook.com",
    phone: "+234 809 112 3344",
    state: "Kaduna",
    lga: "Zaria",
    gender: "Male",
    occupation: "University Lecturer",
    tier: "Executive Supporter",
    joinedDate: "2024-09-14",
    status: "Verified",
  },
  {
    id: "ARF-FC-2026-0081",
    fullName: "Dr. Aisha Kabir Ahmed",
    email: "aisha.kabir@consultant.ng",
    phone: "+234 805 778 9900",
    state: "Federal Capital Territory",
    lga: "Abuja Municipal (AMAC)",
    gender: "Female",
    occupation: "Policy Consultant",
    tier: "Patron",
    joinedDate: "2024-11-02",
    status: "Honorary",
  },
  {
    id: "ARF-JG-2026-0099",
    fullName: "Balarabe Kazaure",
    email: "balarabe.k@gmail.com",
    phone: "+234 807 443 2190",
    state: "Jigawa",
    lga: "Kazaure",
    gender: "Male",
    occupation: "Agronomist",
    tier: "Standard Member",
    joinedDate: "2025-01-20",
    status: "Active",
  },
  {
    id: "ARF-LA-2026-0112",
    fullName: "Chidiebere Victor Okafor",
    email: "chidi.okafor@techhub.ng",
    phone: "+234 818 901 2345",
    state: "Lagos",
    lga: "Ikeja",
    gender: "Male",
    occupation: "Software Engineer",
    tier: "Executive Supporter",
    joinedDate: "2025-02-17",
    status: "Active",
  },
  {
    id: "ARF-JG-2026-0130",
    fullName: "Maryam Abdullahi Hadejia",
    email: "maryam.hadejia@gmail.com",
    phone: "+234 803 765 4321",
    state: "Jigawa",
    lga: "Hadejia",
    gender: "Female",
    occupation: "Community Midwife",
    tier: "Volunteer Corps",
    joinedDate: "2025-04-09",
    status: "Verified",
  },
  {
    id: "ARF-BA-2026-0145",
    fullName: "Muhammad Tukur Katagum",
    email: "m.tukur@bauchi.gov.ng",
    phone: "+234 802 889 0011",
    state: "Bauchi",
    lga: "Katagum",
    gender: "Male",
    occupation: "Civil Servant",
    tier: "Standard Member",
    joinedDate: "2025-06-11",
    status: "Active",
  },
  {
    id: "ARF-SO-2026-0160",
    fullName: "Zainab Aliyu Sokoto",
    email: "zainab.aliyu@gmail.com",
    phone: "+234 813 456 7890",
    state: "Sokoto",
    lga: "Sokoto North",
    gender: "Female",
    occupation: "Social Worker",
    tier: "Youth Ambassador",
    joinedDate: "2025-08-25",
    status: "Active",
  },
];

const STORAGE_KEY = "arf_foundation_members_v1";

export function loadMembersFromStorage(): Member[] {
  if (typeof window === "undefined") return INITIAL_MEMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEMBERS;
  } catch {
    return INITIAL_MEMBERS;
  }
}

export function saveMemberToStorage(
  newMember: Omit<Member, "id" | "joinedDate" | "status">,
): Member {
  const existing = loadMembersFromStorage();

  // Format unique membership ID: ARF-[STATE_CODE]-YYYY-RANDOM
  const stateCode = newMember.state.substring(0, 2).toUpperCase();
  const year = new Date().getFullYear();
  const randNum = String(Math.floor(1000 + Math.random() * 9000));
  const id = `ARF-${stateCode}-${year}-${randNum}`;

  const member: Member = {
    ...newMember,
    id,
    joinedDate: new Date().toISOString().split("T")[0],
    status: "Active",
  };

  const updated = [member, ...existing];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("arf_members_updated"));
    } catch {
      // Ignore quota errors
    }
  }

  return member;
}

export function exportMembersToCsv(members: Member[]): void {
  const headers = [
    "Membership ID",
    "Full Name",
    "Email Address",
    "Phone Number",
    "State of Residence",
    "Local Government Area (LGA)",
    "Gender",
    "Occupation",
    "Membership Tier",
    "Registration Date",
    "Status",
  ];

  const rows = members.map((m) => [
    `"${m.id}"`,
    `"${m.fullName.replace(/"/g, '""')}"`,
    `"${m.email.replace(/"/g, '""')}"`,
    `"${(m.phone || "").replace(/"/g, '""')}"`,
    `"${m.state.replace(/"/g, '""')}"`,
    `"${m.lga.replace(/"/g, '""')}"`,
    `"${(m.gender || "Not specified").replace(/"/g, '""')}"`,
    `"${(m.occupation || "Not specified").replace(/"/g, '""')}"`,
    `"${m.tier.replace(/"/g, '""')}"`,
    `"${m.joinedDate}"`,
    `"${m.status}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ARF_Members_Export_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
