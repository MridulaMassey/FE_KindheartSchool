import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import TeacherSidebar from '../components/layout/TeacherSidebar';
import { useNavigate } from 'react-router-dom';

interface ClassGroup {
  classGroupId: string;
  className: string;
  adminId: string;
  students: any[];
  activities: any[];
  classGroupSubjects: any[];
}

const TeacherDashboard: React.FC = () => {
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [activitiesCount, setActivitiesCount] = useState<number>(0);
  const [submissionsCount, setSubmissionsCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes
        const classesResponse = await fetch('https://localhost:44361/api/classgroups');
        const classesData = await classesResponse.json();
        setClasses(classesData);

        // Fetch activities count
        const activitiesResponse = await fetch('https://localhost:44361/api/activities/activitieslist');
        const activitiesData = await activitiesResponse.json();
        setActivitiesCount(activitiesData.length);

        // Fetch submissions count
        const submissionsResponse = await fetch('https://localhost:44361/api/Submissions');
        const submissionsData = await submissionsResponse.json();
        setSubmissionsCount(submissionsData.length);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleActivitiesClick = () => {
    navigate('/activitiespagination'); // Adjust this route based on your activities page route
  };

  return (
    <div className="flex h-screen">
      <TeacherSidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
          <div className="flex items-center gap-4">
            <Input placeholder="Search..." className="w-64" />
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">AD</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent 
              className="p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleActivitiesClick}
            >
              <h2 className="text-2xl font-bold">{activitiesCount}</h2>
              <p className="text-blue-600 hover:underline">Activities Created</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-2xl font-bold">{submissionsCount}</h2>
              <p>Pending Submissions</p>
            </CardContent>
          </Card>
          <Card><CardContent className="p-4 text-center"><h2 className="text-2xl font-bold">30</h2><p>Students</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><h2 className="text-2xl font-bold">4</h2><p>Upcoming Dates</p></CardContent></Card>
        </div>

        <div className="flex gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/activities/create')}>➕ Create Activity</Button>
          <Button variant="outline">📥 View Submissions</Button>
          <Button variant="outline">🗓 Add to Calendar</Button>
          <Button variant="outline">👨‍🏫 Manage Students</Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">My Classes</h2>
            {classes.length === 0 ? (
              <p>No classes available</p>
            ) : (
              classes.map((cls) => (
                <Card key={cls.classGroupId}>
                  <CardContent className="p-4">
                    <p><strong>{cls.className}</strong><br />
                      {cls.students.length} students · {cls.activities.length} activities
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>


          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Recent Submissions</h2>
              <Card><CardContent className="p-4 flex justify-between items-center"><div><p><strong>Emma Johnson</strong><br />Book Report</p></div><Button variant="outline">Feedback</Button></CardContent></Card>
              <Card><CardContent className="p-4 flex justify-between items-center"><div><p><strong>Michael Smith</strong><br />Geometry Problems</p></div><Button variant="outline">Feedback</Button></CardContent></Card>
              <Card><CardContent className="p-4 flex justify-between items-center"><div><p><strong>Sophia Davis</strong><br />Map Project</p></div><Button variant="outline">Feedback</Button></CardContent></Card>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Upcoming Dates</h2>
              <Card><CardContent className="p-4 flex justify-between items-center"><div><p><strong>APR 25</strong><br />Essay on Habitats</p></div><div><p>Science 303<br />Math 101</p></div></CardContent></Card>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Class Overview - Math 101</h2>
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade Average</TableHead>
                    <TableHead>Missed Activities</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Emma Johnson</TableCell>
                    <TableCell>92</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell><Button variant="outline">View</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Michael Smith</TableCell>
                    <TableCell>85</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell><Button variant="outline">View</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sophia Davis</TableCell>
                    <TableCell>78</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell><Button variant="outline">View</Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;