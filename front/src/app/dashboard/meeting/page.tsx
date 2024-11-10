"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import { supabase } from "../../comp/supabase";
import "react-calendar/dist/Calendar.css";
import { signIn, signOut, useSession } from "next-auth/react";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Meeting {
  id?: string;
  date: Date;
  title: string;
  time: string;
  description: string;
  email: string;
}

export default function MyApp() {
  const { data: session, status } = useSession();

  const [value, onChange] = useState<Value>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    title: "",
    time: "",
    description: "",
    email: "", // initially empty
  });

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetingToDeleteIndex, setMeetingToDeleteIndex] = useState<
    number | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editMeetingId, setEditMeetingId] = useState<string | null>(null);

  // Fetch meetings from the database when the component mounts
  useEffect(() => {
    const fetchMeetings = async () => {
      if (session?.user?.email) {
        try {
          const { data, error } = await supabase
            .from("meetings")
            .select("*")
            .order("date", { ascending: true })
            .eq("email", session.user.email);

          if (error) throw error;

          const meetingsWithDate = data.map((meeting: any) => ({
            ...meeting,
            date: new Date(meeting.date),
          }));
          setMeetings(meetingsWithDate);
        } catch (error) {
          console.error("Database error:", error);
        }
      }
    };

    if (status === "authenticated") {
      fetchMeetings();
    }
  }, [session, status]); // fetch meetings when session changes

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    setMeetingDetails({
      title: "",
      time: "",
      description: "",
      email: session?.user?.email || "", // Default to empty if not available
    });
    setIsEditing(false);
    setEditMeetingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      console.error("Selected date is required.");
      return;
    }

    const newMeeting = {
      date: selectedDate.toISOString(),
      title: meetingDetails.title,
      time: meetingDetails.time,
      description: meetingDetails.description,
      email: meetingDetails.email,
    };

    console.log("Submitting newMeeting:", newMeeting);

    try {
      if (isEditing && editMeetingId) {
        const { error } = await supabase
          .from("meetings")
          .update(newMeeting)
          .eq("id", editMeetingId);

        if (error) {
          console.error("Error updating meeting:", error);
          return;
        }

        setMeetings((prevMeetings) =>
          prevMeetings.map((meeting) =>
            meeting.id === editMeetingId
              ? { ...meeting, ...newMeeting, date: new Date(newMeeting.date) }
              : meeting
          )
        );
      } else {
        const { data, error } = await supabase
          .from("meetings")
          .insert(newMeeting)
          .select("*");

        if (error) {
          console.error("Error inserting meeting:", error);
          return;
        }

        console.log("Inserted data:", data);
        setMeetings((prevMeetings) => [
          ...prevMeetings,
          { ...data[0], date: new Date(data[0].date) },
        ]);
      }

      setMeetingDetails({ title: "", time: "", description: "", email: "" });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditMeetingId(null);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleDelete = (index: number) => {
    setMeetingToDeleteIndex(index);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (meetingToDeleteIndex !== null) {
      const meetingId = meetings[meetingToDeleteIndex]?.id;
      if (meetingId) {
        try {
          const { error } = await supabase
            .from("meetings")
            .delete()
            .eq("id", meetingId);
          if (error) throw error;

          setMeetings((prevMeetings) =>
            prevMeetings.filter((_, i) => i !== meetingToDeleteIndex)
          );
        } catch (error) {
          console.error("Error deleting meeting:", error);
        }
      }
      setMeetingToDeleteIndex(null);
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleEdit = (index: number) => {
    const meeting = meetings[index];
    setSelectedDate(meeting.date);
    setMeetingDetails({
      title: meeting.title,
      time: meeting.time,
      description: meeting.description,
      email: meeting.email,
    });
    setIsModalOpen(true);
    setIsEditing(true);
    setEditMeetingId(meeting.id || null);
  };

  // Handle loading and session errors
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please log in to access your meetings.</div>;
  }

  // Filter upcoming meetings
  const upcomingMeetings = meetings.filter(
    (meeting) => new Date(meeting.date) > new Date()
  );

  return (
    <div className="flex max-h-screen p-8">
      <div className="flex-1 flex justify-center items-start">
        <Calendar
          onChange={onChange}
          value={value}
          onClickDay={handleDateClick}
          className="w-full flex-grow max-w-lg p-8 bg-white shadow-lg rounded-lg"
          tileClassName={({ date, view }) =>
            selectedDate && date.toDateString() === selectedDate.toDateString()
              ? "bg-amber-500 text-white rounded"
              : "hover:bg-amber-500 p-4 rounded"
          }
          prevLabel={<span className="text-2xl">←</span>}
          nextLabel={<span className="text-2xl">→</span>}
        />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-xl mb-4">
                {isEditing ? "Edit Meeting" : "Schedule a Meeting"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={meetingDetails.title}
                    onChange={(e) =>
                      setMeetingDetails({
                        ...meetingDetails,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Time</label>
                  <input
                    type="time"
                    value={meetingDetails.time}
                    onChange={(e) =>
                      setMeetingDetails({
                        ...meetingDetails,
                        time: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={meetingDetails.description}
                    onChange={(e) =>
                      setMeetingDetails({
                        ...meetingDetails,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg"
                >
                  {isEditing ? "Save Changes" : "Create Meeting"}
                </button>
              </form>
              <button
                className="mt-4 text-red-500"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isConfirmDeleteOpen && meetingToDeleteIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-xl mb-4">
                Are you sure you want to delete this meeting?
              </h2>
              <div className="flex space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={confirmDelete}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsConfirmDeleteOpen(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-1/3 ml-8 bg-white p-6 shadow-lg rounded-lg max-w-xs max-h-[400px] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Meetings</h2>
        <ul>
          {upcomingMeetings.length === 0 ? (
            <li>No upcoming meetings</li>
          ) : (
            upcomingMeetings.map((meeting, index) => (
              <li key={meeting.id} className="mb-4">
                <div>
                  <strong>{meeting.title}</strong>
                </div>
                <div>{new Date(meeting.date).toLocaleString()}</div>
                <div>{meeting.description}</div>
                <button
                  className="text-blue-500 mt-2"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 mt-2 ml-2"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
