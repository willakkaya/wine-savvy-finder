import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Mail, DollarSign, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TeamMember {
  id: string;
  user_id: string;
  per_meal_budget: number | null;
  is_active: boolean;
  added_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

interface TeamMemberManagerProps {
  corporateAccountId: string;
}

export function TeamMemberManager({ corporateAccountId }: TeamMemberManagerProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const queryClient = useQueryClient();

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["team-members", corporateAccountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("corporate_team_members")
        .select(`
          id,
          user_id,
          per_meal_budget,
          is_active,
          added_at,
          profiles (
            email,
            full_name
          )
        `)
        .eq("corporate_account_id", corporateAccountId)
        .order("added_at", { ascending: false });

      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ email, budget }: { email: string; budget: number | null }) => {
      // First, check if user exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (!profile) {
        throw new Error("User not found. They need to sign up first.");
      }

      // Add them to the corporate team
      const { error } = await supabase
        .from("corporate_team_members")
        .insert({
          corporate_account_id: corporateAccountId,
          user_id: profile.id,
          per_meal_budget: budget,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", corporateAccountId] });
      toast({
        title: "Team member added",
        description: "The user has been added to your team.",
      });
      setEmail("");
      setBudget("");
      setIsInviteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding team member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("corporate_team_members")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", corporateAccountId] });
      toast({
        title: "Status updated",
        description: "Team member status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update team member status.",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("corporate_team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", corporateAccountId] });
      toast({
        title: "Team member removed",
        description: "The team member has been removed from your account.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove team member.",
        variant: "destructive",
      });
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate({
      email: email.trim(),
      budget: budget ? parseFloat(budget) : null,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading team members...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">Manage your corporate team members</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add an existing user to your corporate account. They must be registered first.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="member@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="budget">Per Meal Budget (optional)</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty to use account default
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={inviteMutation.isPending}>
                {inviteMutation.isPending ? "Adding..." : "Add Team Member"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
            <p className="text-muted-foreground mb-4">
              Add team members to allow them to create pre-orders on behalf of your company.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Team Members ({teamMembers.length})</CardTitle>
            <CardDescription>
              Manage access and budgets for your team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.profiles.full_name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {member.profiles.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.per_meal_budget ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          {member.per_meal_budget.toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Default</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.is_active ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(member.added_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleActiveMutation.mutate({
                              id: member.id,
                              isActive: member.is_active,
                            })
                          }
                        >
                          {member.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMutation.mutate(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
