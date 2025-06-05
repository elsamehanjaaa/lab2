import React from "react";
import PlaceOrders from "@/components/ShoppingCart/PlaceOrders";
import { GetServerSideProps, NextPage } from "next";
import * as paymentUtils from "@/utils/payments";
import Link from "next/link";
import { OrderData } from "@/components/ShoppingCart/PlaceOrders";

// Import OrderItem type if not already imported
// import { OrderItem } from "@/components/ShoppingCart/PlaceOrders";

interface PlaceOrdersPageProps {
  order: OrderData | null; // Now uses the imported OrderData
  error?: string;
}

export const getServerSideProps: GetServerSideProps<
  PlaceOrdersPageProps
> = async (context) => {
  const session_id = context.query.session_id as string;

  if (!session_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const verificationResult = await paymentUtils.verifySession(session_id);

    if (!verificationResult || !verificationResult.isValid) {
      console.warn(
        `Verification failed for session_id: ${session_id}. Reason: ${verificationResult?.message}`
      );
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }

    const internalOrderId = verificationResult.orderId;
    if (!internalOrderId) {
      console.error(
        `Internal orderId not found in verification result for session_id: ${session_id}`
      );
      return {
        props: { order: null, error: "Could not retrieve order identifier." },
      };
    }
    const order = await paymentUtils.getOrder(internalOrderId);

    if (!order) {
      console.error(
        `Order not found for internalOrderId: ${internalOrderId} (session_id: ${session_id})`
      );
      return {
        props: {
          order: null,
          error: "Order details could not be retrieved at this time.",
        },
      };
    }

    return {
      props: { order },
    };
  } catch (error) {
    console.error(
      `Error in getServerSideProps for placeorder page (session_id: ${session_id}):`,
      error
    );
    return {
      redirect: {
        destination: "/?error=server_error",
        permanent: false,
      },
    };
  }
};

const PlaceOrdersPage: NextPage<PlaceOrdersPageProps> = ({ order, error }) => {
  if (error) {
    // Handle cases where order might be null due to an error message from GSSP
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Order
        </h1>
        <p className="text-gray-700 mb-6">{error || "Something went wrong."}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  if (!order) {
    // This case might be hit if GSSP returns props: { order: null } without an explicit error message prop
    // Or if you decide to redirect for all !order cases within GSSP itself.
    // For robustness, good to handle it.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Order details are currently unavailable.
        </h1>
        <p className="text-gray-600 my-4">
          Please check back shortly or contact support if this persists.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Pass the fetched order data to the PlaceOrders component */}
      <PlaceOrders order={order} />
    </div>
  );
};

export default PlaceOrdersPage;
