type status = "Active" | "On Leave" | "Inactive";

export default function DashBoardPage() {
  const data: {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
    location: string;
    status: status;
    joined: string;
  }[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "Senior Frontend Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      status: "Active",
      joined: "Jan 12, 2021",
    },
    {
      id: 2,
      name: "Bob Martinez",
      email: "bob.martinez@example.com",
      role: "Product Manager",
      department: "Product",
      location: "New York, NY",
      status: "Active",
      joined: "Mar 3, 2020",
    },
    {
      id: 3,
      name: "Carol Smith",
      email: "carol.smith@example.com",
      role: "UX Designer",
      department: "Design",
      location: "Austin, TX",
      status: "On Leave",
      joined: "Jul 19, 2022",
    },
    {
      id: 4,
      name: "David Lee",
      email: "david.lee@example.com",
      role: "Backend Engineer",
      department: "Engineering",
      location: "Seattle, WA",
      status: "Active",
      joined: "Nov 8, 2019",
    },
    {
      id: 5,
      name: "Eva Chen",
      email: "eva.chen@example.com",
      role: "Data Analyst",
      department: "Analytics",
      location: "Chicago, IL",
      status: "Inactive",
      joined: "Feb 25, 2023",
    },
  ];

  const statusStyles: Record<status, string> = {
    Active: "bg-green-100 text-green-700",
    "On Leave": "bg-yellow-100 text-yellow-700",
    Inactive: "bg-red-100 text-red-700",
  };
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full bg-white text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            {[
              "#",
              "Name",
              "Email",
              "Role",
              "Department",
              "Location",
              "Status",
              "Joined",
            ].map((heading) => (
              <th
                key={heading}
                className="px-6 py-4 font-semibold whitespace-nowrap"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 text-gray-400 font-mono">{row.id}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {row.name}
              </td>
              <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                {row.email}
              </td>
              <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                {row.role}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {row.department}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {row.location}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    statusStyles[row.status]
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                {row.joined}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
