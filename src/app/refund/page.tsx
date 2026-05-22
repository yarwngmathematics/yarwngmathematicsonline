import PolicyLayout from "../../components/PolicyLayout";

export const metadata = {
  title: "Refund & Cancellation Policy | Yarwng Mathematics",
  description: "Refund, Cancellation and Return Policy for Yarwng Mathematics online coaching platform.",
};

export default function RefundPage() {
  return (
    <PolicyLayout
      badge="Legal · Refund & Cancellation"
      title="Refund & Cancellation Policy"
      subtitle="Yarwng Mathematics · yarwngmathematicsonline.vercel.app"
      effectiveDate="June 2025"
      intro="This Refund and Cancellation Policy outlines how you can cancel or seek a refund for a service that you have purchased through the Platform. Please read this policy carefully before making any payment. By completing a transaction on our Platform, you agree to be bound by the terms stated below."
      sections={[
        {
          title: "Cancellation Policy",
          items: [
            "Cancellations will only be considered if the request is made within 7 days of placing the order.",
            "Cancellation requests may not be entertained if the enrollment process has already been initiated and access to class resources (WhatsApp group, Google Meet link) has been provided.",
            "Yarwng Mathematics does not accept cancellation requests for services that are time-based or session-based once a class session has been attended.",
            "To raise a cancellation request, contact us at yarwngmathematics@gmail.com or call 9366030347 within the specified period.",
          ],
        },
        {
          title: "Refund Policy",
          items: [
            "Refund requests will be considered if raised within 7 days of the date of purchase or payment.",
            "If 7 days have passed since your purchase, no refund, return, or exchange of any kind will be offered.",
            "In case of receipt of a defective or unsatisfactory service experience, please report to our customer service team within 7 days of the issue.",
            "Approved refunds will be processed within 1 business day of approval back to the original payment method.",
            "No refund will be issued for partially attended monthly batches unless there is a technical failure on our end.",
          ],
        },
        {
          title: "Return Policy",
          items: [
            "As our services are digital and educational in nature, physical returns are not applicable.",
            "A 'return' in the context of this Platform refers to withdrawal from a batch/course within the eligible refund window.",
            "To become eligible for a return or exchange, the service must be unused (i.e., no class session attended, no group access used).",
            "Items or services purchased on a discounted/offer rate may not be eligible for a return or exchange.",
            "Once a return/exchange request is accepted and verified by us, we will notify you via the email or WhatsApp number provided at registration.",
          ],
        },
        {
          title: "Non-Refundable Situations",
          items: [
            "Fees paid for classes already attended or sessions already accessed are non-refundable.",
            "Registration fees (if applicable separately) are non-refundable once processing is complete.",
            "Any fees paid under a promotional or special offer scheme are non-refundable.",
            "Refunds will not be processed if the cancellation or return request is made after the 7-day window.",
          ],
        },
        {
          title: "How to Request a Refund",
          items: [
            "Step 1: Email us at yarwngmathematics@gmail.com with subject: 'Refund Request – [Your Name] – [Class]'.",
            "Step 2: Include your registered WhatsApp number, transaction/UTR ID, and reason for the refund.",
            "Step 3: Our team will review and respond within 2 business days.",
            "Step 4: If approved, the refund will be credited within 1 business day to your original payment method.",
          ],
        },
      ]}
      contactNote="For all refund, cancellation, or return queries, please reach out within 7 days of your transaction. Include your name, class, and transaction ID in all communications."
    />
  );
}