'use client'

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
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
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface GetStartedFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function Cadastro({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, isLoaded } = useSignUp();

  const form = useForm<GetStartedFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: GetStartedFormData) => {
    setError(null);
    if (data.password !== data.confirmPassword) {
      setError("As senhas não coincidem.");
      toast.error("Signup failed.", {
        description: "Passwords do not match.",
      });
      return;
    }
    if (!isLoaded) return;
    try {
      // Create the user with Clerk
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name,
      });

      setOpen(false);
      toast.success("Signup successful!", {
        description: "Your account has been created.",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.errors?.[0]?.message ||
        err.message ||
        "Erro ao criar conta."
      );
      toast.error("Signup failed.", {
        description: "Something went wrong during signup.",
      });
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
            Comece com o InvoiceGen
          </DialogTitle>
          <DialogDescription className="text-center">
            Crie sua conta para começar a gerar orçamentos profissionais
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="Crie uma senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme a senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirme sua senha"
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

            <Button type="submit" className="w-full" size="lg">
              Criar conta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <button
            onClick={() => setOpen(false)}
            className="text-blue-600 hover:underline font-medium"
          >
            Entrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}