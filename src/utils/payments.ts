export const verifySession = async (session_id: string): Promise<any> => {
  try {
    console.log(JSON.stringify({ session_id }));
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payments/verify-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id }),
      }
    );

    const data = await backendResponse.json();
    if (!backendResponse.ok)
      throw new Error(`HTTP Error! Status: ${backendResponse.status}`);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
};
export const getOrder = async (session_id: string): Promise<any> => {
  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/get-order-by-session`,
      {
        method: "POST",
        body: JSON.stringify(session_id),
      }
    );

    const data = await backendResponse.json();
    if (!backendResponse.ok)
      throw new Error(`HTTP Error! Status: ${backendResponse.status}`);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
};
