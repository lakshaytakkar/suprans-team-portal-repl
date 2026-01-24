import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const { currentUser } = useStore();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your photo and personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-2">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-xl">{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">Change Avatar</Button>
              <p className="text-xs text-muted-foreground">JPG or PNG. Max 1MB.</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={currentUser.name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue={currentUser.email} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input defaultValue={currentUser.phone} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input defaultValue={currentUser.role.replace('_', ' ')} disabled className="bg-muted capitalize" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password securely.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button variant="outline">Update Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
