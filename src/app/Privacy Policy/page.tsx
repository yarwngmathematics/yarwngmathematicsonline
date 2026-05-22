import PolicyLayout from "../components/PolicyLayout";

export const metadata = {
  title: "Privacy Policy | Yarwng Mathematics",
  description: "Privacy Policy for Yarwng Mathematics online coaching platform.",
};

export default function PrivacyPage() {
  return (
    <PolicyLayout
      badge="Legal · Privacy Policy"
      title="Privacy Policy"
      subtitle="Yarwng Mathematics · yarwngmathematicsonline.vercel.app"
      effectiveDate="June 2025"
      intro="This Privacy Policy describes how Yarwng Mathematics (9366030347) and its affiliates collect, use, share, protect and process your personal data through our Platform. By visiting this Platform, providing your information, or availing any product/service offered, you expressly agree to be bound by the terms of this Privacy Policy and the applicable laws of India."
      sections={[
        {
          title: "Information We Collect",
          items: [
            "Personal data provided during sign-up or registration such as name, date of birth, address, telephone/mobile number, and email ID.",
            "Sensitive personal data such as bank account, credit/debit card, or other payment instrument information collected with your consent.",
            "Behavioural data such as preferences, browsing patterns, and other information you choose to provide on our Platform.",
            "Transaction data related to your purchases and interactions on the Platform.",
            "You always have the option to not provide information by choosing not to use a particular service or feature on the Platform.",
          ],
        },
        {
          title: "How We Use Your Information",
          items: [
            "To provide the services you request and fulfil orders placed on the Platform.",
            "To enhance customer experience and resolve disputes or troubleshoot problems.",
            "To inform you about online and offline offers, products, services, and updates.",
            "To detect and protect against error, fraud, and other criminal activity.",
            "To conduct marketing research, analysis, and surveys to improve our services.",
            "To enforce our Terms and Conditions and comply with legal obligations.",
          ],
        },
        {
          title: "Sharing of Information",
          items: [
            "We may share your personal data internally within our group entities and affiliates to provide access to services and products offered by them.",
            "We may disclose personal data to third parties such as business partners, payment processors, and logistics partners as required to provide services.",
            "We may disclose personal data to government agencies or law enforcement if required by law or court orders.",
            "We shall not be responsible for third-party business partners' privacy practices. Please read their privacy policies before disclosing any information.",
            "Never share your debit/credit card PIN or net-banking passwords with anyone claiming to be from Yarwng Mathematics.",
          ],
        },
        {
          title: "Security Precautions",
          items: [
            "We adopt reasonable security practices and procedures to protect your personal data from unauthorised access, disclosure, loss, or misuse.",
            "We adhere to security guidelines to protect your information against unauthorised access whenever you access your account.",
            "Transmission of information over the internet is not completely secure for reasons beyond our control. Users accept this inherent risk.",
            "Users are responsible for ensuring the protection of login and password records for their account.",
          ],
        },
        {
          title: "Data Retention & Deletion",
          items: [
            "You can delete your account by visiting your profile and settings on our Platform, which will result in losing all information related to your account.",
            "We retain your personal data for no longer than is required for the purpose for which it was collected or as required under applicable law.",
            "We may retain data related to you if we believe it may be necessary to prevent fraud or future abuse or for other legitimate purposes.",
            "We may continue to retain your data in anonymised form for analytical and research purposes.",
            "To request account deletion, write to us at yarwngmathematics@gmail.com.",
          ],
        },
        {
          title: "Your Rights & Consent",
          items: [
            "You may access, rectify, and update your personal data directly through the functionalities provided on the Platform.",
            "By visiting our Platform or providing your information, you consent to the collection, use, storage, and processing of your information as described in this Privacy Policy.",
            "You have the option to withdraw your consent by writing to us at the contact information provided below with the subject: 'Withdrawal of consent for processing personal data'.",
            "Withdrawal of consent will not be retrospective and will be in accordance with the Terms of Use and applicable laws.",
            "We may alert or notify you about significant changes to this Privacy Policy as required under applicable laws.",
          ],
        },
      ]}
      contactNote="For any grievances or queries related to your personal data or this Privacy Policy, please contact our Grievance Officer via email or phone. We are available Monday–Friday, 9:00 AM – 6:00 PM."
    />
  );
}