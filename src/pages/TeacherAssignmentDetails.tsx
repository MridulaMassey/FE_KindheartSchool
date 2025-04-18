import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  Award,
  FileText,
  Download,
  MessageSquare,
  Save,
  Star,
  Check,
  FileCheck,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

interface ActivityDetails {
  activityId: string;
  activityName: string;
  title: string;
  description: string;
  pdfUrl?: string;
  studentPdfUrl?: string;
  dueDate: string;
  classGroupName?: string;
  classLevel?: string;
  subjectName?: string;
  teacherUserFirstName?: string;
  teacherUserLastName?: string;
  studentUserFirstName?: string;
  studentUserLastName?: string;
  studentId?: string;
  weightagePercent: number;
  feedback?: string;
  grade?: number;
  hasFeedback: boolean;
  submissionDate?: string;
  status?: string;
  maxGrade?: number;
}

const TeacherAssignmentDetails = () => {
  const navigate = useNavigate();
  const { activityId = "7361adc5-3681-4e78-9434-000f0edc3b8e" } = useParams<{ activityId: string }>();
  const [activity, setActivity] = useState<ActivityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [maxGrade, setMaxGrade] = useState(100);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^(\d*\.?\d*)$/.test(value) || value === "") {
      setGrade(value);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() && !grade) {
      toast.error("Please provide feedback or grade before submitting");
      return;
    }

    if (grade && (parseFloat(grade) < 0 || parseFloat(grade) > maxGrade)) {
      toast.error(`Grade must be between 0 and ${maxGrade}`);
      return;
    }

    setSubmitting(true);
    toast.success("Submitting feedback...");
// https://localhost:44361/api/activities/${currentActivityId}
    try {
      const response = await fetch(`https://localhost:44361/api/activities/teachersubmission`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId: activityId,
          feedback: feedback.trim(),
          grade: grade ? parseFloat(grade) : null,
          
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      console.log("Feedback submitted successfully");
      toast.success("Feedback submitted successfully");
      
      // Update local activity state
      if (activity) {
        setActivity({
          ...activity,
          feedback: feedback.trim(),
          grade: grade ? parseFloat(grade) : undefined,
          hasFeedback: true,
        });
      }
      navigate("/classgroupsubject");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback", {
        description: "Please try again or contact support.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchActivityDetails = async () => {
      setLoading(true);
      try {
        console.log("Fetching activity details for ID:", activityId);
        
        const response = await fetch(`https://localhost:44361/api/activities/activitychanges/${activityId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch activity details");
        }

        const data = await response.json();
        setActivity({
          ...data,
          hasFeedback: !!data.feedback,
        });
        
        // Initialize form state with existing data
        if (data.feedback) {
          setFeedback(data.feedback);
        }
        if (data.grade !== undefined && data.grade !== null) {
          setGrade(data.grade.toString());
        }
        if (data.maxGrade) {
          setMaxGrade(data.maxGrade);
        }
      } catch (error) {
        console.error("Error fetching activity details:", error);
        toast.error("Failed to load activity details", {
          description: "Please try again later or contact support.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [activityId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-4 w-40" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-52" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-2">Activity Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The activity you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isGraded = activity.grade !== undefined && activity.grade !== null;
  const studentName = activity.studentUserFirstName && activity.studentUserLastName 
    ? `${activity.studentUserFirstName} ${activity.studentUserLastName}`
    : "Student";
  const hasStudentSubmission = !!activity.studentPdfUrl;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-6 group hover:bg-accent transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
          Back
        </Button>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="text-3xl font-medium tracking-tight">{activity.activityName}</h1>
              <div className="flex flex-wrap gap-2">
                {activity.subjectName && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {activity.subjectName}
                  </Badge>
                )}
                {isGraded ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Graded
                  </Badge>
                ) : activity.studentPdfUrl ? (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                    <FileCheck className="h-3.5 w-3.5 mr-1" />
                    Submitted
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center text-muted-foreground gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Class: {activity.classGroupName || activity.classLevel || "Not specified"}</span>
            </div>
          </motion.div>

          {/* Student Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6 justify-between">
                  <div>
                    <h3 className="font-medium text-sm mb-1">Student Name</h3>
                    <p className="text-muted-foreground">{studentName}</p>
                  </div>
                  {activity.submissionDate && (
                    <div>
                      <h3 className="font-medium text-sm mb-1">Submission Date</h3>
                      <p className="text-muted-foreground">
                        {format(new Date(activity.submissionDate), "MMMM d, yyyy")}
                      </p>
                    </div>
                  )}
                  {activity.status && (
                    <div>
                      <h3 className="font-medium text-sm mb-1">Status</h3>
                      <p className="text-muted-foreground">{activity.status}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">Activity Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Due Date</p>
                        <p className="text-muted-foreground">
                          {activity.dueDate
                            ? format(new Date(activity.dueDate), "MMMM d, yyyy")
                            : "No due date specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Weightage</p>
                        <p className="text-muted-foreground">{activity.weightagePercent}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Activity Title</h3>
                  <p className="font-medium text-lg text-primary mb-4">{activity.title}</p>

                  <h3 className="text-lg font-medium mb-2">Activity Description</h3>
                  <p className="text-muted-foreground">
                    {activity.description || "No description provided for this activity."}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-3">Activity Files</h3>
                  <div className="space-y-4">
                    {activity.pdfUrl && (
                      <div className="bg-muted/20 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Assignment Instructions</p>
                              <p className="text-muted-foreground text-sm">Original activity instructions</p>
                            </div>
                          </div>
                          <div className="w-full sm:w-auto">
                            <a href={activity.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="secondary" className="w-full sm:w-auto">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {activity.studentPdfUrl ? (
                      <div className="bg-muted/20 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Student Submission</p>
                              <p className="text-muted-foreground text-sm">View the student's work</p>
                            </div>
                          </div>
                          <div className="w-full sm:w-auto">
                            <a href={activity.studentPdfUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="secondary" className="w-full sm:w-auto">
                                <Download className="mr-2 h-4 w-4" />
                                View Submission
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
                        <p className="font-medium">No submission yet</p>
                        <p className="text-sm">The student hasn't submitted their work for this activity.</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Grading and Feedback Section */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    Feedback & Grading
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                      <div className="sm:col-span-3">
                        <Label htmlFor="feedback" className="mb-2 block">
                          Feedback for Student
                        </Label>
                        <Textarea
                          id="feedback"
                          placeholder="Provide feedback on the student's work..."
                          rows={5}
                          value={feedback}
                          onChange={handleFeedbackChange}
                          className="resize-none"
                          disabled={!hasStudentSubmission}
                        />
                      </div>
                      <div>
                        <Label htmlFor="grade" className="mb-2 block">
                          Grade (0-{maxGrade})
                        </Label>
                        <Input
                          id="grade"
                          type="text"
                          placeholder="0-100"
                          value={grade}
                          onChange={handleGradeChange}
                          disabled={!hasStudentSubmission}
                        />
                        {activity.grade !== undefined && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Current grade: {activity.grade} / {maxGrade}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSubmitFeedback} 
                        disabled={submitting || (!feedback.trim() && !grade) || !hasStudentSubmission}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {activity.hasFeedback ? "Update Feedback" : "Submit Feedback"}
                      </Button>
                      {!hasStudentSubmission && (
                        <p className="text-xs text-muted-foreground absolute mt-10">
                          Feedback can only be provided after student submission
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherAssignmentDetails;