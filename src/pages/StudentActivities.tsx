import React, { useEffect, useState } from "react";
import Header from '@/components/layout/Header';
import { useStudentActivities } from "@/hooks/useStudentActivities";

interface Activity {
  activityId: string;
  title: string;
  description: string;
  dueDate: string;
  pdfUrl: string;
  isSubmitted: boolean;
  submissionUrl?: string;
  submissionDate?: string;
  feedback?: string;
  grade?: number;
  studentcomment?: string;
}

const StudentActivities: React.FC = () => {
 // const [activities, setActivities] = useState<Activity[]>([]);
 // const [username, setUsername] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [studentcomment, setStudentComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);

  const { activities, username, getUpcomingActivities, refreshActivities } = useStudentActivities();

   const handleActivitySubmit = async () => {
    if (!file || !selectedActivity) return alert("Please upload a file");
  
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const fileRes = await fetch("https://localhost:44361/api/upload", {
        method: "POST",
        body: formData
      });
  
      const { downloadUrl } = await fileRes.json();
      const fileUrl = downloadUrl;
  
      const response = await fetch(`https://localhost:44361/api/Student/get-student-id/${username}`);
      const data = await response.json();
      const studentId = data.studentId;  
  
      const payload = {
        activityId: selectedActivity.activityId,
        studentId,
        pdfUrl: fileUrl,
        studentComment: studentcomment
      };
  
      const endpoint = isResubmitting
        ? "https://localhost:44361/api/Submissions/resubmit"
        : "https://localhost:44361/api/Submissions/submit";
  
      await fetch(endpoint, {
        method: isResubmitting ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
  
      alert(isResubmitting ? "Resubmitted successfully!" : "Submitted successfully!");
  
      // Reset modal and refresh data
      setSelectedActivity(null);
      setIsSubmitting(false);
      setFile(null);
      setStudentComment("");

      await refreshActivities();

    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FFDAB9] via-[#98FB98] to-[#00FFFF]">
      <Header isLoggedIn={true} userType="student" userName={username} />

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <h1 className="text-2xl font-bold text-yellow-700 mb-4">📚 My Activities</h1>

          <div className="grid gap-6">
            {activities.length === 0 ? (
              <p className="text-center text-gray-600">No activities available.</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.activityId} className="bg-white p-4 rounded-xl shadow border border-yellow-300">
                  <h2 className="text-xl font-semibold text-aqua-800">{activity.title}</h2>
                  <p className="text-sm text-gray-600">{activity.description}</p>

                  <div className="mt-2 text-sm">
                    📅 <strong>Due:</strong> {new Date(activity.dueDate).toLocaleDateString()}
                    <br />
                    📄 <a href={activity.pdfUrl} target="_blank" className="text-blue-600 underline">Download Instructions</a>
                  </div>

                  <div className="mt-2">
                  {activity.isSubmitted ? (
                        <div className="text-green-700 text-sm">
                          ✅ Submitted on {new Date(activity.submissionDate || "").toLocaleDateString()}
                          {activity.grade !== null && <p>📊 Grade: <strong>{activity.grade}</strong></p>}
                          {activity.studentcomment && <p>📝 Comment: <em>{activity.studentcomment}</em></p>}

                          {/* ✅ Show resubmit if still before due date */}
                          {new Date(activity.dueDate) >= new Date() && (
                            <button
                              className="mt-2 text-blue-600 underline"
                              onClick={() => {
                                setSelectedActivity(activity);
                                setIsResubmitting(true);
                              }}
                            >
                              🔁 Resubmit Activity
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          <p className="text-red-600 text-sm">🚨 Not submitted yet</p>
                          <button
                            className="mt-2 text-blue-600 underline"
                            onClick={() => {
                              setSelectedActivity(activity);
                              setIsResubmitting(false);
                            }}
                          >
                            ✏️ Submit This Activity
                          </button>
                        </>
                      )}

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Upcoming Activities */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-yellow-700 mb-2">⏳ Upcoming Activities</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {getUpcomingActivities().map((a) => (
                <li key={a.activityId}>{a.title} – Due {new Date(a.dueDate).toLocaleDateString()}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Modal for Activity Submission */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl relative">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-3 right-4 text-lg font-bold text-red-600"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-aqua-700 mb-2">{selectedActivity.title}</h2>
            <p className="text-sm text-gray-700">{selectedActivity.description}</p>
            <p className="text-sm mt-2">
              📅 Due: <strong>{new Date(selectedActivity.dueDate).toLocaleDateString()}</strong>
            </p>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1">Upload Your Work</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-semibold mb-1">Student Comment</label>
              <textarea
                className="w-full border rounded p-2 bg-gray-50"
                placeholder="Optional message for your teacher"
                value={studentcomment}
                onChange={(e) => setStudentComment(e.target.value)}
              />
            </div>

           <button
            onClick={handleActivitySubmit}
            className={`mt-4 px-6 py-2 rounded-2xl shadow-md transition duration-300 ease-in-out ${
              isSubmitting
                ? "bg-yellow-300 text-gray-600 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 text-black"
            }`}
  disabled={isSubmitting}
>
  {isSubmitting
    ? isResubmitting
      ? "Resubmitting..."
      : "Submitting..."
    : isResubmitting
    ? "Resubmit Activity"
    : "Submit Activity"}
</button>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default StudentActivities;
