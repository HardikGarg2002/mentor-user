import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MessageSquare, Phone, Star, Video } from "lucide-react";
import { type MentorProfile } from "@/types/mentor";
import { AvatarUpload } from "../avatar-upload";
// import { updateMentorProfileImage } from "@/actions/mentor-actions";

interface ProfileSidebarProps {
  mentorProfile: MentorProfile;
  profileCompletionPercentage: number;
}

export function ProfileSidebar({
  mentorProfile,
  profileCompletionPercentage,
}: ProfileSidebarProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <AvatarUpload
            initialImage={mentorProfile.image}
            name={mentorProfile.name}
            userId={mentorProfile.userId}
          />
          <h2 className="text-2xl font-bold mt-4">{mentorProfile.name}</h2>
          <p className="text-muted-foreground">{mentorProfile.title}</p>
          <div className="flex items-center justify-center mt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{mentorProfile.rating}</span>
            <span className="ml-1 text-xs text-muted-foreground">
              ({mentorProfile.reviewCount} reviews)
            </span>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-1">
              {mentorProfile.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Session Types</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  <span>Chat</span>
                </div>
                <span className="font-medium">
                  ${mentorProfile.pricing.chat}/hr
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-2 text-primary" />
                  <span>Video</span>
                </div>
                <span className="font-medium">
                  ${mentorProfile.pricing.video}/hr
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span>Call</span>
                </div>
                <span className="font-medium">
                  ${mentorProfile.pricing.call}/hr
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Profile Completion</h3>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${profileCompletionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your profile is {profileCompletionPercentage}% complete
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Visibility</AlertTitle>
          <AlertDescription>
            Your profile is currently visible to potential mentees. You can
            toggle visibility in settings.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
