import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const creators = [
  {
    name: "Om Bhavsar",
    role: "Co-Founder",
    linkedin: "https://www.linkedin.com/in/om-bhavsar-88899025b/",
    avatarUrl: "/om.jpg"
  },
  {
    name: "Dipti Chaturvedi",
    role: "Co-Founder",
    linkedin: "https://www.linkedin.com/in/dipti-chaturvedi-b14a82313/",
    avatarUrl: "/dipti.jpg"
  },
  {
    name: "Rohan Shinde",
    role: "Co-Founder",
    linkedin: "",
    avatarUrl: "/rohan.jpg"
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
                {creators.map((creator) => (
                    <Card key={creator.name} className="text-center">
                        <CardContent className="p-6">
                            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                                <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-semibold">{creator.name}</h3>
                            <p className="text-primary font-medium">{creator.role}</p>
                            {creator.linkedin && (
                                <Link href={creator.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="icon" className="mt-4 rounded-full">
                                        <Linkedin className="h-5 w-5" />
                                        <span className="sr-only">LinkedIn</span>
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
