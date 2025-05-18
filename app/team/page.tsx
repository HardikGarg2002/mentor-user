import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Github, Linkedin, Mail, Lightbulb, Code } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Our Team | ARicious",
  description:
    "Meet the team behind ARicious - the people who made it all possible.",
};

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Rishika Rampal",
      role: "Founder & Visionary",
      image: "/images/team/rishika-bhambla.jpg", // Add actual image when available
      bio: "Rishika is the brain behind ARicious. Her vision to connect mentees with industry experts stemmed from her own experiences and the realization that personalized guidance can significantly accelerate growth. She conceptualized the ARicious platform to bridge the gap between those seeking knowledge and those willing to share it.",
      icon: <Lightbulb className="w-10 h-10 text-primary" />,
      links: {
        // linkedin: "https://linkedin.com/in/rishika-bhambla", // Update with actual link
        email: "rishika@aricious.com", // Update with actual email
      },
    },
    {
      name: "Hardik Garg",
      role: "Lead Developer",
      image: "/images/team/hardik-garg.jpg", // Add actual image when available
      bio: "Hardik took Rishika's vision and built it into reality. As the lead developer, he designed and implemented the entire ARicious web application from scratch. His technical expertise and problem-solving abilities were instrumental in creating a user-friendly, scalable platform that connects mentors and mentees seamlessly.",
      icon: <Code className="w-10 h-10 text-primary" />,
      links: {
        github: "https://github.com/HardikGarg2002", // Update with actual link
        linkedin: "https://www.linkedin.com/in/hardikgarg2002/", // Update with actual link
        email: "hardikgarg3085@gmail.com", // Update with actual email
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Meet Our Team</h1>
          <p className="text-xl max-w-2xl mx-auto">
            The passionate individuals behind ARicious who are dedicated to
            connecting mentees with expert mentors.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-8 mb-10 overflow-hidden relative">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="w-full max-w-[200px] aspect-square relative overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      member.icon
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{member.name}</h2>
                    <p className="text-primary font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-700 mb-6">{member.bio}</p>

                    <div className="flex gap-4">
                      {member.links.github && (
                        <a
                          href={member.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-primary transition-colors"
                        >
                          <Github className="h-5 w-5" />
                          <span className="sr-only">GitHub</span>
                        </a>
                      )}
                      {member.links.linkedin && (
                        <a
                          href={member.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-primary transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                          <span className="sr-only">LinkedIn</span>
                        </a>
                      )}
                      {member.links.email && (
                        <a
                          href={`mailto:${member.links.email}`}
                          className="text-gray-500 hover:text-primary transition-colors"
                        >
                          <Mail className="h-5 w-5" />
                          <span className="sr-only">Email</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <Card className="p-8">
              <p className="text-gray-700 mb-4">
                ARicious began with a simple idea from Rishika Bhambla: create a
                platform where people could easily connect with mentors who have
                real-world experience and insights.
              </p>
              <p className="text-gray-700 mb-4">
                After conceptualizing the platform, Rishika collaborated with
                Hardik Garg, who took on the challenge of building the entire
                web application from scratch. Hardik's technical expertise and
                dedication brought the ARicious vision to life.
              </p>
              <p className="text-gray-700">
                Today, ARicious stands as a testament to their combined vision
                and effort - a platform dedicated to making expert mentorship
                accessible to everyone who seeks to grow personally and
                professionally.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Whether you're looking for guidance or want to share your expertise,
            ARicious is the place for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/mentors">
              <Button size="lg">Find a Mentor</Button>
            </Link>
            <Link href="/auth/signup/become-mentor">
              <Button variant="outline" size="lg">
                Become a Mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
