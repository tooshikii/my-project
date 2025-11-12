"use server";

export async function createPost(prevState: boolean, formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  console.log({ title, content });

  return true;
  // Update data`
  // Revalidate cache
}
