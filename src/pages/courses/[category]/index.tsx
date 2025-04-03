import { useRouter } from "next/router";

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <div>
      <h1>Category: {category}</h1>
      {category ? (
        <p>Showing courses for the "{category}" category.</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CategoryPage;
