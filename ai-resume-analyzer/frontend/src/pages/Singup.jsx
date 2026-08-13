import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { toast } from "sonner";
import { request } from "@/utils/api";
import { useAuthStore } from "@/stores/authStore";

export function SignupForm({ ...props }) {
  useDocumentTitle("Signup | AI Document Analyzer");

  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic required field checks
    if (
      !form.name?.trim() ||
      !form.email?.trim() ||
      !form.password?.trim() ||
      !form.confirmPassword?.trim()
    ) {
      toast.error("All fields are required.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password length validation
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    // Password match validation
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await request({
        method: "POST",
        url: "/auth/register",
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        },
      });

      // Save token, refresh token, and user
      setToken(data.token);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      toast.success("Account created successfully!");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup failed", err);
      toast.error(err?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={form.email}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            {/* Submit button spanning both columns */}
            <div className="md:col-span-2">
              <Button type="submit" className="w-full mb-4" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <FieldDescription className="mt-4 text-start">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default SignupForm;
