import { useAdminLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import logoSrc from "@assets/wawra-logo.png";

const formSchema = z.object({
  password: z.string().min(1, "Password is required")
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    login.mutate({ data: { password: values.password } }, {
      onSuccess: () => {
        setLocation("/admin");
      },
      onError: () => {
        toast({
          title: "Login failed",
          description: "Invalid password",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl border shadow-sm flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-4">
          <img
            src={logoSrc}
            alt="Wawra"
            className="h-10 w-auto object-contain"
          />
          <p className="text-muted-foreground text-sm">Enter the password to access the dashboard</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 text-lg"
                      {...field}
                      data-testid="input-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-xl"
              disabled={login.isPending}
              data-testid="btn-login-submit"
            >
              {login.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Access Dashboard
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
