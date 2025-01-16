"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Speech } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";

const SpeechPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [speech, setSpeech] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSpeech(undefined);

      const response = await axios.post("/api/speech", values);
      // Correct path to audio_resource_url
      console.log(response.data.google.audio_resource_url);

      setSpeech(response.data.google.audio_resource_url);
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // This checks if it's an Axios error
        if (error.response?.status === 403) {
          proModal.onOpen();
        } else {
          toast.error("Something went wrong.");
        }
      } else {
        // Handle non-Axios errors here
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Speech Generation"
        description="Turn your prompt into speech."
        icon={Speech}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Hello I am Amy!"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Generate
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {!speech && !isLoading && <Empty label="No music generated." />}
        {speech && (
          <audio controls className="w-full mt-8">
            <source src={speech} />
          </audio>
        )}
      </div>
    </div>
  );
};

export default SpeechPage;
