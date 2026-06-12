import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Navbar from "@/components/layout/Navbar";
import GroupChat from "@/components/community/GroupChat";

interface Group {
  id: string;
  name: string;
  description: string;
  icon: string;
  region: string;
}

const MaaGang = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const loadGroups = async () => {
      try {
        setLoading(true);
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, orderBy("name", "asc"));
        const snapshot = await getDocs(q);

        const groupsList: Group[] = [];
        snapshot.forEach(doc => {
          groupsList.push({
            id: doc.id,
            ...doc.data(),
          } as Group);
        });

        setGroups(groupsList);
        if (groupsList.length > 0) {
          setSelectedGroup(groupsList[0]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load groups. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-rose-400 font-medium">Loading communities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-rose-900 mb-2">
            Support Communities
          </h1>
          <p className="text-rose-700 text-lg">
            Connect with mothers at every stage of your journey
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Groups Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24 max-h-[calc(100vh-200px)] overflow-y-auto border border-rose-100">
              <h2 className="text-sm font-semibold text-rose-900 mb-4 uppercase tracking-widest">
                Communities
              </h2>
              
              {groups.length === 0 ? (
                <p className="text-rose-600 text-sm">No communities found</p>
              ) : (
                <div className="space-y-2">
                  {groups.map(group => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`w-full text-left p-3 rounded-lg transition-all text-sm font-medium ${
                        selectedGroup?.id === group.id
                          ? "bg-rose-100 border-2 border-rose-400 text-rose-900"
                          : "bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{group.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{group.name}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedGroup ? (
              <GroupChat group={selectedGroup} currentUser={user} />
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center border border-rose-100">
                <p className="text-rose-700 font-medium">Select a community to begin</p>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default MaaGang;