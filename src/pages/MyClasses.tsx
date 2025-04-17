import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import TeacherSidebar from '../components/layout/TeacherSidebar';

interface Student {
  fullName: string;
}

interface Activity {
  title: string;
  description: string;
}

interface ClassGroup {
  classGroupId: string;
  className: string;
  adminId: string;
  students: Student[];
  activities: Activity[];
  classGroupSubjects: any[];
}

const MyClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('https://localhost:44361/api/classgroups');
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Failed to fetch class groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="flex h-screen">
      <TeacherSidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">My Classes</h1>

        {loading ? (
          <p>Loading classes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {classes.map((cls) => (
              <Card
                key={cls.classGroupId}
                onClick={() => setSelectedClass(cls)}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold">{cls.className}</h2>
                  <p>{cls.students.length} students</p>
                  <p>{cls.activities.length} activities</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedClass && (
          <div>
            <h2 className="text-xl font-bold mb-4">{selectedClass.className} Details</h2>

            {/* Students */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Students</h3>
              {selectedClass.students.length > 0 ? (
                <ul className="space-y-2">
                  {selectedClass.students.map((student, index) => (
                    <li key={index} className="p-2 bg-white shadow rounded">{student.fullName}</li>
                  ))}
                </ul>
              ) : (
                <p>No students in this class.</p>
              )}
            </section>

            {/* Activities */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Activities</h3>
              {selectedClass.activities.length > 0 ? (
                <div className="space-y-4">
                  {selectedClass.activities.map((activity, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h4 className="font-bold">{activity.title}</h4>
                        <p>{activity.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No activities assigned yet.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyClasses;
