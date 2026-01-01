"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  User,
  Database,
} from "lucide-react";

interface ResumeItem {
  _id: string;
  section: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
  isVisible: boolean;
}

interface PersonalInfo {
  fullName: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: { platform: string; url: string }[];
}

const SECTIONS = [
  "Experience",
  "Education",
  "Skills",
  "Projects",
  "Certifications",
  "Awards",
];

export default function ResumePage() {
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResumeItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [isPersonalDialogOpen, setIsPersonalDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchPersonalInfo();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/resume");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch resume items", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalInfo = async () => {
    try {
      const res = await fetch("/api/personal-info");
      const data = await res.json();
      if (data && data._id) setPersonalInfo(data);
    } catch (error) {
      console.error("Failed to fetch personal info", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      section: formData.get("section"),
      title: formData.get("title"),
      company: formData.get("company"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      description: formData.get("description"),
      isVisible: true,
      order: editingItem ? editingItem.order : items.length,
    };

    try {
      const url = editingItem
        ? `/api/resume/${editingItem._id}`
        : "/api/resume";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchItems();
        setIsDialogOpen(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Failed to save item", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePersonalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      title: formData.get("title"),
      bio: formData.get("bio"),
      avatar: formData.get("avatar"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location"),
    };

    try {
      const res = await fetch("/api/personal-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setPersonalInfo(updated);
        setIsPersonalDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(`/api/resume/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will add fake data to your resume. Continue?")) return;
    setLoading(true);
    try {
      await fetch("/api/resume/seed", { method: "POST" });
      await fetchItems();
      await fetchPersonalInfo();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item: ResumeItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ResumeItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Resume / CV</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPersonalDialogOpen(true)}
          >
            <User className="mr-2 h-4 w-4" /> Personal Info
          </Button>
          <Button
            onClick={() => {
              setEditingItem(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* Personal Info Dialog */}
      <Dialog
        open={isPersonalDialogOpen}
        onOpenChange={setIsPersonalDialogOpen}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Personal Info</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePersonalSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                name="fullName"
                defaultValue={personalInfo?.fullName}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Professional Title</label>
              <Input name="title" defaultValue={personalInfo?.title} required />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                name="bio"
                defaultValue={personalInfo?.bio}
                className="h-24"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input
                name="avatar"
                defaultValue={personalInfo?.avatar}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" defaultValue={personalInfo?.email} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Phone</label>
                <Input name="phone" defaultValue={personalInfo?.phone} />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Location</label>
              <Input name="location" defaultValue={personalInfo?.location} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPersonalDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Resume Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Section</label>
              <Select
                name="section"
                defaultValue={editingItem?.section || "Experience"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Title / Role</label>
              <Input
                name="title"
                required
                defaultValue={editingItem?.title}
                placeholder="e.g. Senior Developer"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Company / Institution
              </label>
              <Input
                name="company"
                defaultValue={editingItem?.company}
                placeholder="e.g. Google"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  name="startDate"
                  defaultValue={editingItem?.startDate}
                  placeholder="e.g. 2020"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  name="endDate"
                  defaultValue={editingItem?.endDate}
                  placeholder="e.g. Present"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                defaultValue={editingItem?.description}
                placeholder="Details..."
                className="h-32"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Personal Info Card Preview */}
          {personalInfo && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Personal Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {personalInfo.avatar && (
                    <img
                      src={personalInfo.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">
                      {personalInfo.fullName}
                    </h3>
                    <p className="text-muted-foreground">
                      {personalInfo.title}
                    </p>
                    <p className="text-sm mt-1">{personalInfo.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {SECTIONS.map((section) => {
            const sectionItems = groupedItems[section] || [];
            if (sectionItems.length === 0) return null;

            return (
              <Card key={section}>
                <CardHeader>
                  <CardTitle>{section}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sectionItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-start justify-between p-4 border rounded-lg bg-muted/50"
                    >
                      <div className="space-y-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.company && (
                          <p className="text-sm text-muted-foreground">
                            {item.company}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {item.startDate} - {item.endDate || "Present"}
                        </p>
                        {item.description && (
                          <p className="text-sm mt-2 whitespace-pre-wrap">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
          {items.length === 0 && !personalInfo && (
            <div className="text-center py-10 text-muted-foreground">
              No resume items found. Click "Seed Data" to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
