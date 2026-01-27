import LoginForm from "./_component/LoginForm";
import AuthCard from "@/components/ui/cards/AuthCard";

export default function LoginPage() {
  return (
      <div className="max-w-5xl mx-auto">
        <AuthCard
            title="Welcome Back!"
            description="Login into your existing Familj Account."
            image="/images/auth/login.png"
        >
          <LoginForm/>
        </AuthCard>
      </div>
  );
}
