import { ReviewSystemDemo } from "@/components/dashboard/review-system-demo";

export default function ReviewDemoPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Review & Feedback System</h1>
      <p className="text-gray-600 mb-8">
        This page demonstrates the review and feedback system for mentors and
        mentees. Mentees can leave reviews for their mentors after completed
        sessions, and mentors can view the feedback they've received.
      </p>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-medium mb-3">Frontend Components</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>ReviewDialog:</strong> Popup where mentees can leave
              ratings and reviews
            </li>
            <li>
              <strong>FeedbackDialog:</strong> Popup where mentors can view
              feedback
            </li>
            <li>
              <strong>MentorReviews:</strong> Component to display all reviews
              for a mentor
            </li>
            <li>
              <strong>StarRating:</strong> Interactive rating component with
              hover effects
            </li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-medium mb-3">Backend Integration</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Server Actions:</strong> Used for data fetching and
              mutation
            </li>
            <li>
              <strong>API Routes:</strong> REST endpoints for review submission
              and retrieval
            </li>
            <li>
              <strong>MongoDB:</strong> Reviews are stored in the Session model
            </li>
            <li>
              <strong>Caching:</strong> Path revalidation for immediate updates
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-8 p-6 border rounded-lg bg-amber-50">
        <h2 className="text-lg font-medium mb-3">Implementation Notes</h2>
        <p className="text-sm text-gray-700 mb-4">
          The review system is fully integrated with the backend through both
          server actions and API routes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li>
            Reviews are submitted to{" "}
            <code className="bg-gray-100 px-1 rounded">
              /actions/review-actions.ts
            </code>{" "}
            server action
          </li>
          <li>
            API endpoints are available at{" "}
            <code className="bg-gray-100 px-1 rounded">
              /api/sessions/[id]/review
            </code>{" "}
            for individual reviews
          </li>
          <li>
            Mentor reviews can be fetched from{" "}
            <code className="bg-gray-100 px-1 rounded">
              /api/mentors/[id]/reviews
            </code>
          </li>
          <li>
            When a review is submitted, the mentor's average rating is
            automatically updated
          </li>
        </ul>
      </div>

      <ReviewSystemDemo />
    </div>
  );
}
