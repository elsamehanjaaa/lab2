export const checkCategoryName = async (slug: string): Promise<any> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/checkCategoryName`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ slug }),
    }
  );
  console.log(res);

  if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
  const result = await res.json();
  return result;
};
