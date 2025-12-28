"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
    };

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      setMessage("Profile updated successfully");
      // Clear password fields
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                name="name"
                defaultValue={session?.user?.name || ""}
                placeholder="Your Name"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                defaultValue={session?.user?.email || ""}
                placeholder="admin@example.com"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Current Password
                  </label>
                  <Input
                    name="currentPassword"
                    type="password"
                    placeholder="Required to make changes"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    name="newPassword"
                    type="password"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>
            </div>

            {message && <div className="text-green-500 text-sm">{message}</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
