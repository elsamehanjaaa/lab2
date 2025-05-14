export const checkCategoryName = async (category: string): Promise<any> => {
  const res = await fetch(
    "http://localhost:5000/categories/checkCategoryName",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ slug: category }),
    }
  );

  if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
  const result = await res.json();
};
