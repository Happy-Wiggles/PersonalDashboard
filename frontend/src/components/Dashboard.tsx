import { useEffect } from "react";

interface DashboardProps {
  setTitle: (title: string) => void;
}

const Dashboard = ({ setTitle }: DashboardProps) => {
  const userName = "Justin";
  useEffect(() => setTitle(`${userName}'s Dashboard`), [setTitle]);

  // const getDataExample = async () => {
  //   const token = localStorage.getItem("token");
  //   const response = await fetch("http://localhost:3000/users", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // };

  return (
    <div className="bg-gray-700 p-4 m-2 grid rounded">
      <div>
        <p>Das wird das Dashboard!</p>
      </div>
      <div>
        <p>Hier könnte Ihre Werbug stehen!</p>
      </div>
      <div>
        <p>Wow, so modern!</p>
      </div>
    </div>
  );
};

export default Dashboard;
