import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function SignupPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
