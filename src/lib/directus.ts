import { createDirectus, rest, staticToken, uploadFiles, createItem } from "@directus/sdk";

interface BookingInquiry {
  status: "new";
  name: string;
  email: string;
  instagram: string;
  age_confirmed: boolean;
  style: string;
  placement: string;
  placement_ids: string[];
  size_cm: number;
  concept: string;
  reference_images: string[];
  skin_photo: string | null;
}

const directus = createDirectus(process.env.DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_TOKEN!))
  .with(rest());

export async function uploadFileToDirectus(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await directus.request(uploadFiles(formData));
  return result.id as string;
}

export async function createBookingInquiry(data: Omit<BookingInquiry, "status">) {
  return directus.request(
    createItem("booking_inquiries", { ...data, status: "new" })
  );
}
