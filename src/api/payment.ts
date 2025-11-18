import { api } from "./http";

export type PaymentRequest = {
  purchaseId: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
};

export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export type PaymentResponse = {
  paymentId: string;
  status: PaymentStatus;
  message: string;
};

export async function processPayment(token: string, input: PaymentRequest) {
  const { data } = await api.post<PaymentResponse>("/payments", input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getPaymentStatus(token: string, paymentId: string) {
  const { data } = await api.get<Omit<PaymentResponse, "message">>(
    `/payments/${paymentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
}
