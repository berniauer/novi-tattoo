import { NextRequest, NextResponse } from "next/server";
import { createBookingInquiry, uploadFileToDirectus } from "@/lib/directus";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Upload skin photo first if present
    let skinPhotoId: string | null = null;
    const skinPhoto = formData.get("skin_photo") as File | null;
    if (skinPhoto && skinPhoto.size > 0) {
      skinPhotoId = await uploadFileToDirectus(skinPhoto);
    }

    // Upload reference images
    const referenceImageIds: string[] = [];
    const refImages = formData.getAll("reference_images") as File[];
    for (const file of refImages) {
      if (file.size > 0) {
        const id = await uploadFileToDirectus(file);
        referenceImageIds.push(id);
      }
    }

    // Create the booking record
    const result = await createBookingInquiry({
      name:            formData.get("name") as string,
      email:           formData.get("email") as string,
      instagram:       formData.get("instagram") as string,
      age_confirmed:   formData.get("age_confirmed") === "true",
      style:           formData.get("style") as string,
      placement:       formData.get("placement") as string,
      placement_ids:   JSON.parse(formData.get("placement_ids") as string ?? "[]"),
      size_cm:         Number(formData.get("size_cm")),
      concept:         formData.get("concept") as string,
      reference_images: referenceImageIds,
      skin_photo:      skinPhotoId,
    });

    return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
  } catch (err) {
    console.error("[/api/booking]", err);
    return NextResponse.json({ ok: false, error: "Submission failed" }, { status: 500 });
  }
}
