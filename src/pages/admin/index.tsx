// pages/dashboard.js
import Sidebar from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Your dashboard content goes here */}
        <h1>Welcome to your Dashboard!</h1>
      </div>
    </div>
  );
};

export default Index;
