"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NewsletterFormProps {
  className?: string;
  showPrivacyText?: boolean;
}

export function NewsletterForm({
  className,
  showPrivacyText = true,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message);
        // For test emails (Ethereal), store the preview URL
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
        }
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={className}>
      {status === "idle" ? (
        <form onSubmit={handleSubscribe} className="space-y-2">
          <div className="flex">
            <Input
              type="email"
              placeholder="Your email"
              className="rounded-r-none"
              aria-label="Email for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="rounded-l-none">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
          {showPrivacyText && (
            <p className="text-xs text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          )}
        </form>
      ) : status === "loading" ? (
        <div className="flex items-center justify-center py-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          <Alert variant={status === "success" ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {status === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message}</AlertDescription>
            </div>
          </Alert>

          {previewUrl && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => window.open(previewUrl, "_blank")}
            >
              View Verification Email
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              setStatus("idle");
              setEmail("");
              setPreviewUrl(null);
            }}
          >
            Subscribe again
          </Button>
        </div>
      )}
    </div>
  );
}
