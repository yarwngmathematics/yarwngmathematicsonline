import PolicyLayout from "../../components/PolicyLayout";

export const metadata = {
  title: "Shipping Policy | Yarwng Mathematics",
  description: "Shipping and Delivery Policy for Yarwng Mathematics online coaching platform.",
};

export default function ShippingPage() {
  return (
    <PolicyLayout
      badge="Legal · Shipping & Delivery"
      title="Shipping & Delivery Policy"
      subtitle="Yarwng Mathematics · yarwngmathematicsonline.vercel.app"
      effectiveDate="June 2025"
      intro="Yarwng Mathematics is a digital education platform offering online coaching services via Google Meet. As our services are primarily digital, physical shipping is not applicable for the majority of our offerings. This policy outlines how your access to services is delivered and confirmed after payment."
      sections={[
        {
          title: "Digital Service Delivery",
          items: [
            "All services offered on this Platform are digital in nature — primarily online coaching classes conducted via Google Meet.",
            "Upon successful payment and registration, you will receive access to the relevant WhatsApp batch group and Google Meet session links.",
            "Delivery of our services will be confirmed on your registered WhatsApp number and/or email ID as specified at the time of registration.",
            "Service access is typically granted within 1 business day from the date of confirmed payment.",
          ],
        },
        {
          title: "Order Processing",
          items: [
            "Orders/registrations are processed within 1 business day from the date of payment confirmation.",
            "The Platform Owner shall not be liable for any delay in access due to incorrect contact details provided by the user at the time of registration.",
            "If you do not receive confirmation within 1 business day, please contact us immediately at yarwngmathematics@gmail.com or 9366030347.",
          ],
        },
        {
          title: "Physical Materials (If Applicable)",
          items: [
            "If any physical study materials are dispatched in future, they will be shipped via registered domestic courier companies or speed post only.",
            "Physical orders will be shipped within 1–3 business days from the date of order confirmation and payment.",
            "Delivery will be made to the address provided by the buyer at the time of purchase. Please ensure your address is accurate.",
            "The Platform Owner shall not be liable for any delay in delivery caused by the courier company or postal authority.",
            "Any shipping costs levied by the Platform Owner are non-refundable.",
          ],
        },
        {
          title: "Service Availability",
          items: [
            "Our online classes are available to students across India via Google Meet.",
            "A stable internet connection is required to attend online sessions. We are not liable for connectivity issues on the student's end.",
            "Class schedules are fixed and communicated in advance. Missed classes due to student unavailability are non-refundable.",
            "In the event of technical failure on our end causing a class cancellation, a makeup session or equivalent compensation will be arranged.",
          ],
        },
        {
          title: "Contact for Delivery Issues",
          items: [
            "If you have not received your service access (WhatsApp group / Google Meet link) within 1 business day of payment, contact us immediately.",
            "Provide your name, registered WhatsApp number, class enrolled, and transaction/UTR ID when contacting support.",
            "Our support team operates Monday–Friday, 9:00 AM – 6:00 PM.",
          ],
        },
      ]}
      contactNote="For any delivery or access-related queries, contact us within 2 business days of your payment. We will resolve your issue as quickly as possible."
    />
  );
}