import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const coFounders = [
  {
    name: "Om Bhavsar",
    linkedin: "https://www.linkedin.com/in/om-bhavsar-88899025b/",
    image: { imageUrl: "/om.jpg" },
  },
  {
    name: "Dipti Chaturvedi",
    linkedin: "https://www.linkedin.com/in/dipti-chaturvedi-b14a82313/",
    image: { imageUrl: "/dipti.jpg" },
  },
  {
    name: "Rohan Shinde",
    linkedin: "https://www.linkedin.com/in/rohan-shinde-b3092537b/",
    image: { imageUrl: "/rohan.jpg" },
  },
  {
    name: "Swet Tiwari",
    linkedin: "#",
    image: { imageUrl: "/swet.jpg" },
  },
  {
    name: "Samay Duge",
    linkedin: "#",
    image: { imageUrl: "/samay.jpg" },
  },
];

export default function AboutUsPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader pageTitle="About Us" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Meet Our Team</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              The innovative minds behind SnapShop AI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coFounders.map((founder) => (
              <Card key={founder.name} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {founder.image && (
                      <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={founder.image.imageUrl} alt={founder.name} />
                        <AvatarFallback>{founder.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{founder.name}</h3>
                  <p className="text-sm text-muted-foreground">Co-founder</p>
                  <Link href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="mt-4 rounded-full">
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
