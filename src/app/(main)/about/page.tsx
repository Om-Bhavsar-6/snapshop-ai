import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const creators = [
  {
    name: "Alex Doe",
    role: "Lead Developer",
    linkedin: "https://www.linkedin.com/in/alex-doe",
    avatarId: "creator-1-avatar"
  },
  {
    name: "Jane Smith",
    role: "UI/UX Designer",
    linkedin: "https://www.linkedin.com/in/jane-smith",
    avatarId: "creator-2-avatar"
  },
  {
    name: "Sam Wilson",
    role: "AI Specialist",
    linkedin: "https://www.linkedin.com/in/sam-wilson",
    avatarId: "creator-3-avatar"
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader pageTitle="About Us" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Meet the Creators</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    We are a passionate team of developers and designers dedicated to building smart and intuitive applications.
                </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {creators.map((creator) => {
                    const avatar = PlaceHolderImages.find(img => img.id === creator.avatarId);
                    return (
                        <Card key={creator.name} className="text-center">
                            <CardContent className="p-6">
                                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={creator.name} />}
                                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-semibold">{creator.name}</h3>
                                <p className="text-primary font-medium">{creator.role}</p>
                                <Link href={creator.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="icon" className="mt-4 rounded-full">
                                        <Linkedin className="h-5 w-5" />
                                        <span className="sr-only">LinkedIn</span>
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
      </main>
    </div>
  );
}
