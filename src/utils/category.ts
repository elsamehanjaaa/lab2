export const checkCategoryName = async (slug: string): Promise<any> => {
  const res = await fetch(
    "http://localhost:5000/categories/checkCategoryName",
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
