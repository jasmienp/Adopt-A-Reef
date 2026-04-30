import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CalendarClock,
  CheckCircle2,
  Loader2,
  Lock,
  MapPin,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Unlock,
  Waves,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import type { Coral, VolunteerWork } from "@shared/schema";

const CORALS_KEY = ["/api/corals"] as const;
const WORKS_KEY = ["/api/volunteer-works"] as const;

type WorkWithCount = VolunteerWork & { volunteerCount: number };

type CoralFormState = {
  name: string;
  image: string;
  description: string;
  price: string;
  stock: string;
};

const emptyCoralForm: CoralFormState = {
  name: "",
  image: "",
  description: "",
  price: "",
  stock: "",
};

type WorkFormState = {
  title: string;
  description: string;
  location: string;
  scheduledFor: string;
  hours: string;
  status: "open" | "closed" | "completed";
};

const emptyWorkForm: WorkFormState = {
  title: "",
  description: "",
  location: "",
  scheduledFor: "",
  hours: "",
  status: "open",
};

function toLocalInput(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const AdminPage = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, isLoading: authLoading, user } = useAuth();
  const [tab, setTab] = useState<"corals" | "works">("corals");

  const [coralDialogOpen, setCoralDialogOpen] = useState(false);
  const [editingCoralId, setEditingCoralId] = useState<string | null>(null);
  const [coralForm, setCoralForm] = useState<CoralFormState>(emptyCoralForm);

  const [workDialogOpen, setWorkDialogOpen] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workForm, setWorkForm] = useState<WorkFormState>(emptyWorkForm);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLocation("/auth");
    } else if (!isAdmin) {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const coralsQuery = useQuery<Coral[]>({
    queryKey: CORALS_KEY,
    enabled: isAuthenticated && isAdmin,
  });

  const worksQuery = useQuery<WorkWithCount[]>({
    queryKey: WORKS_KEY,
    enabled: isAuthenticated && isAdmin,
  });

  const showError = (title: string) => (err: Error) => {
    let description = err.message.replace(/^\d+:\s*/, "");
    try {
      const parsed = JSON.parse(description);
      if (parsed?.message) description = parsed.message;
    } catch {
      /* leave */
    }
    toast({ title, description, variant: "destructive" });
  };

  // ---------- Corals ----------
  const saveCoralMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: coralForm.name.trim(),
        image: coralForm.image.trim(),
        description: coralForm.description.trim(),
        price: Number(coralForm.price),
        stock: Number(coralForm.stock),
      };
      if (editingCoralId) {
        await apiRequest("PATCH", `/api/admin/corals/${editingCoralId}`, payload);
      } else {
        await apiRequest("POST", "/api/admin/corals", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CORALS_KEY });
      toast({
        title: editingCoralId ? "Coral updated" : "Coral added",
      });
      setCoralDialogOpen(false);
      setEditingCoralId(null);
      setCoralForm(emptyCoralForm);
    },
    onError: showError("Could not save coral"),
  });

  const deleteCoralMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/corals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CORALS_KEY });
      toast({ title: "Coral removed" });
    },
    onError: showError("Could not remove coral"),
  });

  const openAddCoral = () => {
    setEditingCoralId(null);
    setCoralForm(emptyCoralForm);
    setCoralDialogOpen(true);
  };

  const openEditCoral = (coral: Coral) => {
    setEditingCoralId(coral.id);
    setCoralForm({
      name: coral.name,
      image: coral.image,
      description: coral.description ?? "",
      price: String(coral.price),
      stock: String(coral.stock),
    });
    setCoralDialogOpen(true);
  };

  // ---------- Volunteer works ----------
  const saveWorkMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: workForm.title.trim(),
        description: workForm.description.trim(),
        location: workForm.location.trim(),
        scheduledFor: workForm.scheduledFor
          ? new Date(workForm.scheduledFor).toISOString()
          : "",
        hours: Number(workForm.hours),
        status: workForm.status,
      };
      if (editingWorkId) {
        await apiRequest(
          "PATCH",
          `/api/admin/volunteer-works/${editingWorkId}`,
          payload,
        );
      } else {
        await apiRequest("POST", "/api/admin/volunteer-works", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKS_KEY });
      toast({
        title: editingWorkId ? "Volunteer work updated" : "Volunteer work added",
      });
      setWorkDialogOpen(false);
      setEditingWorkId(null);
      setWorkForm(emptyWorkForm);
    },
    onError: showError("Could not save volunteer work"),
  });

  const updateWorkStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "open" | "closed" | "completed";
    }) => {
      await apiRequest("PATCH", `/api/admin/volunteer-works/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKS_KEY });
      toast({ title: "Status updated" });
    },
    onError: showError("Could not update status"),
  });

  const deleteWorkMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/volunteer-works/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKS_KEY });
      toast({ title: "Volunteer work removed" });
    },
    onError: showError("Could not remove volunteer work"),
  });

  const openAddWork = () => {
    setEditingWorkId(null);
    const inOneWeek = new Date();
    inOneWeek.setDate(inOneWeek.getDate() + 7);
    inOneWeek.setHours(10, 0, 0, 0);
    setWorkForm({ ...emptyWorkForm, scheduledFor: toLocalInput(inOneWeek) });
    setWorkDialogOpen(true);
  };

  const openEditWork = (work: VolunteerWork) => {
    setEditingWorkId(work.id);
    setWorkForm({
      title: work.title,
      description: work.description,
      location: work.location,
      scheduledFor: toLocalInput(work.scheduledFor),
      hours: String(work.hours),
      status: work.status as WorkFormState["status"],
    });
    setWorkDialogOpen(true);
  };

  const showSpinner = authLoading || !isAuthenticated || !isAdmin;
  const corals = coralsQuery.data ?? [];
  const works = worksQuery.data ?? [];

  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden bg-black animate-in fade-in duration-500"
      data-testid="page-admin"
    >
      <NavigationBarSection />

      <section className="relative px-4 pb-16 pt-32 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-[1200px]">
          <header className="mb-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#052698] via-[#116bf8] to-[#21bcee]">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1
                  className="[font-family:'Inter',Helvetica] text-4xl font-bold leading-tight text-white sm:text-5xl"
                  data-testid="text-admin-title"
                >
                  Admin
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Manage what visitors see on Adopt and Volunteer.{" "}
                  {user?.username && (
                    <span className="text-white/50">· {user.username}</span>
                  )}
                </p>
              </div>
            </div>
          </header>

          {showSpinner ? (
            <div
              className="flex min-h-[40vh] items-center justify-center text-white/70"
              data-testid="status-admin-loading"
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading…
            </div>
          ) : (
            <>
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  label="Coral types"
                  value={corals.length}
                  icon={<Waves className="h-5 w-5" />}
                  testId="stat-corals"
                />
                <StatCard
                  label="Open opportunities"
                  value={works.filter((w) => w.status === "open").length}
                  icon={<CalendarClock className="h-5 w-5" />}
                  testId="stat-open-works"
                />
                <StatCard
                  label="Completed projects"
                  value={works.filter((w) => w.status === "completed").length}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  testId="stat-completed-works"
                />
              </div>

              <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as "corals" | "works")}
                className="w-full"
              >
                <TabsList className="mb-6 bg-white/5">
                  <TabsTrigger value="corals" data-testid="tab-corals">
                    Corals ({corals.length})
                  </TabsTrigger>
                  <TabsTrigger value="works" data-testid="tab-works">
                    Volunteer works ({works.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="corals">
                  <div className="mb-4 flex justify-end">
                    <Button
                      type="button"
                      onClick={openAddCoral}
                      data-testid="button-add-coral"
                      className="gap-2 bg-gradient-to-r from-[#052698] via-[#116bf8] to-[#21bcee] text-white hover:opacity-95"
                    >
                      <Plus className="h-4 w-4" />
                      Add coral
                    </Button>
                  </div>
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardContent className="p-0">
                      {coralsQuery.isLoading ? (
                        <div className="flex items-center justify-center p-12 text-white/70">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Loading corals…
                        </div>
                      ) : corals.length === 0 ? (
                        <p className="p-12 text-center text-white/60">
                          No corals yet. Add one so visitors can adopt.
                        </p>
                      ) : (
                        <div className="divide-y divide-white/10">
                          {corals.map((c) => (
                            <div
                              key={c.id}
                              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                              data-testid={`row-coral-${c.id}`}
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={c.image}
                                  alt={c.name}
                                  className="h-14 w-14 rounded-lg object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      "/figmaAssets/adopt/coral-1.png";
                                  }}
                                />
                                <div>
                                  <p
                                    className="font-semibold text-white"
                                    data-testid={`text-coral-name-${c.id}`}
                                  >
                                    {c.name}
                                  </p>
                                  <p className="text-xs text-white/60 line-clamp-1 max-w-md">
                                    {c.description || "No description"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-4">
                                <div className="text-right text-sm text-white">
                                  <p className="text-xs text-white/60">Price</p>
                                  <p
                                    className="font-semibold"
                                    data-testid={`text-coral-price-${c.id}`}
                                  >
                                    ${c.price}
                                  </p>
                                </div>
                                <div className="text-right text-sm text-white">
                                  <p className="text-xs text-white/60">Stock</p>
                                  <p
                                    className={`font-semibold ${c.stock === 0 ? "text-red-300" : ""}`}
                                    data-testid={`text-coral-stock-${c.id}`}
                                  >
                                    {c.stock}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditCoral(c)}
                                    data-testid={`button-edit-coral-${c.id}`}
                                    className="gap-1 text-white hover:bg-white/10"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={deleteCoralMutation.isPending}
                                    onClick={() => {
                                      if (
                                        confirm(`Delete "${c.name}"? This cannot be undone.`)
                                      ) {
                                        deleteCoralMutation.mutate(c.id);
                                      }
                                    }}
                                    data-testid={`button-delete-coral-${c.id}`}
                                    className="gap-1 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="works">
                  <div className="mb-4 flex justify-end">
                    <Button
                      type="button"
                      onClick={openAddWork}
                      data-testid="button-add-work"
                      className="gap-2 bg-gradient-to-r from-[#052698] via-[#116bf8] to-[#21bcee] text-white hover:opacity-95"
                    >
                      <Plus className="h-4 w-4" />
                      Add volunteer work
                    </Button>
                  </div>
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardContent className="p-0">
                      {worksQuery.isLoading ? (
                        <div className="flex items-center justify-center p-12 text-white/70">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Loading volunteer works…
                        </div>
                      ) : works.length === 0 ? (
                        <p className="p-12 text-center text-white/60">
                          No volunteer works yet.
                        </p>
                      ) : (
                        <div className="divide-y divide-white/10">
                          {works.map((w) => (
                            <div
                              key={w.id}
                              className="flex flex-col gap-3 p-5"
                              data-testid={`row-work-${w.id}`}
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex items-center gap-2">
                                    <p
                                      className="font-semibold text-white"
                                      data-testid={`text-work-title-${w.id}`}
                                    >
                                      {w.title}
                                    </p>
                                    <StatusBadge status={w.status} />
                                  </div>
                                  <p className="text-xs text-white/60 line-clamp-1">
                                    {w.description}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/60">
                                    <span className="flex items-center gap-1">
                                      <CalendarClock className="h-3.5 w-3.5" />
                                      {new Date(w.scheduledFor).toLocaleString(
                                        undefined,
                                        {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        },
                                      )}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {w.location}
                                    </span>
                                    <span>{w.hours}h</span>
                                    <span>
                                      {w.volunteerCount}{" "}
                                      {w.volunteerCount === 1
                                        ? "volunteer"
                                        : "volunteers"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {w.status === "open" ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      disabled={updateWorkStatusMutation.isPending}
                                      onClick={() =>
                                        updateWorkStatusMutation.mutate({
                                          id: w.id,
                                          status: "closed",
                                        })
                                      }
                                      data-testid={`button-close-work-${w.id}`}
                                      className="gap-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                    >
                                      <Lock className="h-4 w-4" />
                                      Close signups
                                    </Button>
                                  ) : w.status === "closed" ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      disabled={updateWorkStatusMutation.isPending}
                                      onClick={() =>
                                        updateWorkStatusMutation.mutate({
                                          id: w.id,
                                          status: "open",
                                        })
                                      }
                                      data-testid={`button-open-work-${w.id}`}
                                      className="gap-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                    >
                                      <Unlock className="h-4 w-4" />
                                      Reopen
                                    </Button>
                                  ) : null}
                                  {w.status !== "completed" && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      disabled={updateWorkStatusMutation.isPending}
                                      onClick={() =>
                                        updateWorkStatusMutation.mutate({
                                          id: w.id,
                                          status: "completed",
                                        })
                                      }
                                      data-testid={`button-complete-work-${w.id}`}
                                      className="gap-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                      Mark done
                                    </Button>
                                  )}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditWork(w)}
                                    data-testid={`button-edit-work-${w.id}`}
                                    className="gap-1 text-white hover:bg-white/10"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={deleteWorkMutation.isPending}
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `Delete "${w.title}"? Volunteer signups for this work will be removed.`,
                                        )
                                      ) {
                                        deleteWorkMutation.mutate(w.id);
                                      }
                                    }}
                                    data-testid={`button-delete-work-${w.id}`}
                                    className="gap-1 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </section>

      {/* Coral dialog */}
      <Dialog open={coralDialogOpen} onOpenChange={setCoralDialogOpen}>
        <DialogContent className="max-w-lg" data-testid="dialog-coral">
          <DialogHeader>
            <DialogTitle>
              {editingCoralId ? "Edit coral" : "Add coral"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <FieldLabel label="Name">
              <Input
                value={coralForm.name}
                onChange={(e) =>
                  setCoralForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Staghorn Coral"
                data-testid="input-coral-name"
              />
            </FieldLabel>
            <FieldLabel label="Image URL">
              <Input
                value={coralForm.image}
                onChange={(e) =>
                  setCoralForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="/figmaAssets/adopt/coral-1.png"
                data-testid="input-coral-image"
              />
            </FieldLabel>
            <FieldLabel label="Description">
              <Textarea
                value={coralForm.description}
                onChange={(e) =>
                  setCoralForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                placeholder="A short description visitors will see."
                data-testid="input-coral-description"
              />
            </FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <FieldLabel label="Price ($)">
                <Input
                  type="number"
                  min="1"
                  value={coralForm.price}
                  onChange={(e) =>
                    setCoralForm((f) => ({ ...f, price: e.target.value }))
                  }
                  data-testid="input-coral-price"
                />
              </FieldLabel>
              <FieldLabel label="Stock left">
                <Input
                  type="number"
                  min="0"
                  value={coralForm.stock}
                  onChange={(e) =>
                    setCoralForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  data-testid="input-coral-stock"
                />
              </FieldLabel>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCoralDialogOpen(false)}
              data-testid="button-cancel-coral"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={saveCoralMutation.isPending}
              onClick={() => saveCoralMutation.mutate()}
              data-testid="button-save-coral"
              className="bg-gradient-to-r from-[#052698] via-[#116bf8] to-[#21bcee] text-white hover:opacity-95"
            >
              {saveCoralMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editingCoralId ? (
                "Save changes"
              ) : (
                "Add coral"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Volunteer work dialog */}
      <Dialog open={workDialogOpen} onOpenChange={setWorkDialogOpen}>
        <DialogContent className="max-w-lg" data-testid="dialog-work">
          <DialogHeader>
            <DialogTitle>
              {editingWorkId ? "Edit volunteer work" : "Add volunteer work"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <FieldLabel label="Title">
              <Input
                value={workForm.title}
                onChange={(e) =>
                  setWorkForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Reef Cleanup Dive"
                data-testid="input-work-title"
              />
            </FieldLabel>
            <FieldLabel label="Description">
              <Textarea
                value={workForm.description}
                onChange={(e) =>
                  setWorkForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                placeholder="What volunteers will do."
                data-testid="input-work-description"
              />
            </FieldLabel>
            <FieldLabel label="Location (place)">
              <Input
                value={workForm.location}
                onChange={(e) =>
                  setWorkForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="Maui, Hawaii"
                data-testid="input-work-location"
              />
            </FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <FieldLabel label="Date & time">
                <Input
                  type="datetime-local"
                  value={workForm.scheduledFor}
                  onChange={(e) =>
                    setWorkForm((f) => ({
                      ...f,
                      scheduledFor: e.target.value,
                    }))
                  }
                  data-testid="input-work-scheduled-for"
                />
              </FieldLabel>
              <FieldLabel label="Hours">
                <Input
                  type="number"
                  min="1"
                  value={workForm.hours}
                  onChange={(e) =>
                    setWorkForm((f) => ({ ...f, hours: e.target.value }))
                  }
                  data-testid="input-work-hours"
                />
              </FieldLabel>
            </div>
            <FieldLabel label="Status">
              <Select
                value={workForm.status}
                onValueChange={(v) =>
                  setWorkForm((f) => ({
                    ...f,
                    status: v as WorkFormState["status"],
                  }))
                }
              >
                <SelectTrigger data-testid="select-work-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open (accepting signups)</SelectItem>
                  <SelectItem value="closed">Closed (visible, no new signups)</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </FieldLabel>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setWorkDialogOpen(false)}
              data-testid="button-cancel-work"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={saveWorkMutation.isPending}
              onClick={() => saveWorkMutation.mutate()}
              data-testid="button-save-work"
              className="bg-gradient-to-r from-[#052698] via-[#116bf8] to-[#21bcee] text-white hover:opacity-95"
            >
              {saveWorkMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editingWorkId ? (
                "Save changes"
              ) : (
                "Add work"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-white/60">
        {label}
      </Label>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-emerald-500/20 text-emerald-300",
    closed: "bg-amber-500/20 text-amber-300",
    completed: "bg-white/10 text-white/70",
  };
  const label =
    status === "open"
      ? "Open"
      : status === "closed"
        ? "Closed"
        : "Completed";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        styles[status] ?? "bg-white/10 text-white/70"
      }`}
    >
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  testId,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  testId: string;
}) {
  return (
    <Card
      className="border-white/10 bg-white/5 backdrop-blur-sm"
      data-testid={testId}
    >
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/60">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminPage;
