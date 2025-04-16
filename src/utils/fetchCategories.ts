export const fetchCategories = async () => {
  const response = await fetch("http://localhost:5000/categories", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  return result;
};
