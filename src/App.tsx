
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./components/auth/LoginForm";
import NotFound from "./pages/NotFound";
import StudentActivities from './pages/StudentActivities';
import Resources from './pages/Resources';
import Games from './pages/Games';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import MyClasses from './pages/MyClasses';
import { Activity } from "lucide-react";
import CreateActivity from "./pages/CreateActivityPage";
import ActivitiesPaginated from "./pages/ActiviesPagination";
import StudentAssignmentDetails from "./pages/StudentAssignmentDetails";
import UpcomingTask from "./pages/UpcomingTask";
import AdminDashboard from "./pages/AdminDashboard";
import Rewards from "./pages/Rewards";
import About from "./pages/About";
import ClassGroupSubjectStudentActivity from "./pages/ClassGroupSubjectStudentActivity";
import TeacherStudentAssignment from "./pages/TeacherStudentAssignment";
import ClassGroupSubjectActivity from "./pages/ClassGroupSubjectActivity";
import TeacherAssignmentDetails from "./pages/TeacherAssignmentDetails";


const queryClient = new QueryClient();

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <LoginForm />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Navigate to="/" />} />
          <Route path="/StudentDashboard" element={<StudentDashboard/>} />
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
          <Route path="/studentactivities" element={<StudentActivities />} />
          {/* <Route path="/activity" element={<Activity />} /> */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/games" element={<Games />} />
          <Route path="/activities/create" element={<CreateActivity />} /> 
          <Route path="/activitiespagination" element={<ActivitiesPaginated/>} /> 
          <Route path="/classgroupsubject" element={<ClassGroupSubjectActivity />} />
          <Route path="/myclasses" element={<MyClasses />} />
          <Route path="/about" element={<About />} />
          <Route path="/upcomingtask" element={<UpcomingTask />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/rewards" element={<Rewards />} />
          {/* <Route path="/teacherassignmentdetails/:activityId" element={<TeacherAssignmentDetails />} /> */}
          <Route path="/teacherstudentassignment/:activityId" element={<TeacherStudentAssignment/>} />
          <Route path="/teacherassignmentdetails/:activityId/:studentId" element={<TeacherAssignmentDetails />} />
          <Route path="/classgroupsubjectsactivitytudentview/:activityId" element={<ClassGroupSubjectStudentActivity/>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/studentassignmentdetails/:activityId" element={<StudentAssignmentDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

