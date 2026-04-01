import { Suspense } from "react";

import ResetPasswordForm from "./component/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <section className="flex items-center justify-center bg-background">
      {/* useSearchParams requires Suspense boundary in Next.js App Router */}
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </section>
  );
}
