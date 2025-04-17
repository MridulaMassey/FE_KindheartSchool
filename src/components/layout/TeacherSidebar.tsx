// Teacher Sidebar

import React from 'react';
//import { Button } from '../components/ui/button';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'


const TeacherSidebar: React.FC = () => {
    const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r p-4 h-screen">
    <div> 
      <h2 className="text-xl font-bold mb-6">Teacher</h2>
      <nav className="flex flex-col space-y-4">
        <Button variant="ghost" className="justify-start" onClick={() => navigate('/TeacherDashboard')}> 🏠 Home</Button>
        <Button variant="ghost" className="justify-start" onClick={() => navigate('/myclasses')}> 📚 My Classes</Button>
        <Button variant="ghost" className="justify-start" onClick={() => navigate('/activitiespagination')}> 📥 Submissions</Button>
        <Button variant="ghost" className="justify-start" onClick={() => navigate('/activities/create')}> ➕ Create Activity</Button>
        <Button variant="ghost" className="justify-start">🗓 Calendar</Button>
      </nav>
    </div>
    
    {/* Logout Button */}
    <div>

    </div>

    <div>
        <Button variant="destructive" className="w-full" onClick={() => (window.location.href = "/")}>
          🔒 Logout
        </Button>
    </div>

    </aside>
  );
};

export default TeacherSidebar;