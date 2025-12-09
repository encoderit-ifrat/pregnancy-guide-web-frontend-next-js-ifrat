"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, ContactSchemaType } from "../_types/contact_us_types";
import { INITIAL_CONTACT_FORM_DATA } from "../_data/data";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import IconMessage from "@/assets/IconMessage";
import IconPhone from "@/assets/IconPhone";
import IconAddress from "@/assets/IconAddress";
import Header from "@/components/ui/SectionHeader";
import { Star } from "lucide-react";
import { useState } from "react";
import { useFeedback } from "../_api/mutation/useFeedback";
import { toast } from "sonner";

export default function ContactUsForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ContactSchemaType>({
    resolver: zodResolver(ContactSchema),
    defaultValues: INITIAL_CONTACT_FORM_DATA.data,
  });

  const { mutate: leaveFeedback, isPending } = useFeedback();

  const onSubmit = (values: ContactSchemaType) => {
    const body = {
      name: values?.firstName,
      email: values?.email,
      location: values?.location,
      // phone: values?.phone,
      content: values?.message,
      rating: rating,
    };
    leaveFeedback(body, {
      onSuccess(data) {
        toast.success(data?.data?.message || "Feedback successfully created");
      },
    });
    form.reset();
    setRating(0);
  };

  const contactDetails = [
    {
      id: 1,
      icon: <IconMessage />,
      description: "demo.transieco@gmail.com",
    },
    {
      id: 2,
      icon: <IconPhone />,
      description: "Call +1 845-309-7650",
    },
    {
      id: 3,
      icon: <IconAddress />,
      description: "2150 Candlelight Drive Splendora, TX 77372",
    },
  ];

  return (
    <section className="flex  flex-col md:flex-row max-w-5xl gap-8  mx-auto lg:mb-15  ">
      {/* Contact Details */}
      <div className="pb-5 flex-1 px-6 md:px-8 lg:px-14 py-4 md:py-8 lg:py-10 rounded-lg space-y-6 bg-soft-white  h-[360px] flex flex-col  ">
        {/* Title */}
        <div className="flex  lg:justify-start">
          <p className="text-3xl lg:text-4xl popover-foreground  lg:text-start  py-4 font-medium uppercase whitespace-nowrap">
            Contact Details
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-7">
          {contactDetails.map(({ id, icon, description }) => (
            <div
              key={id}
              className="flex items-center gap-3 text-base text-muted-gray"
            >
              <div className="min-w-[34px]">{icon}</div>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Form */}
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="lg:space-y-6 p-6 lg:p-10  pt-14 bg-soft-white rounded-2xl shadow-md"
          >
            <Header
              title="Leave us your feedback"
              titleClassName="lg:text-start"
              mainClassName="!px-0"
              description="Curabitur id mauris laoreet nulla semper posuere eu eu dui. Praesent faucibus, elit a euismod rhoncus."
              descriptionClassName="lg:text-start mt-6 !pb-0"
            />

            {/* Star Rating */}
            <div className="flex flex-col gap-2 py-4">
              <label className="text-sm font-medium">
                Rate your experience
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* First Name */}
              <div className="flex flex-col w-full">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          {...field}
                          className="w-full h-12 rounded-full lg:text-xl text-base text-text-mid"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col w-full">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="w-full h-12 rounded-full lg:text-xl text-base text-text-mid"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col w-full">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Phone"
                          {...field}
                          className="w-full h-12 rounded-full lg:text-xl text-base text-text-mid"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <div className="flex flex-col w-full">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Location"
                          {...field}
                          className="w-full h-12 rounded-full lg:text-xl text-base text-text-mid"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message */}
              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Your Message"
                          {...field}
                          className="w-full rounded-4xl lg:text-xl text-base text-text-mid"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full lg:w-xs mt-6 rounded-full uppercase lg:text-xl text-sm leading-[100%]"
              disabled={isPending}
              isLoading={isPending}
            >
              Confirm
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
