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
import { useSettings } from "@/contexts/SettingsContext"; // Import context hook

export default function SettingsPage() {
  const { refreshSettings } = useSettings(); // Use refresh capability
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
    type: "manual", // auto, manual
    mode: "default", // default, tet, spring, summer, autumn, winter
    allowUserToggle: true,
  });

  const [features, setFeatures] = useState({
    tetCountdown: false,
    tetDate: "2026-02-17T00:00:00+07:00",
    tetTitle: "Xuân Bính Ngọ 2026",
    tetGreeting: "Chúc Mừng Năm Mới",
    lockdown: {
        enabled: false,
        startBeforeMinutes: 0,
        endAfterMinutes: 60,
    },
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
        if (data.features) {
             setFeatures({
                 tetCountdown: data.features.tetCountdown || false,
                 tetDate: data.features.tetDate || "2026-02-17T00:00:00+07:00",
                 tetTitle: data.features.tetTitle || "Xuân Bính Ngọ 2026",
                 tetGreeting: data.features.tetGreeting || "Chúc Mừng Năm Mới",
                 lockdown: {
                     enabled: data.features.lockdown?.enabled || false,
                     startBeforeMinutes: data.features.lockdown?.startBeforeMinutes ?? 0,
                     endAfterMinutes: data.features.lockdown?.endAfterMinutes ?? 60,
                 }
             });
        }
        if (data.theme) {
            // Ensure backward compatibility
            setTheme({
                type: data.theme.type || "manual",
                mode: data.theme.mode || "default",
                allowUserToggle: data.theme.allowUserToggle ?? true,
            });
        }
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
        // Refresh global settings context to apply changes immediately (e.g. lockdown)
        await refreshSettings();
        
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
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features">
            <Card>
                <CardHeader>
                    <CardTitle>Special Features</CardTitle>
                    <CardDescription>
                        Toggle special events or functional features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                            <Label className="text-base">Tet Holiday Countdown</Label>
                            <p className="text-sm text-muted-foreground">
                                Enable a countdown timer page for the Lunar New Year.
                            </p>
                        </div>
                        <Switch
                            checked={features.tetCountdown}
                            onCheckedChange={(checked) =>
                                setFeatures({ ...features, tetCountdown: checked })
                            }
                        />
                    </div>
                    {features.tetCountdown && (
                        <div className="grid gap-4 pl-6 border-l-2 border-muted">
                            <div className="grid gap-2">
                                <Label>Countdown Target Date</Label>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="datetime-local"
                                        value={(() => {
                                            if (!features.tetDate) return "";
                                            const date = new Date(features.tetDate);
                                            if (isNaN(date.getTime())) return "";
                                            // Convert to local time for input value (YYYY-MM-DDThh:mm)
                                            const offset = date.getTimezoneOffset() * 60000;
                                            return new Date(date.getTime() - offset).toISOString().slice(0, 16);
                                        })()}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (!val) {
                                                setFeatures({ ...features, tetDate: "" });
                                                return;
                                            }
                                            const date = new Date(val);
                                            if (!isNaN(date.getTime())) {
                                                setFeatures({ ...features, tetDate: date.toISOString() });
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        System interprets as: {features.tetDate ? new Date(features.tetDate).toString() : "Not set"}
                                    </p>
                                </div>
                            </div>

                            {/* Lockdown Settings */}
                            <div className="pt-4 border-t mt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Celebration Lockdown Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Redirect all traffic to the countdown page during the event.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={features.lockdown?.enabled || false}
                                        onCheckedChange={(checked) =>
                                            setFeatures({ 
                                                ...features, 
                                                lockdown: { 
                                                    ...features.lockdown, 
                                                    enabled: checked 
                                                } 
                                            })
                                        }
                                    />
                                </div>
                                
                                {(features.lockdown?.enabled) && (
                                    <div className="grid gap-4 pl-4 border-l-2">
                                        <div className="grid gap-2">
                                            <Label>Lockdown Starts Before (Minutes)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={features.lockdown?.startBeforeMinutes?.toString() ?? "0"}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFeatures({ 
                                                        ...features, 
                                                        lockdown: { 
                                                            ...features.lockdown!, // force non-null as we are inside check
                                                            startBeforeMinutes: val === "" ? 0 : parseInt(val)
                                                        } 
                                                    });
                                                }}
                                                placeholder="e.g. 15 (minutes before Tet)"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Celebrate & Lock for (Minutes after Tet)</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={features.lockdown?.endAfterMinutes?.toString() ?? "60"}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFeatures({ 
                                                        ...features, 
                                                        lockdown: { 
                                                            ...features.lockdown!, 
                                                            endAfterMinutes: val === "" ? 0 : parseInt(val)
                                                        } 
                                                    });
                                                }}
                                                placeholder="e.g. 60 (return to normal after 1 hour)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>Event Title (Year Name)</Label>
                                <Input
                                    value={features.tetTitle}
                                    onChange={(e) =>
                                        setFeatures({ ...features, tetTitle: e.target.value })
                                    }
                                    placeholder="Xuân Bính Ngọ 2026"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Greeting Message (Post-Countdown)</Label>
                                <Input
                                    value={features.tetGreeting}
                                    onChange={(e) =>
                                        setFeatures({ ...features, tetGreeting: e.target.value })
                                    }
                                    placeholder="Chúc Mừng Năm Mới"
                                />
                            </div>
                        </div>
                    )}
                    <Button 
                        onClick={() => saveSetting("features", features)} 
                        disabled={saving}
                    >
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>

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
                <Label>Theme Selection Mode</Label>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <input 
                            type="radio" 
                            id="theme-manual" 
                            name="themeType" 
                            value="manual"
                            checked={theme.type === "manual"}
                            onChange={() => setTheme({ ...theme, type: "manual" })}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="theme-manual">Manual Selection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="radio" 
                            id="theme-auto" 
                            name="themeType" 
                            value="auto"
                            checked={theme.type === "auto"}
                            onChange={() => setTheme({ ...theme, type: "auto" })}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="theme-auto">Automatic (Date-based)</Label>
                    </div>
                </div>
              </div>

              {theme.type === "manual" && (
                  <div className="grid gap-2 pl-6 border-l-2 border-muted">
                    <Label>Select Season</Label>
                    <Select
                      value={theme.mode}
                      onValueChange={(val) => setTheme({ ...theme, mode: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (None)</SelectItem>
                        <SelectItem value="tet">Tet Holiday (Lunar New Year)</SelectItem>
                        <SelectItem value="spring">Spring (Hoa Đào/Mai)</SelectItem>
                        <SelectItem value="summer">Summer (Nắng Vàng)</SelectItem>
                        <SelectItem value="autumn">Autumn (Lá Thu)</SelectItem>
                        <SelectItem value="winter">Winter (Tuyết Rơi)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Manually force a specific seasonal theme.
                    </p>
                  </div>
              )}

              {theme.type === "auto" && (
                  <div className="pl-6 border-l-2 border-muted">
                      <p className="text-sm text-muted-foreground">
                          Theme will automatically change based on the current date:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                          <li>Spring: March - May</li>
                          <li>Summer: June - August</li>
                          <li>Autumn: September - November</li>
                          <li>Winter: December - February</li>
                      </ul>
                  </div>
              )}

              <div className="flex items-center space-x-2 pt-4 border-t">
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
