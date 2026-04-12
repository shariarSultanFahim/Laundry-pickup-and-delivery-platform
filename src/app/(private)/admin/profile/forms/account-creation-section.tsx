"use client";

import { useRef, type ChangeEvent } from "react";

import { UserPlus, UserRoundPlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateAdmin } from "@/lib/actions/user/use-create-admin";
import { useCreateOperator } from "@/lib/actions/user/use-create-operator";
import { useGetMe } from "@/lib/actions/user/use-get-me";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/ui";

import {
  createAdminSchema,
  createOperatorSchema,
  type CreateAdminFormData,
  type CreateOperatorFormData
} from "../schema/create-account.schema";

const adminDefaultValues: CreateAdminFormData = {
  name: "",
  email: "",
  password: "",
  phone: "",
  imageFile: null
};

const operatorDefaultValues: CreateOperatorFormData = {
  name: "",
  email: "",
  password: "",
  imageFile: null
};

export default function AccountCreationSection() {
  const adminFileInputRef = useRef<HTMLInputElement>(null);
  const operatorFileInputRef = useRef<HTMLInputElement>(null);

  const { data: meResponse, isLoading: isLoadingMe } = useGetMe();
  const { mutateAsync: createAdmin, isPending: isCreatingAdmin } = useCreateAdmin();
  const { mutateAsync: createOperator, isPending: isCreatingOperator } = useCreateOperator();

  const adminForm = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: adminDefaultValues
  });

  const operatorForm = useForm<CreateOperatorFormData>({
    resolver: zodResolver(createOperatorSchema),
    defaultValues: operatorDefaultValues
  });

  if (isLoadingMe) {
    return null;
  }

  const role = meResponse?.data.role;
  if (role !== "SUPER_ADMIN") {
    return null;
  }

  function handleAdminImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    adminForm.setValue("imageFile", selectedFile, {
      shouldDirty: true,
      shouldValidate: true
    });
    event.target.value = "";
  }

  function handleOperatorImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    operatorForm.setValue("imageFile", selectedFile, {
      shouldDirty: true,
      shouldValidate: true
    });
    event.target.value = "";
  }

  async function handleCreateAdmin(values: CreateAdminFormData) {
    const toastId = toast.loading("Creating admin account...", { position: "top-center" });

    try {
      await createAdmin({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        imageFile: values.imageFile ?? undefined
      });

      toast.success("Admin account created successfully", {
        id: toastId,
        position: "top-center"
      });
      adminForm.reset(adminDefaultValues);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Failed to create admin account. Please try again.";

      toast.error(message, {
        id: toastId,
        position: "top-center"
      });
    }
  }

  async function handleCreateOperator(values: CreateOperatorFormData) {
    const toastId = toast.loading("Creating operator account...", { position: "top-center" });

    try {
      await createOperator({
        name: values.name,
        email: values.email,
        password: values.password,
        imageFile: values.imageFile ?? undefined
      });

      toast.success("Operator account created successfully", {
        id: toastId,
        position: "top-center"
      });
      operatorForm.reset(operatorDefaultValues);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Failed to create operator account. Please try again.";

      toast.error(message, {
        id: toastId,
        position: "top-center"
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Accounts</CardTitle>
        <CardDescription>Create admin and operator accounts from a single section</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="admin">
              <UserPlus className="size-4" />
              Create Admin
            </TabsTrigger>
            <TabsTrigger value="operator">
              <UserRoundPlus className="size-4" />
              Create Operator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="mt-0">
            <Form {...adminForm}>
              <form onSubmit={adminForm.handleSubmit(handleCreateAdmin)} className="space-y-4">
                <div className="gap-4 md:grid-cols-2 grid grid-cols-1">
                  <FormField
                    control={adminForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input disabled={isCreatingAdmin} placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adminForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isCreatingAdmin}
                            placeholder="+8801712345678"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="gap-4 md:grid-cols-2 grid grid-cols-1">
                  <FormField
                    control={adminForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isCreatingAdmin}
                            type="email"
                            placeholder="john.admin@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            disabled={isCreatingAdmin}
                            placeholder="Enter password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={adminForm.control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image (Optional)</FormLabel>
                      <FormControl>
                        <div className="gap-3 flex flex-wrap items-center">
                          <input
                            ref={adminFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAdminImageChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isCreatingAdmin}
                            onClick={() => adminFileInputRef.current?.click()}
                          >
                            Choose Image
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {field.value?.name ?? "No file selected"}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isCreatingAdmin} className="w-full">
                  {isCreatingAdmin ? "Creating Admin..." : "Create Admin"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="operator" className="mt-0">
            <Form {...operatorForm}>
              <form
                onSubmit={operatorForm.handleSubmit(handleCreateOperator)}
                className="space-y-4"
              >
                <div className="gap-4 md:grid-cols-2 grid grid-cols-1">
                  <FormField
                    control={operatorForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input disabled={isCreatingOperator} placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={operatorForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isCreatingOperator}
                            type="email"
                            placeholder="john.operator@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={operatorForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          disabled={isCreatingOperator}
                          placeholder="Enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={operatorForm.control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image (Optional)</FormLabel>
                      <FormControl>
                        <div className="gap-3 flex flex-wrap items-center">
                          <input
                            ref={operatorFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleOperatorImageChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isCreatingOperator}
                            onClick={() => operatorFileInputRef.current?.click()}
                          >
                            Choose Image
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {field.value?.name ?? "No file selected"}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isCreatingOperator} className="w-full">
                  {isCreatingOperator ? "Creating Operator..." : "Create Operator"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
