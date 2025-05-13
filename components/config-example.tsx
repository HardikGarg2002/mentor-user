"use client";

import * as React from "react";
import {
  APP,
  AUTH,
  API,
  PATHS,
  LINKS,
  FEATURES,
  Constants,
  DATETIME,
  UI,
} from "@/config";
import { formatDate, formatTime } from "@/components/dashboard/date-formatting";

/**
 * This component demonstrates how to use the centralized configuration
 * values throughout the application.
 */
export function ConfigExample() {
  const currentDate = new Date();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2
        style={{ color: UI.COLORS.primary[700] }}
        className="text-2xl font-semibold mb-4"
      >
        {APP.NAME} Configuration Example
      </h2>

      <div className="space-y-6">
        {/* Application Info */}
        <section className="border-b pb-4">
          <h3
            style={{ color: UI.COLORS.accent[500] }}
            className="font-medium mb-2"
          >
            Application Info
          </h3>
          <ul className="space-y-1">
            <li>Name: {APP.NAME}</li>
            <li>Version: {APP.VERSION}</li>
            <li>Description: {APP.DESCRIPTION}</li>
            <li>Base URL: {APP.BASE_URL}</li>
          </ul>
        </section>

        {/* API Endpoints */}
        <section className="border-b pb-4">
          <h3
            style={{ color: UI.COLORS.accent[500] }}
            className="font-medium mb-2"
          >
            API Endpoints
          </h3>
          <ul className="space-y-1">
            <li>Users API: {API.ENDPOINTS.USERS}</li>
            <li>Auth API: {API.ENDPOINTS.AUTH}</li>
            <li>Sessions API: {API.ENDPOINTS.SESSIONS}</li>
          </ul>
        </section>

        {/* Authentication Routes */}
        <section className="border-b pb-4">
          <h3
            style={{ color: UI.COLORS.accent[500] }}
            className="font-medium mb-2"
          >
            Auth Routes
          </h3>
          <ul className="space-y-1">
            <li>
              Sign In:{" "}
              <a
                href={AUTH.ROUTES.SIGN_IN}
                className="text-blue-500 hover:underline"
              >
                {AUTH.ROUTES.SIGN_IN}
              </a>
            </li>
            <li>
              Sign Up:{" "}
              <a
                href={AUTH.ROUTES.SIGN_UP}
                className="text-blue-500 hover:underline"
              >
                {AUTH.ROUTES.SIGN_UP}
              </a>
            </li>
            <li>
              Forgot Password:{" "}
              <a
                href={AUTH.ROUTES.FORGOT_PASSWORD}
                className="text-blue-500 hover:underline"
              >
                {AUTH.ROUTES.FORGOT_PASSWORD}
              </a>
            </li>
          </ul>
        </section>

        {/* Application Routes */}
        <section className="border-b pb-4">
          <h3
            style={{ color: UI.COLORS.accent[500] }}
            className="font-medium mb-2"
          >
            Application Routes
          </h3>
          <ul className="space-y-1">
            <li>
              Home:{" "}
              <a href={PATHS.HOME} className="text-blue-500 hover:underline">
                {PATHS.HOME}
              </a>
            </li>
            <li>
              Dashboard:{" "}
              <a
                href={PATHS.DASHBOARD}
                className="text-blue-500 hover:underline"
              >
                {PATHS.DASHBOARD}
              </a>
            </li>
            <li>
              Profile:{" "}
              <a href={PATHS.PROFILE} className="text-blue-500 hover:underline">
                {PATHS.PROFILE}
              </a>
            </li>
            <li>
              Settings:{" "}
              <a
                href={PATHS.SETTINGS}
                className="text-blue-500 hover:underline"
              >
                {PATHS.SETTINGS}
              </a>
            </li>
          </ul>
        </section>

        {/* External Links */}
        <section className="border-b pb-4">
          <h3
            style={{ color: UI.COLORS.accent[500] }}
            className="font-medium mb-2"
          >
            External Links
          </h3>
          <ul className="space-y-1">
            <li>
              Twitter:{" "}
              <a
                href={LINKS.SOCIAL.TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {LINKS.SOCIAL.TWITTER}
              </a>
            </li>
            <li>
              Terms of Service:{" "}
              <a
                href={LINKS.LEGAL.TERMS}
                className="text-blue-500 hover:underline"
              >
                {LINKS.LEGAL.TERMS}
              </a>
            </li>
            <li>
              Support:{" "}
              <a
                href={LINKS.SUPPORT.HELP_CENTER}
                className="text-blue-500 hover:underline"
              >
                {LINKS.SUPPORT.HELP_CENTER}
              </a>
            </li>
          </ul>
        </section>

        {/* Constants */}
        <section className="border-b pb-4">
          <h3
            style={{ color: UI.COLORS.accent[500] }}
            className="font-medium mb-2"
          >
            Application Constants
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-1">User Roles</h4>
              <ul className="space-y-1 text-sm">
                <li>Admin: {Constants.ROLES.ADMIN}</li>
                <li>User: {Constants.ROLES.USER}</li>
                <li>Mentor: {Constants.ROLES.MENTOR}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Session Status</h4>
              <ul className="space-y-1 text-sm">
                <li>Scheduled: {Constants.SESSION_STATUS.SCHEDULED}</li>
                <li>Completed: {Constants.SESSION_STATUS.COMPLETED}</li>
                <li>Cancelled: {Constants.SESSION_STATUS.CANCELLED}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Date Formatting */}
        <section className="border-b pb-4">
          <h3
            style={{ color: UI.COLORS.accent[500] }}
            className="font-medium mb-2"
          >
            Date & Time Formatting
          </h3>
          <ul className="space-y-1">
            <li>Current Date (display format): {formatDate(currentDate)}</li>
            <li>Current Time (display format): {formatTime(currentDate)}</li>
            <li>Default Timezone: {DATETIME.DEFAULT_TIMEZONE}</li>
          </ul>
        </section>

        {/* Feature Flags */}
        <section>
          <h3
            style={{ color: UI.COLORS.accent[500] }}
            className="font-medium mb-2"
          >
            Feature Flags
          </h3>
          <ul className="space-y-1">
            <li>Payments Enabled: {FEATURES.ENABLE_PAYMENTS ? "Yes" : "No"}</li>
            <li>
              Notifications Enabled:{" "}
              {FEATURES.ENABLE_NOTIFICATIONS ? "Yes" : "No"}
            </li>
            <li>
              Maintenance Mode:{" "}
              {FEATURES.MAINTENANCE_MODE ? "Enabled" : "Disabled"}
            </li>
            <li>Debug Mode: {FEATURES.DEBUG_MODE ? "Enabled" : "Disabled"}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
