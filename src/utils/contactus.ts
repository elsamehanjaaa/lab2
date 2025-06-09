export interface ContactMessage {
  _id: string;
  email: string;
  content: string;
  created_at: string;
}

interface CreateContactInput {
  email: string;
  content: string;
}

interface GetContactUsResponse {
  messages: ContactMessage[];
  error?: string;
}

export const getAll = async (): Promise<GetContactUsResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contactus`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const messages = await res.json();
    return { messages };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      messages: [],
      error: "Failed to load messages. Please try again later.",
    };
  }
};

export const create = async (
  data: CreateContactInput
): Promise<ContactMessage> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contactus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const message = await res.json();

  if (!res.ok) {
    throw new Error(message.message || "Failed to send message");
  }

  return message;
};
