'use client'

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LogIn } from "lucide-react";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";

interface SignInFormData {
  email: string;
  password: string;
}

export function Login({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter()

  const form = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    if (!isLoaded) return;
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful!", {
          description: "Welcome back!",
        });
        router.push('/dashboard')
        setOpen(false);
      } else {
        setError("Verificação adicional necessária.");
      }
    } catch (err: unknown) {
      toast.error("Login failed.", {
        description: "Please check your credentials and try again.",
      });
      if (typeof err === "object" && err !== null) {
        // @ts-expect-error Clerk error shape
        setError(err.errors?.[0]?.message || (err as { message?: string }).message || "Erro ao fazer login.");
      } else {
        setError("Erro ao fazer login.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Bem-vindo de volta
          </DialogTitle>
          <DialogDescription className="text-center">
            Faça login na sua conta InvoiceGen
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Digite seu e-mail" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Digite sua senha" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <div className="text-right">
              <button 
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            
            <Button type="submit" className="w-full" size="lg">
              Entrar
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <button 
            onClick={() => setOpen(false)}
            className="text-blue-600 hover:underline font-medium"
          >
            Comece gratuitamente
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}