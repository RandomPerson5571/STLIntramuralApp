import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Rules and expectations for using the STL Intramural campus intramural platform.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="July 2026">
      <p>
        By creating an account on this app, you agree to follow these basic
        rules. Please read them carefully.
      </p>

      <section className="legal-section">
        <h2>1. Who Can Use This App</h2>
        <p>
          To register, you must be a current student, teacher, or staff member
          of our high school and possess a valid{" "}
          <strong>@ycdsbk12.ca</strong> email address.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Code of Conduct</h2>
        <p>
          Because this app is built for our school community, school rules apply
          here just like they do in the hallway. By using this app, you agree:
        </p>
        <ul>
          <li>
            <strong>No Spoofing / Impersonation:</strong> You will not sign up
            using someone else&apos;s email or pretend to be a teacher.
          </li>
          <li>
            <strong>No Griefing / Spamming:</strong> You will not repeatedly
            sign up and drop out of events to mess with attendance, or create
            fake events.
          </li>
          <li>
            <strong>No Inappropriate Content:</strong> Teachers creating events
            must use professional, school-appropriate language. No offensive or
            bullying language is tolerated in event titles or descriptions.
          </li>
        </ul>
        <p>
          Failure to follow these rules will result in your account being
          permanently banned, and we may report serious misuse to school
          administration.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Independent Student Project Disclaimer</h2>
        <p>
          Please note: This app is an independent, student-run project. While it
          is designed to help our school community, it is not officially built,
          maintained, or legally backed by the York Catholic District School
          Board (YCDSB).
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Limitation of Liability</h2>
        <p>
          We build and maintain this app on a best-effort basis in our spare
          time. We cannot guarantee that the app will always be online,
          error-free, or that event details will always be 100% accurate.
        </p>
        <ul>
          <li>
            <strong>Double-check your events:</strong> If an event is critical
            (like an exam review session or a sports tryout), always confirm the
            time and location with your teacher in real life.
          </li>
          <li>
            We are not responsible for missed events, lost sign-up spots, or
            technical glitches.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Changes to These Terms</h2>
        <p>
          We may update these terms as we add new features to the app. If we
          make major changes, we will post a notice inside the app. Continuing
          to use the app after changes are made means you agree to the updated
          terms.
        </p>
      </section>
    </LegalPageShell>
  );
}
