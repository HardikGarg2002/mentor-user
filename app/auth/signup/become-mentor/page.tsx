"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MentorApplicationForm } from "@/components/mentor-application-form"
import { CheckCircle, DollarSign, Users, Calendar } from "lucide-react"

export default function BecomeMentor() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Become a Mentor</h1>
        <p className="text-xl text-gray-600">
          Share your expertise, help others grow, and earn money on your own schedule
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center">
          <CardContent className="pt-6">
            <DollarSign className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Set Your Own Rates</h3>
            <p className="text-gray-600">
              You decide how much your time and expertise are worth. Set different rates for chat, video, and call
              sessions.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Build Your Network</h3>
            <p className="text-gray-600">
              Connect with mentees from around the world and build your professional network while helping others.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Calendar className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
            <p className="text-gray-600">
              Set your own availability and work when its convenient for you. No minimum time commitment required.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <ul className="space-y-6">
            <li className="flex">
              <CheckCircle className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Apply to be a mentor</h3>
                <p className="text-gray-600">
                  Fill out the application form with your professional background, areas of expertise, and why you want
                  to be a mentor.
                </p>
              </div>
            </li>
            <li className="flex">
              <CheckCircle className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Complete your profile</h3>
                <p className="text-gray-600">
                  Once approved, set up your profile with your bio, experience, education, and set your rates for
                  different session types.
                </p>
              </div>
            </li>
            <li className="flex">
              <CheckCircle className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Set your availability</h3>
                <p className="text-gray-600">
                  Use our calendar tool to mark when youre available for sessions. Update this anytime as your schedule
                  changes.
                </p>
              </div>
            </li>
            <li className="flex">
              <CheckCircle className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Start mentoring and earning</h3>
                <p className="text-gray-600">
                  Accept booking requests, conduct sessions, and receive payments directly to your account. We handle
                  all the payment processing.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <MentorApplicationForm />
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to make an impact?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our community of mentors today and start sharing your knowledge while earning on your own terms.
        </p>
        <Button size="lg" onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}>
          Apply Now
        </Button>
      </div>
    </div>
  )
}

