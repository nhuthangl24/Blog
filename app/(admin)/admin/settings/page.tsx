"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings State
  const [announcement, setAnnouncement] = useState({
    enabled: false,
    content: "",
    link: "",
  });
  
  const [ads, setAds] = useState({
    enabled: false,
    sidebar: { enabled: false, script: "" },
    footer: { enabled: false, script: "" },
    floatingLeft: { enabled: false, script: "" },
    floatingRight: { enabled: false, script: "" },
  });

  const [theme, setTheme] = useState({
    mode: "default", // default, tet
    allowUserToggle: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.announcement) setAnnouncement(data.announcement);
        if (data.ads) setAds((prev) => ({ ...prev, ...data.ads }));
        if (data.theme) setTheme(data.theme);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      
      if (res.ok) {
        // Show success toast (implement later)
        alert("Settings saved!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Announcement</TabsTrigger>
          <TabsTrigger value="ads">Ads & Monetization</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* Announcement Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Bar</CardTitle>
              <CardDescription>
                Display a global notification bar at the top of the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={announcement.enabled}
                  onCheckedChange={(checked) =>
                    setAnnouncement({ ...announcement, enabled: checked })
                  }
                />
                <Label>Enable Announcement</Label>
              </div>
              
              <div className="grid gap-2">
                <Label>Content</Label>
                <Input
                  value={announcement.content}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, content: e.target.value })
                  }
                  placeholder="e.g., Happy New Year! Check out our latest post."
                />
              </div>

              <div className="grid gap-2">
                <Label>Link (Optional)</Label>
                <Input
                  value={announcement.link}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, link: e.target.value })
                  }
                  placeholder="/posts/happy-new-year"
                />
              </div>

              <Button 
                onClick={() => saveSetting("announcement", announcement)} 
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads">
          <Card>
            <CardHeader>
              <CardTitle>Advertising</CardTitle>
              <CardDescription>
                Manage ad scripts for different positions independently.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2 border-b pb-4">
                <Switch
                  checked={ads.enabled}
                  onCheckedChange={(checked) =>
                    setAds({ ...ads, enabled: checked })
                  }
                />
                <Label className="text-lg font-semibold">Enable All Ads</Label>
              </div>

              {/* Sidebar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Sidebar Ad (Right Column)</Label>
                    <Switch
                        checked={ads.sidebar?.enabled}
                        onCheckedChange={(checked) =>
                            setAds({ ...ads, sidebar: { ...ads.sidebar, enabled: checked } })
                        }
                    />
                </div>
                {ads.sidebar?.enabled && (
                    <Textarea
                        value={ads.sidebar?.script || ""}
                        onChange={(e) =>
                            setAds({ ...ads, sidebar: { ...ads.sidebar, script: e.target.value } })
                        }
                        placeholder="<script>... Sidebar Ad ...</script>"
                        className="font-mono text-sm"
                        rows={4}
                    />
                )}
              </div>

              {/* Footer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Footer Ad (Bottom Banner)</Label>
                    <Switch
                        checked={ads.footer?.enabled}
                        onCheckedChange={(checked) =>
                            setAds({ ...ads, footer: { ...ads.footer, enabled: checked } })
                        }
                    />
                </div>
                {ads.footer?.enabled && (
                    <Textarea
                        value={ads.footer?.script || ""}
                        onChange={(e) =>
                            setAds({ ...ads, footer: { ...ads.footer, script: e.target.value } })
                        }
                        placeholder="<script>... Footer Ad ...</script>"
                        className="font-mono text-sm"
                        rows={4}
                    />
                )}
              </div>

              {/* Floating Left */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Floating Left Ad</Label>
                    <Switch
                        checked={ads.floatingLeft?.enabled}
                        onCheckedChange={(checked) =>
                            setAds({ ...ads, floatingLeft: { ...ads.floatingLeft, enabled: checked } })
                        }
                    />
                </div>
                {ads.floatingLeft?.enabled && (
                    <Textarea
                        value={ads.floatingLeft?.script || ""}
                        onChange={(e) =>
                            setAds({ ...ads, floatingLeft: { ...ads.floatingLeft, script: e.target.value } })
                        }
                        placeholder="<script>... Left Ad ...</script>"
                        className="font-mono text-sm"
                        rows={4}
                    />
                )}
              </div>

              {/* Floating Right */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Floating Right Ad</Label>
                    <Switch
                        checked={ads.floatingRight?.enabled}
                        onCheckedChange={(checked) =>
                            setAds({ ...ads, floatingRight: { ...ads.floatingRight, enabled: checked } })
                        }
                    />
                </div>
                {ads.floatingRight?.enabled && (
                    <Textarea
                        value={ads.floatingRight?.script || ""}
                        onChange={(e) =>
                            setAds({ ...ads, floatingRight: { ...ads.floatingRight, script: e.target.value } })
                        }
                        placeholder="<script>... Right Ad ...</script>"
                        className="font-mono text-sm"
                        rows={4}
                    />
                )}
              </div>

              <Button 
                onClick={() => saveSetting("ads", ads)} 
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Active Theme Mode</Label>
                <Select
                  value={theme.mode}
                  onValueChange={(val) => setTheme({ ...theme, mode: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (System/User)</SelectItem>
                    <SelectItem value="tet">Tet Holiday (Lunar New Year)</SelectItem>
                    <SelectItem value="spring">Spring (Hoa Đào/Mai)</SelectItem>
                    <SelectItem value="summer">Summer (Nắng Vàng)</SelectItem>
                    <SelectItem value="autumn">Autumn (Lá Thu)</SelectItem>
                    <SelectItem value="winter">Winter (Tuyết Rơi)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select a seasonal theme to apply global decorations.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={theme.allowUserToggle}
                  onCheckedChange={(checked) =>
                    setTheme({ ...theme, allowUserToggle: checked })
                  }
                />
                <Label>Allow users to toggle Light/Dark mode</Label>
              </div>

              <Button 
                onClick={() => saveSetting("theme", theme)} 
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
